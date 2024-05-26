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
        
        var weight: Weight {
            switch(self) {
            case .black: .black
            case .bold: .bold
            case .extrabold: .heavy
            case .extralight: .ultraLight
            case .light: .light
            case .medium: .black
            case .regular: .regular
            case .semibold: .semibold
            case .thin: .thin
            }
        }
    }
    
    static func getCustomFontStyle(customFont: CustomFont, fontWeight: FontWeight, size: CGFloat) -> Font {
        return Font.custom("\(customFont.rawValue)-\(fontWeight.rawValue)", size: size).weight(fontWeight.weight)
    }
}
