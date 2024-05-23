import Foundation

struct FirebaseChattingItemMessage: Codable, Equatable {
    var contents: String
    var sender: String
}

struct FirestoreChattingItem: Codable {
    var createdAt: Int
    var items: [FirebaseChattingItemMessage]
}
