import SwiftUI

struct CButtonComponent: View {
    var active: Bool
    var buttonLabel: String
    var onTapGesturedHandler: () -> Void
    
    var body: some View {
        VStack {
            Button(action: {
                if self.active {
                    onTapGesturedHandler()
                }
            }, label: {
                VStack {
                    Text(self.buttonLabel)
                        .font(
                            Font.getCustomFontStyle(
                                customFont: .roboto,
                                fontWeight: .medium,
                                size: 15
                            )
                        )
                        .foregroundStyle(self.active ? Color.white : Color.customStoneColor)
                }
                .frame(maxWidth: .infinity, minHeight: 48)
            })
        }
        .frame(maxWidth: .infinity, minHeight: 48)
        .clipShape(RoundedRectangle(cornerRadius: 4))
        .background(self.active ? Color.customBlueColor : Color.customGrayColor)
        
    
    }
}
