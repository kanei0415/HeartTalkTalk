import Foundation
import FirebaseFirestore

struct FirestoreUser: Codable {
    var name: String
    var uid: String
    var image: String?
    var days: Int
    var createdAt: Int
    var reservedDays: Int
}
