import Foundation
import SwiftUI

struct FeedbackImpact {
    enum HapticFeedback {
        case weak
        case strong
        
        var feedback: UIImpactFeedbackGenerator {
            switch(self) {
            case .weak: return UIImpactFeedbackGenerator(style: .soft)
            case .strong: return UIImpactFeedbackGenerator(style: .rigid)
            }
        }
        
        func react() {
            self.feedback.prepare()
            self.feedback.impactOccurred()
        }
    }
}
