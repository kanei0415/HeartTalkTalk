import SwiftUI
import FirebaseCore
import Firebase
import GoogleSignIn
import SwiftData
import iamport_ios

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()

    return true
  }
    
    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        Iamport.shared.receivedURL(url)
        return GIDSignIn.sharedInstance.handle(url)
    }
}

let rootState = RootEnvironmentObject()

@main
struct HeartTalkTalkAppApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    let modelContainer: ModelContainer
        
    init() {
        modelContainer = try! ModelContainer(for: LoginInfo.self)
    }
    
    var body: some Scene {
        WindowGroup {
            RootNavigationStack()
        }
        
        .environmentObject(rootState)
        .modelContainer(self.modelContainer)
    }
}
