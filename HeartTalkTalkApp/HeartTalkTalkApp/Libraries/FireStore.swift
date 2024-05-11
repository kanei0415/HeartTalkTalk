import Foundation
import FirebaseFirestore

class FirestoreUtil {
    static let single = FirestoreUtil()
    
    let firestore = Firestore.firestore()
    
    private init() { }
    
    enum FirestoreCollectionPath {
        case chattings
        case surveyTeestProblems
        case users
        case chattingItems
        case results
        case titles
    }
    
    func getCollectionPathResolver(collection type: FirestoreCollectionPath) -> ([String: String]) -> String {
        return switch(type) {
        case .chattings: { pathParamSet in "Chattings" }
        case .surveyTeestProblems: { pathParamSet in "ServeyTestProblems" }
        case .users: { pathParamSet in "Users" }
        case .chattingItems: { pathParamSet in
            guard let uid = pathParamSet["uid"] else {
                fatalError("Collection ChattingItems Must Have Path Param uid")
            }
            
            return "Chattings/\(uid)/ChattingItems"
        }
        case .results: { pathParamSet in
            guard let uid = pathParamSet["uid"] else {
                fatalError("Collection Results Must Have Path Param uid")
            }
            
            return "Chattings/\(uid)/Results"
        }
        case .titles: { pathParamSet in
            guard let uid = pathParamSet["uid"] else {
                fatalError("Collection Titles Must Have Path Param uid")
            }
            
            return "Chattings/\(uid)/Titles"
        }
        }
    }
    
    func getCollectionRef(resolvedCollectionPath: String) -> CollectionReference {
        return self.firestore.collection(resolvedCollectionPath)
    }
    
    func getDocRef(resolvedCollectionPath: String, documentID: String) -> DocumentReference {
        return self.firestore.collection(resolvedCollectionPath).document(documentID)
    }
    
    func getDocSnapShot<T: Codable>(docRef: DocumentReference, handler: @escaping (T) -> Void) -> ListenerRegistration {
        return docRef.addSnapshotListener { (snapshot, error) in
            Task {
                guard let data = try? snapshot?.data(as: T.self) else {
                    return;
                }
                
                handler(data)
            }
        }
    }
}

extension FirestoreUtil {
    func checkUserAvailable(docRef: DocumentReference) async -> Bool {
        return (try? await docRef.getDocument().data(as: FirestoreUser.self)) != nil
    }
    
    func setUserDataToFireStore(docRef: DocumentReference, userData: FirestoreUser) {
        try? docRef.setData(from: userData, merge: true)
    }
}
