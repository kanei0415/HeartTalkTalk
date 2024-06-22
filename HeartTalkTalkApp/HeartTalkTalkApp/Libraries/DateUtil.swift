import Foundation

func getCreatedDate() -> Int {
    let formatter = DateFormatter()
    
    formatter.dateFormat = "yyyyMd"
    
    return Int(formatter.string(from: Date.now)) ?? 2021615
}
