import SwiftUI

struct ResultScreen: View {
    @EnvironmentObject var rootState: RootEnvironmentObject
    
    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading) {
                GeometryReader { gp in
                    Button(action: {
                        self.rootState.path.removeLast()
                    }, label: {
                        Image(systemName: "arrow.left")
                            .foregroundColor(.customBlackColor)
                    })
                    .frame(width: 28, height: 28)
                    .position(x: 24,  y: gp.size.height / 2)
                    
                    VStack {
                        Text("상담 결과")
                            .font(
                                Font.getCustomFontStyle(customFont: .roboto, fontWeight: .bold, size: 18)
                            )
                            .foregroundStyle(Color.customBlackColor)
                    }
                    .position(x: gp.size.width / 2, y: gp.size.height / 2)
                }
                .frame(height: 48)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            VStack(alignment: .leading) {
                if let results = rootState.results {
                    if results.items.isEmpty {
                        Text("아직 아무런 결과가 없습니다!\n대화를 통해 상담 결과를 받아보세요")
                            .font(
                                Font.getCustomFontStyle(customFont: .roboto, fontWeight: .regular, size: 16)
                            )
                            .foregroundStyle(Color.customBlackColor)
                            .multilineTextAlignment(.center)
                    } else {
                        ForEach(results.items, id: \.self) { res in
                            Text(res)
                                .font(
                                    Font.getCustomFontStyle(customFont: .roboto, fontWeight: .regular, size: 16)
                                )
                                .foregroundStyle(Color.customBlackColor)
                            
                            HStack{ EmptyView() }.frame(height: 8)
                        }
                    }
                }
            }
            .padding()
        }
        .frame(maxWidth: .infinity)
        .navigationBarHidden(true)
    }
}
