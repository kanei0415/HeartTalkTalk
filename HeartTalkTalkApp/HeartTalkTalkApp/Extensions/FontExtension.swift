import Foundation
import SwiftUI

extension Font {
    enum CustomFont: String {
        case pretendard = "Pretendard"
        case roboto = "Roboto"
    }
    
    enum FontWeight: String {
        case black = "Black"
        case bold = "Bold"
        case extrabold = "ExtraBold"
        case extralight = "ExtraLight"
        case light = "Light"
        case medium = "Medium"
        case regular = "Regular"
        case semibold = "SemiBold"
        case thin = "Thin"
    }
    
    static func getCustomFontStyle(customFont: CustomFont, fontWeight: FontWeight, size: CGFloat) -> Font {
        return Font.custom("\(customFont.rawValue)-\(fontWeight.rawValue)", size: size)
    }
}
