import Foundation
import SwiftData

@Model
final class LoginInfo {
   var uid: String
    
    init(uid: String) {
        self.uid = uid
    }
}
