import FirebaseFunctions
import Foundation

extension HTTPSCallableResult {
    var parsedData: ResponseData? {
        guard let dict = self.data as? NSDictionary else {
            return nil
        }
        
        guard let success = dict["success"] as? Int, let message = dict["message"] as? String else {
            return nil
        }
        
        return ResponseData(success: success == 1, message: message)
    }
}
