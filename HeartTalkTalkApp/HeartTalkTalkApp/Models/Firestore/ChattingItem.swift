import Foundation

struct FirebaseChattingItemMessage: Codable {
    var contents: String
    var sender: String
}

struct FirestoreChattingItem: Codable {
    var createdAt: Int
    var items: [FirebaseChattingItemMessage]
}
