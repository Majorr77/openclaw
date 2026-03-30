import Foundation

struct Person: Identifiable, Codable {
    var id = UUID()
    var name: String
    var phone: String
    var notes: String

    init(id: UUID = UUID(), name: String, phone: String = "", notes: String = "") {
        self.id = id
        self.name = name
        self.phone = phone
        self.notes = notes
    }

    var initials: String {
        let parts = name.split(separator: " ")
        let letters = parts.prefix(2).compactMap { $0.first }
        return String(letters).uppercased()
    }
}
