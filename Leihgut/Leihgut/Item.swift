import Foundation

enum ItemCategory: String, Codable, CaseIterable {
    case tool = "Werkzeug"
    case garden = "Garten"
    case vehicle = "Fahrzeug"
    case electronics = "Elektronik"
    case other = "Sonstiges"

    var icon: String {
        switch self {
        case .tool: return "wrench.and.screwdriver.fill"
        case .garden: return "leaf.fill"
        case .vehicle: return "car.fill"
        case .electronics: return "bolt.fill"
        case .other: return "cube.fill"
        }
    }
}

struct Item: Identifiable, Codable {
    var id = UUID()
    var name: String
    var category: ItemCategory
    var notes: String
    var createdAt: Date

    init(id: UUID = UUID(), name: String, category: ItemCategory = .tool, notes: String = "", createdAt: Date = Date()) {
        self.id = id
        self.name = name
        self.category = category
        self.notes = notes
        self.createdAt = createdAt
    }
}
