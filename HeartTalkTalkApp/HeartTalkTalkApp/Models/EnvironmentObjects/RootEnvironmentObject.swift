import Foundation
import SwiftUI
import FirebaseAuth

class RootEnvironmentObject: ObservableObject {
    @Published var path = NavigationPath()
    @Published var user: FirestoreUser?
    @Published var titles: [FirestoreTitle]?
    @Published var chattingItem: FirestoreChattingItem?
    @Published var results: FirestoreResult?
    @Published var day = 1
    @Published var iamportViewVisible = false
    @Published var backDropVisible = false
    @Published var noticeAlarm: String? = nil
}
