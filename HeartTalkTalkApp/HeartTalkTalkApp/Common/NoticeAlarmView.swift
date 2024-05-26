import SwiftUI

struct NoticeAlarmView: View {
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    var body: some View {
        ZStack {
            if rootState.noticeAlarm != nil {
                Color.black.ignoresSafeArea().opacity(0.5).onTapGesture { }
                    .transition(.opacity)
                    .animation(.easeInOut, value: self.rootState.noticeAlarm)
            }
            
            if let label = rootState.noticeAlarm {
                GeometryReader { gp in
                    VStack {
                        Spacer()
                        
                        Text("알림")
                            .font(Font.getCustomFontStyle(customFont: .roboto, fontWeight: .bold, size: 16))
                            .foregroundStyle(Color.customBlackColor)
                        
                        Spacer()
                        
                        Text(label)
                            .font(Font.getCustomFontStyle(customFont: .roboto, fontWeight: .regular, size: 14))
                            .foregroundStyle(Color.customBlackColor)
                        
                        Spacer()
                        
                        Button(action: {
                            withAnimation {
                                rootState.noticeAlarm = nil
                            }
                        }) {
                            Rectangle().frame(width: gp.size.width - 32, height: 48).overlay {
                                Text("확인")
                                    .font(Font.getCustomFontStyle(customFont: .roboto, fontWeight: .medium, size: 15))
                                    .foregroundStyle(Color.white)
                            }
                            .background {
                                Color.customPinkColor
                            }
                        }
                        
                    }
                    .background(Color.customZincColor)
                    .frame(width: gp.size.width - 32, height: 160)
                    .clipShape(RoundedRectangle(cornerRadius: 8.0))
                    .position(x: gp.size.width / 2, y: gp.size.height / 2)
                }
                .transition(.scale)
                .animation(.easeInOut, value: self.rootState.noticeAlarm)
            }
        }
    }
}
