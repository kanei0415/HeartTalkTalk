import SwiftUI
import SwiftData
import FirebaseAuth

struct MainSideBar: View {
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    @Binding var sideVisible: Bool
    
    @Query var loginInfos: [LoginInfo]
    
    @Environment(\.modelContext) private var context
    
    private let iamPortPaymentViewController = IamportPaymentViewController()
    
    var isNewChatCreatable: Bool {
        guard let user = self.rootState.user else {
            return false
        }
        
        if user.days == user.reservedDays {
            return false
        }
        
        if self.rootState.titles?.isEmpty == true {
            return true
        }
        
        guard let last = self.rootState.titles?.last else {
            return false
        }
        
        return last.createdAt != getCreatedDate()
    }
    
    var body: some View {
        ZStack(alignment: .leading) {
            self.asideView
        }
        .ignoresSafeArea()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.customBlackColor.opacity(0.5))
        .onTapGesture {
            self.sideVisible = false
        }
        .onAppear {
            
        }
    }
    
    func onLogoutBtnTapped() {
        self.rootState.backDropVisible = true
        context.delete(loginInfos.last!)
        self.rootState.user = nil
        self.rootState.backDropVisible = false
    }
    
    func newChatStartTapped() {
        self.rootState.backDropVisible = true
        
        guard let user = self.rootState.user else {
            return
        }
        
        FunctionsUtil.single.newChattingCreate(uid: user.uid, createdAt: getCreatedDate()) { res, err in
            self.sideVisible = false
            self.rootState.backDropVisible = false
        }
    }
    
    func onPaymentBtnTapped() {
        self.rootState.iamportViewVisible = true
    }
    
    func onDeleteAccountBtnTapped() {
        self.rootState.backDropVisible = true
        
        guard let user = Auth.auth().currentUser else { return }
        
        Task {
            user.delete() {err in
                if err == nil {
                    self.rootState.user = nil
                    self.context.delete(loginInfos.last!)
                    self.rootState.backDropVisible = false
                }
            }
        }
    }
}

extension MainSideBar {
    var asideView: some View {
        GeometryReader { gp in
            VStack(alignment: .leading) {
                self.userProfileView
                
                CButtonComponent(
                    active: true, 
                    buttonLabel: "결제하기",
                    onTapGesturedHandler: { onPaymentBtnTapped() }
                )
                
                self.userDayListView
                
                Spacer()
                
                CButtonComponent(
                    active: true,
                    buttonLabel: "회원탈퇴",
                    onTapGesturedHandler: { onDeleteAccountBtnTapped() }
                ).padding(.bottom, 8)
                
                CButtonComponent(
                    active: true,
                    buttonLabel: "로그아웃",
                    onTapGesturedHandler: { self.onLogoutBtnTapped() })
            }
            .padding(.vertical, 60)
            .padding(.horizontal, 8)
            .frame(width: gp.size.width / 1.5, height: gp.size.height)
            .background(Color.customZincColor)
            .position(x: gp.size.width / 3, y: gp.size.height / 2)
        }
    }
    
    var userProfileView: some View {
        HStack {
            VStack(alignment: .leading) {
                if let userProfile = self.rootState.user?.image {
                    AsyncImage(url: URL(string: userProfile)) { image in
                        image
                            .resizable()
                            .scaledToFill()
                            .frame(width: 48, height: 48)
                            .clipShape(Circle())
                    } placeholder: {
                        VStack{ }
                            .frame(width: 48, height: 48)
                            .clipShape(Circle())
                            .overlay {
                                ProgressView()
                            }
                    }
                } else {
                    VStack{ }
                        .frame(width: 48, height: 48)
                        .clipShape(Circle())
                }
            }
            .layoutPriority(1)
            
            VStack(alignment: .trailing) {
                if let userName = self.rootState.user?.name {
                    Text(userName)
                        .font(
                            Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .bold, size: 16)
                        )
                        .foregroundStyle(Color.customBlackColor)
                }
                
                if let days = self.rootState.user?.days, let reservedDays = self.rootState.user?.reservedDays {
                    Text(String(days))
                        .font(
                            Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .bold, size: 20)
                        )
                        .foregroundStyle(Color.customPinkColor)
                    +
                    
                    Text("  /  \(reservedDays)")
                        .font(
                            Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .regular, size: 12)
                        )
                        .foregroundStyle(Color.customBlackColor)
                    
                    +
                    
                    Text(" 일째 상담중")
                        .font(
                            Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .regular, size: 14)
                        )
                        .foregroundStyle(Color.customBlackColor)
                }
            }
            .layoutPriority(1)
        }
    }
    
    var userDayListView: some View {
        ScrollView {
            VStack(alignment: .leading) {
                if let titles = self.rootState.titles {
                    ForEach(titles.indices, id: \.self) { index in
                        VStack(alignment: .leading) {
                            Text("\(index + 1)   ")
                                .font(
                                    Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .bold, size: 16)
                                )
                                .foregroundStyle(Color.customBlackColor)
                            
                            +
                            
                            Text(titles[index].label)
                                .font(
                                    Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .regular, size: 14)
                                )
                                .foregroundStyle(Color.customBlackColor)
                        }
                        .frame(height: 24)
                        .onTapGesture {
                            self.rootState.day = index + 1
                            self.sideVisible = false
                        }
                    }
                }
                
                CButtonComponent(active: isNewChatCreatable, buttonLabel: "오늘의 대화 시작하기", onTapGesturedHandler: { self.newChatStartTapped() })
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}
