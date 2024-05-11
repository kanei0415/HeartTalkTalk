import Foundation
import FirebaseCore
import Firebase
import GoogleSignIn

class OAuth {
    static let single = OAuth()
    
    private init() {
        self.initializeGID()
    }
    
    func initializeGID() {
        guard let clientID = FirebaseApp.app()?.options.clientID else { fatalError("Firebase App Config Malformed") }
        
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)
    }
}
