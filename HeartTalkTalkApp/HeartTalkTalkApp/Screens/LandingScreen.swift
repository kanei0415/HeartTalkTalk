import SwiftUI
import FirebaseAuth
import GoogleSignIn
import SwiftData

struct LandingScreen: View {
    @State private var email: String = ""
    @State private var password: String = ""
    
    @State private var onEmailError: CInputComponent.InputError? = nil
    @State private var onEmailSuccess: CInputComponent.InputSuccess? = nil
    
    @State private var onPasswordError: CInputComponent.InputError? = nil
    @State private var onPasswordSuccess: CInputComponent.InputSuccess? = nil
    
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    @Query var loginInfos: [LoginInfo]
    
    @Environment(\.modelContext) private var context
    
    var emailValid: Bool {
        return !self.email.isEmpty && CInputComponent.InputRegex.emailRegex.checkValidation(value: self.email)
    }
    
    var passwordValid: Bool {
        return !self.password.isEmpty && CInputComponent.InputRegex.passwordRegex.checkValidation(value: self.password)
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
    
    func onLoginBtnTapped() async {
        self.rootState.backDropVisible = true
        
        if !self.emailValid || !self.passwordValid {
            return;
        }
        
        let authDataResult = try? await Auth.auth().signIn(withEmail: self.email, password: self.password)
        
        guard let auth = authDataResult else {
            self.onEmailSuccess = nil
            self.onPasswordSuccess = nil
            
            self.onEmailError = CInputComponent.InputError(
                onError: true, errorMessage: "계정 정보가 올바르지 않습니다"
            )
            self.onPasswordError = CInputComponent.InputError(
                onError: true, errorMessage: "계정 정보가 올바르지 않습니다"
            )
            
            self.rootState.backDropVisible = false
            
            return
        }
        
        let userCollectionPathResolver = FirestoreUtil.single.getCollectionPathResolver(collection: .users)
        
        let resolvedUserCollectionPath = userCollectionPathResolver([:])
        
        let uid = auth.user.uid
        
        let userDocRef = FirestoreUtil.single.getDocRef(
            resolvedCollectionPath: resolvedUserCollectionPath,
            documentID: uid
        )
        
        Task {
            guard let userDocData = try? await userDocRef.getDocument().data(as: FirestoreUser.self) else {
                self.rootState.backDropVisible = false
                
                return
            }
            
            self.rootState.user = userDocData
            
            self.setUserData(uid: uid)
            
            self.rootState.backDropVisible = false
        }
    }
    
    func onGoogleLoginBtnTapped() {
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
            
            Image(.icLogo)
                .padding(.bottom, 12)
            
            Image(.icTypo)
                .padding(.bottom, 36)
            
            CInputComponent(
                inputValue: self.$email,
                onError: self.$onEmailError,
                onSuccess: self.$onEmailSuccess,
                inputType: .email,
                label: "이메일",
                placeholder: "이메일을 입력해주세요"
            )
            
            CInputComponent(
                inputValue: self.$password,
                onError: self.$onEmailError,
                onSuccess: self.$onEmailSuccess,
                inputType: .password,
                label: "비밀번호",
                placeholder: "비밀번호를 입력해주세요"
            )
            
            CButtonComponent(
                active: self.emailValid && self.passwordValid,
                buttonLabel: "로그인",
                onTapGesturedHandler: {
                    Task {
                        await self.onLoginBtnTapped()
                    }
                }
            )
            
            Button(action: {
                onGoogleLoginBtnTapped()
            }, label: {
                HStack {
                    Image(Image.Icon.google.rawValue)
                    
                    Text("구글 계정으로 로그인하기")
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
            .padding(.top, 8)
            
            Spacer()
            
            Button(action: {
                self.rootState.path.append(RootNavigationStack.StackScreen.signup.rawValue)
            }, label: {
                Text("아직 계정을 만들지 않으셨나요? ")
                    .font(
                        Font.getCustomFontStyle(
                            customFont: .pretendard,
                            fontWeight: Font.FontWeight.bold,
                            size: 16
                        )
                    )
                    .foregroundStyle(Color.customBlackColor)
                +
                Text("회원가입")
                    .font(
                        Font.getCustomFontStyle(
                            customFont: .pretendard,
                            fontWeight: Font.FontWeight.bold,
                            size: 16
                        )
                    )
                    .underline()
                    .foregroundStyle(Color.customPinkColor)
                    
            })
            .navigationDestination(for: String.self, destination: { _  in SignupScreen() })
        
            Spacer()
        }
        .frame(maxWidth: .infinity)
        .padding()
        .onChange(of: self.email) {
            self.onEmailError = nil
            self.onEmailSuccess = nil
        }
        .onChange(of: self.password) {
            self.onPasswordError = nil
            self.onPasswordSuccess = nil
        }
    }
}
