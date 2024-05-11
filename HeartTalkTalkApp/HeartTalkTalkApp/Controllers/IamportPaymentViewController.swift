import Foundation
import SwiftUI
import iamport_ios

class IamportPaymentViewController: UIViewController {
    var rootState: RootEnvironmentObject? = nil
    
    func requestIamportPayment(userName: String, uid: String, callback: @escaping (IamportResponse?) -> Void) {
        let storeCode = "imp56476154"
        let payment = createPaymentData(userName: userName, uid: uid)
        
        Iamport.shared.payment(
            viewController: self,
            userCode: storeCode,
            payment: payment
        ) { response in
            callback(response)
            
            self.rootState?.iamportViewVisible = false
        }
    }
    
    func createPaymentData(userName: String, uid: String) -> IamportPayment {
        return IamportPayment(
            pg: PG.kakaopay.rawValue,
            merchant_uid: "IMP_PRODUCT_30_DAYS \(uid) \(getCreatedDate())",
            amount: "9900").then {
                $0.pay_method = "card"
                $0.name = "마음톡톡 30일 상담 예약"
                $0.buyer_name = userName
                $0.app_scheme = "kr.dev.kyh.HeartTalkTalkApp"
                $0.buyer_email = uid
            }
      }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        guard let user = self.rootState?.user else {
            self.rootState?.iamportViewVisible = false
            return;
        }
        
        requestIamportPayment(userName: user.name, uid: user.uid, callback: { _ in
            FunctionsUtil.single.userPurchased(uid: user.uid) { res, err in
                if let resData = res?.data as? ResponseData {
                    
                }
                
                self.rootState?.iamportViewVisible = false
            }
        })
    }
}
