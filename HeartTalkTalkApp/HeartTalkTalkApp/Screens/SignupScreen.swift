import SwiftUI
import PhotosUI
import FirebaseAuth
import GoogleSignIn
import SwiftData
import FirebaseStorage

struct SignupScreen: View {
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    @Environment(\.modelContext) private var context
    
    @Query var loginInfos: [LoginInfo]
    
    @State var email: String = ""
    @State var password: String = ""
    @State var passwordConfirm: String = ""
    @State var name: String = ""
    
    @State var profileSelection: PhotosPickerItem?
    @State var profileImageView: Image?
    
    
    @State var emailInputError: CInputComponent.InputError?
    @State var emailInputSuccess: CInputComponent.InputSuccess?
    
    @State var passwordInputError: CInputComponent.InputError?
    @State var passwordInputSuccess: CInputComponent.InputSuccess?
    
    @State var passwordConfirmInputError: CInputComponent.InputError?
    @State var passwordConfirmInputSuccess: CInputComponent.InputSuccess?
    
    @State var nameInputError: CInputComponent.InputError?
    @State var nameInputSuccess: CInputComponent.InputSuccess?
    
    var emailValid: Bool {
        return !self.email.isEmpty && CInputComponent.InputRegex.emailRegex.checkValidation(value: self.email)
    }
    
    var passwordVaild: Bool {
        return !self.password.isEmpty && CInputComponent.InputRegex.passwordRegex.checkValidation(value: self.password)
    }
    
    var passwordConfirmVaild: Bool {
        return passwordVaild && self.password == self.passwordConfirm
    }
    
    var nameVaild: Bool {
        return !self.name.isEmpty && CInputComponent.InputRegex.nameRegex.checkValidation(value: self.name)
    }
    
    var signupBtnActive: Bool {
        return self.emailValid && self.passwordVaild && self.passwordConfirmVaild && self.nameVaild
    }
    
    func setUserData(uid: String) {
        withAnimation {
            if let first = self.loginInfos.first {
                self.context.delete(first)
                self.context.insert(LoginInfo(uid: uid))
            } else {
                self.context.insert(LoginInfo(uid: uid))
            }
        }
    }
    
    func onSignupBtnTapped() {
        self.rootState.backDropVisible = true
        
        if !self.signupBtnActive {
            return
        }
        
        Auth.auth().createUser(withEmail: self.email, password: self.password) { authRes,authErr in
            if let signupError = authErr {
                self.emailInputError = CInputComponent.InputError(onError: true, errorMessage: "이미 가입된 이메일 입니다")
            } else {
                Task {
                    guard let loginRes = try? await Auth.auth().signIn(withEmail: self.email, password: self.password) else { return }
                    
                    if self.profileSelection != nil {
                        guard let data = try? await self.profileSelection?.loadTransferable(type: Data.self) else { return }
                        
                        guard let metadata = try? await Storage.storage().reference()
                            .child("images/\(loginRes.user.uid).jpeg")
                            .putDataAsync(data, metadata: StorageMetadata(dictionary: ["contentType":"image/jpeg"])) else { return }
                        
                        guard let imagePath = metadata.path, let url = try? await Storage.storage().reference().child(imagePath).downloadURL() else { return }
                        
                        
                        guard let res = try? await FunctionsUtil.single.getFunction(type: .initializeCreatedUser)
                            .call([
                                "uid" : loginRes.user.uid,
                                "name" : self.name,
                                "createdAt": getCreatedDate(),
                                "image":  url,
                                "id": ""
                            ]) else { return }
                    } else {
                        guard let res = try? await FunctionsUtil.single.getFunction(type: .initializeCreatedUser)
                            .call([
                                "uid" : loginRes.user.uid,
                                "name" : self.name,
                                "createdAt": getCreatedDate(),
                                "image": "",
                                "id": ""
                            ]) else { return }
                    }
                    
                    let userCollectionPathResolver = FirestoreUtil.single.getCollectionPathResolver(collection: .users)
                    
                    let resolvedUserCollectionPath = userCollectionPathResolver([:])
                    
                    let uid = loginRes.user.uid
                    
                    let userDocRef = FirestoreUtil.single.getDocRef(
                        resolvedCollectionPath: resolvedUserCollectionPath,
                        documentID: uid
                    )
                    
                    guard let userDocData = try? await userDocRef.getDocument().data(as: FirestoreUser.self) else {
                        return
                    }
                    
                    self.rootState.path.removeLast()
                    
                    self.rootState.user = userDocData
                    
                    self.setUserData(uid: uid)
                    
                    self.rootState.backDropVisible = false
                }
            }
        }
    }
    
