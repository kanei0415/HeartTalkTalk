import SwiftUI

struct IamportView: UIViewControllerRepresentable {
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    func makeUIViewController(context: Context) -> some UIViewController {
        let view = IamportPaymentViewController()
        
        view.rootState = self.rootState
        
        return view
    }
    
    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) { }
}
