import SwiftUI
import SwiftData
import Foundation

struct RootNavigationStack: View {
    enum StackScreen: String {
        case landing = "LandingScreen"
        case signup = "SignupScreen"
        case main = "MainScreen"
    }
    
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    @Query var loginInfos: [LoginInfo]
    
    @Environment(\.modelContext) private var context
    
    func loadUserData(uid: String) {
        let docRef = FirestoreUtil.single.getDocRef(
            resolvedCollectionPath: FirestoreUtil.single.getCollectionPathResolver(collection: .users)([:]),
            documentID: uid
        )
        
        docRef.addSnapshotListener { ds, e in
            if let docData = try? ds?.data(as: FirestoreUser.self) {
                self.rootState.user = docData
                
                withAnimation {
                    if let first = self.loginInfos.first {
                        self.context.delete(first)
                        self.context.insert(LoginInfo(uid: docData.uid))
                    } else {
                        self.context.insert(LoginInfo(uid: docData.uid))
                    }
                }
            }
        }
    }
    
    var body: some View {
        NavigationStack(path: $rootState.path) {
            if self.rootState.user == nil {
                LandingScreen()
            } else {
                MainScreen()
            }
        }
        .sheet(isPresented: self.$rootState.iamportViewVisible) {
            IamportView()
                .ignoresSafeArea()
        }
        .onAppear {
            if let uid = self.loginInfos.first?.uid {
                self.loadUserData(uid: uid)
            }
        }
    }
}
