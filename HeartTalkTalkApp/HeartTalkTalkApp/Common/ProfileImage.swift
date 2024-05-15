import Foundation
import SwiftUI

struct ProfileImage: Transferable {
    let image: Image
    
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(importedContentType: .image) { data in
            guard let uiImage = UIImage(data: data) else {
                fatalError("Data Transfer Failed")
            }
            
            return ProfileImage(image: Image(uiImage: uiImage))
        }
    }
}
