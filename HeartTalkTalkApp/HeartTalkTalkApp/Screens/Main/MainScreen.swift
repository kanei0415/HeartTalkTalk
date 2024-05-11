import SwiftUI
import FirebaseFirestore

struct MainScreen: View {
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    @State private var day: Int = 1
    
    @State var chattingItemUnscriber: ListenerRegistration? = nil {
        didSet {
            oldValue?.remove()
        }
    }
    
    @State var resultItemUnscriber: ListenerRegistration? = nil {
        didSet {
            oldValue?.remove()
        }
    }
    
    @State private var inputValue: String = ""
    
    @State private var sideVisible = false
    
    var title: String {
        if let titles = self.rootState.titles {
            return titles.count >= 1 ? titles[self.day - 1].label : "제목없음"
        }
        
        return "제목없음"
    }
    
    var responseBtnActive: Bool {
        if self.rootState.chattingItem?.createdAt != getCreatedDate() {
            return false
        }
        
        if let chattingItem = self.rootState.chattingItem {
            return !chattingItem.items.isEmpty && chattingItem.items.last?.sender  == "USER"
        }
        
        return false
    }
    
    func responseBtnTapped() {
        guard let user = self.rootState.user else {
            return;
        }
        
        FunctionsUtil.single.chattingResponseAdd(uid: user.uid, day: self.day) { res, err in
            guard let resData = res?.data as? ResponseData else {
                return;
            }
            
            
        }
    }
    
    func loadChattingItem(day: Int) {
        guard let uid = self.rootState.user?.uid else {
            return
        }
        
        let docRef = FirestoreUtil.single.getDocRef(
            resolvedCollectionPath: FirestoreUtil.single.getCollectionPathResolver(collection: .chattingItems)(["uid":uid]),
            documentID: String(day)
        )
        
        chattingItemUnscriber = docRef.addSnapshotListener({ ds, e in
            if let chattingItem = try? ds?.data(as: FirestoreChattingItem.self) {
                self.rootState.chattingItem = chattingItem
            }
        })
    }
    
    func loadResults(day: Int) {
        guard let uid = self.rootState.user?.uid else {
            return
        }
        
        let docRef = FirestoreUtil.single.getDocRef(
            resolvedCollectionPath: FirestoreUtil.single.getCollectionPathResolver(collection: .results)(["uid":uid]),
            documentID: String(day)
        )
        
        resultItemUnscriber = docRef.addSnapshotListener({ ds, e in
            if let results = try? ds?.data(as: FirestoreResult.self) {
                self.rootState.results = results
            }
        })
    }
    
    func loadTitles() {
        guard let uid = rootState.user?.uid else {
            rootState.path.removeLast()
            return
        }
        
        let titleCollectionRef = FirestoreUtil.single.getCollectionRef(
            resolvedCollectionPath: FirestoreUtil.single.getCollectionPathResolver(
                collection: .titles
            )(["uid": uid])
        )
        
        titleCollectionRef.addSnapshotListener { qs, e in
            guard let docs = qs?.documents else {
                return
            }
            
            Task {
                self.rootState.titles = docs.map { d in
                    guard let title = try? d.data(as: FirestoreTitle.self) else {
                        return FirestoreTitle(createdAt: 0, label: "Title Load Failed")
                    }
                    
                    return title
                }
            }
        }
    }
    
    func sendBtnTapped() {
        guard let uid = self.rootState.user?.uid else {
            return
        }
        
        let docRef = FirestoreUtil.single.getDocRef(
            resolvedCollectionPath: FirestoreUtil.single.getCollectionPathResolver(collection: .chattingItems)(["uid": uid]),
            documentID: String(self.day)
        )
        
        guard var prev = self.rootState.chattingItem?.items else {
            return
        }
        
        docRef.setData(["items": FieldValue.arrayUnion([["contents": self.inputValue, "sender": "USER"]])], merge: true)
        
        self.inputValue = ""
    }
    
