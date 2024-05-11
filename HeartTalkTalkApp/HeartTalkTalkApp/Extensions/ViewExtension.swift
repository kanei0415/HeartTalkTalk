import SwiftUI
import GoogleSignIn

extension View {
    func rootViewController() -> UIViewController? {
        let windowScene =  UIApplication.shared.connectedScenes.first as? UIWindowScene
        return windowScene?.windows.first?.rootViewController
    }
}
