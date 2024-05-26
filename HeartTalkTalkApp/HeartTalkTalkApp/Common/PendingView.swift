import SwiftUI

fileprivate let RADIAN_VAL_OF_360: CGFloat = 2 * .pi
fileprivate let RADIAN_VAL_OF_90: CGFloat = .pi / 2

struct PendingCircle: Shape {
    var radiusDiff: CGFloat = 0
    
    var startRadian: CGFloat
    var endRadian: CGFloat
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        path.addArc(
            center: CGPoint(x: rect.midX, y: rect.midY),
            radius: rect.width / 2 - self.radiusDiff,
            startAngle: Angle(radians: 0 + RADIAN_VAL_OF_90),
            endAngle: Angle(radians: 2 * .pi + RADIAN_VAL_OF_90),
            clockwise: false
        )
        
        return path.trimmedPath(from: startRadian / RADIAN_VAL_OF_360, to: endRadian / RADIAN_VAL_OF_360)
    }
    
    var animatableData: AnimatablePair<CGFloat, CGFloat> {
        get {
            AnimatablePair(self.startRadian, self.endRadian)
        }
        
        set {
            self.startRadian = newValue.first
            self.endRadian = newValue.second
        }
    }
}

struct PendingView: View {
    @State var animationStart: Bool = false
    
    let outerArcSizeRadian: CGFloat = RADIAN_VAL_OF_360 / 3
    
    var body: some View {
        ZStack {
            PendingCircle(
                startRadian: animationStart ? RADIAN_VAL_OF_360 - outerArcSizeRadian : 0.0 - outerArcSizeRadian,
                endRadian: animationStart ? RADIAN_VAL_OF_360 : 0.0
            )
                .stroke(lineWidth: 3.0)
                .foregroundColor(Color.customPinkColor)
                .frame(width: 80, height: 80)
        }
        .onAppear {
            withAnimation(Animation.linear.speed(0.5).repeatForever(autoreverses: false)) {
                self.animationStart = true
            }
        }
    }
}