    var body: some View {
        ZStack {
            self.mainScreenView
            
            if self.sideVisible {
                MainSideBar(sideVisible: self.$sideVisible, day: self.$day)
            }
        }
    }
}

extension MainScreen {
    func chattingIamgeView(chattingContent: String) -> some View {
        return  VStack {
            Text(chattingContent)
                .padding(10)
        }
        .layoutPriority(1)
        .background {
            RoundedRectangle(cornerRadius: 4)
                .stroke(Color.customBlueColor, lineWidth: 1)
                .background(Color.customZincColor)
        }
        .offset(y: 20)
    }
    
    var mainScreenView: some View {
        VStack {
            HStack {
                Button(action: {
                    self.sideVisible.toggle()
                }, label: {
                    Image(systemName: "gearshape")
                        .foregroundColor(.customBlackColor)
                })
                .frame(width: 28, height: 28)
                
                Spacer()
                
                Text(self.title)
                    .font(Font.getCustomFontStyle(
                            customFont: .pretendard,
                            fontWeight: .bold,
                            size: 18
                        )
                    )
                    .foregroundStyle(Color.customBlackColor)
                
                Spacer()
                
                Button(action: {}, label: {
                    Image(systemName: "arrow.right")
                        .foregroundColor(.customBlackColor)
                })
                .frame(width: 28, height: 28)
            }
            .frame(height: 28)
            .padding(12)
            .background(Color.customZincColor)
            
            ScrollView() {
                VStack(alignment: .leading) {
                    ForEach(self.rootState.chattingItem?.items ?? [], id: \.contents) { item in
                        if(item.sender == "SYSTEM") {
                            VStack(alignment: .leading) {
                                HStack(alignment: .top) {
                                    Image(Image.Icon.sender.rawValue)
                                        .frame(width: 40)
                                    
                                    self.chattingIamgeView(chattingContent: item.contents)
                                }
                            }
                            .padding(.top, 20)
                        } else {
                            VStack(alignment: .trailing) {
                                HStack(alignment: .top) {
                                    self.chattingIamgeView(chattingContent: item.contents)
                                    
                                    if let profile = self.rootState.user?.image {
                                        AsyncImage(url: URL(string: profile)) { image in
                                            image
                                                .resizable()
                                                .scaledToFit()
                                                .frame(width: 40, height: 40)
                                                .clipShape(Circle())
                                        } placeholder: {
                                            Circle().frame(width: 40, height: 40)
                                                .background(Color.customBlackColor)
                                        }
                                    } else {
                                        Circle().frame(width: 40, height: 40)
                                            .background(Color.customBlackColor)
                                    }
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .trailing)
                            .padding(.top, 20)
                        }
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                
                VStack {
                    CButtonComponent(
                        active: self.responseBtnActive,
                        buttonLabel: "답변 받기",
                        onTapGesturedHandler: { responseBtnTapped() }
                    )
                }
                .padding(.top, 40)
            }
            .frame(maxWidth: .infinity)
            .layoutPriority(1)
            
            if self.rootState.chattingItem?.createdAt == getCreatedDate() {
                HStack(spacing: 20) {
                    TextField(
                        "내용을 입력해주세요",
                        text: self.$inputValue
                    )
                    .padding(.horizontal, 20)
                    .layoutPriority(1)
                    .frame(height: 40)
                    .background(Color.customPinkColor)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    
                    Button(action: { sendBtnTapped() }) {
                        Image(Image.Icon.send.rawValue)
                    }
                    .frame(width: 40, height: 40)
                    .background(Color.customPinkColor)
                    .clipShape(Circle())
                }
                .frame(height: 40)
                .padding(.horizontal, 20)
                .background(Color.customZincColor)
            }
        }
        .onAppear {
            self.loadTitles()
            self.loadChattingItem(day: 1)
            self.loadResults(day: 1)
        }
        .onChange(of: self.day) {
            self.loadResults(day: self.day)
            self.loadChattingItem(day: self.day)
        }
    }
}
