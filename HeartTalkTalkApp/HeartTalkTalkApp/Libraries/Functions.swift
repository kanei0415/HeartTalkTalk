import Foundation
import FirebaseFunctions

struct ResponseData {
    let success: Bool
    let message: String
}

class FunctionsUtil {
    typealias Callback = (HTTPSCallableResult?, (any Error)?) -> Void
    
    static let single = FunctionsUtil()
    
    private init () { }
    
    let functions = Functions.functions(region: "asia-northeast3")
    
    enum FunctionsType: String {
        case newChattingCreate = "NewChattingCreate"
        case chattingResponseAdd = "ChattingResponseAdd"
        case initializeCreatedUser = "InitializeCreatedUser"
        case userPurchased = "UserPurchased"
    }
    
    func getFunction(type: FunctionsType) -> HTTPSCallable {
        return self.functions.httpsCallable(type.rawValue)
    }
    
    func newChattingCreate(uid: String, createdAt: Int, callback: @escaping Callback) {
        getFunction(type: .newChattingCreate).call(["uid":uid, "createdAt":createdAt], completion: callback)
    }
    
    func chattingResponseAdd(uid: String, day: Int, callback: @escaping Callback) {
        getFunction(type: .chattingResponseAdd).call(["uid": uid, "day": day], completion: callback)
    }
    
    func initialzeCreatedUser(uid: String, name: String, image: String?, createdAt: Int, callback: @escaping Callback) {
        getFunction(type: .chattingResponseAdd).call(["uid": uid, "name": name, "image": image, "createdAt": createdAt], completion: callback)
    }
    
    func userPurchased(uid: String, callback: @escaping Callback) {
        getFunction(type: .userPurchased).call(["uid": uid], completion: callback)
    }
}