    func onGoogleSignInBtnTapped() {
        self.rootState.backDropVisible = true
        
        guard let rootViewController = self.rootViewController() else {
            return
        }
        
        GIDSignIn.sharedInstance.signIn(
            withPresenting: rootViewController
        ) { (res, error) in
            guard let loginResult = res else {
                return
            }
            
            let userCollectionPathResolver = FirestoreUtil.single.getCollectionPathResolver(collection: .users)
            
            let resolvedUserCollectionPath = userCollectionPathResolver([:])
            
            guard let idToken = loginResult.user.idToken else {
                return
            }
            
            let ac = GoogleAuthProvider.credential(
                withIDToken: idToken.tokenString,
                accessToken: loginResult.user.accessToken.tokenString
            )

            Task {
                guard let authResult = try? await Auth.auth().signIn(with: ac) else {
                    return
                }
                
                let userDocRef = FirestoreUtil.single.getDocRef(
                    resolvedCollectionPath: resolvedUserCollectionPath,
                    documentID: authResult.user.uid
                )
                
                guard let result = try? await userDocRef.getDocument(as: FirestoreUser.self) else {
                    guard let profile = loginResult.user.profile else {
                        return;
                    }
                    
                    let requestBody = [
                        "uid": authResult.user.uid,
                        "name": profile.name,
                        "image": profile.imageURL(withDimension: 400)?.description,
                        "createdAt": getCreatedDate(),
                        "id": ""
                    ]
                    
                    let initializeCreatedUser = FunctionsUtil.single.getFunction(type: .initializeCreatedUser)
                    
                    initializeCreatedUser.call(requestBody) { response, error in
                        if error != nil {
                            // TODO: CreatedUserInitialization Failed Alert
                        } else {
                            Task {
                                guard let user = try? await userDocRef.getDocument(as: FirestoreUser.self) else {
                                    return
                                }
                                
                                self.rootState.user = user
                                self.setUserData(uid: user.uid)
                            }
                        }
                    }
                    
                    return
                }
                
                self.rootState.user = result
                self.setUserData(uid: result.uid)
                
                self.rootState.backDropVisible = false
            }
        }
    }
    
    var body: some View {
        VStack {
            Spacer()
            
            Text("회원가입 하고\n매일매일 심리상담 받아보세요")
                .font(
                    Font.getCustomFontStyle(customFont: .pretendard, fontWeight: .bold, size: 20)
                )
                .foregroundStyle(Color.customBlackColor)
                .multilineTextAlignment(.center)
            
            Spacer()
            
            CInputComponent(
                inputValue: self.$email,
                onError: self.$emailInputError,
                onSuccess: self.$emailInputSuccess,
                inputType: .email,
                label: "이메일",
                placeholder: "이메일을 입력해주세요",
                isNeededValue: true
            )
            
            CInputComponent(
                inputValue: self.$password,
                onError: self.$passwordInputError,
                onSuccess: self.$passwordInputSuccess,
                inputType: .password,
                label: "비밀번호",
                placeholder: "비밀번호를 입력해주세요",
                isNeededValue: true
            )
            
            CInputComponent(
                inputValue: self.$passwordConfirm,
                onError: self.$passwordConfirmInputError,
                onSuccess: self.$passwordConfirmInputSuccess,
                inputType: .password,
                label: "비밀번호 확인",
                placeholder: "비밀번호를 한번 더 입력해주세요",
                isNeededValue: true
            )
            
            Spacer()
            
            PhotosPicker(selection: self.$profileSelection, matching: .images) {
                if let imageView = self.profileImageView {
                    imageView
                        .resizable()
                        .scaledToFill()
                        .frame(width: 100, height: 100)
                        .clipShape(Circle())
                } else {
                    HStack { Image(Image.Icon.camera.rawValue) }
                        .frame(width: 100, height: 100)
                        .background(Color.customBlackColor)
                        .clipShape(Circle())
                }
            }
            
            CInputComponent(
                inputValue: self.$name,
                onError: self.$nameInputError,
                onSuccess: self.$nameInputSuccess,
                inputType: .name,
                label: "이름",
                placeholder: "이름을 입력해주세요",
                isNeededValue: true
            )
            
            Spacer()
            
            CButtonComponent(active: signupBtnActive, buttonLabel: "회원가입하기", onTapGesturedHandler: { onSignupBtnTapped() })
            
            Button(action: {
                onGoogleSignInBtnTapped()
            }, label: {
                HStack {
                    Image(Image.Icon.google.rawValue)
                    
                    Text("구글 계정으로 회원가입하기")
                        .font(
                            Font.getCustomFontStyle(
                                customFont: .roboto,
                                fontWeight: .regular,
                                size: 15
                            )
                        )
                        .foregroundStyle(Color.white)
                }
            })
            .frame(maxWidth: .infinity, minHeight: 48)
            .background {
                RoundedRectangle(cornerRadius: 24)
                    .frame(height: 48)
                    .foregroundColor(Color.customStoneColor)
            }
            
            Spacer()
        }
        .navigationBarHidden(true)
        .padding(20)
        .onChange(of: self.profileSelection) {
            self.profileSelection?.loadTransferable(type: Image.self) { res in
                switch res {
                case .success(let image?): self.profileImageView = image
                case .failure(let error): print(error.localizedDescription)
                default: return
                }
            }
        }
        .onChange(of: self.email) {
            self.emailInputError = nil
        }
    }
}
