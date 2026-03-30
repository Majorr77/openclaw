import Foundation

enum DebtDirection: String, Codable, CaseIterable {
    case theyOweMe = "Sie schulden mir"
    case iOweThem = "Ich schulde"

    var icon: String {
        switch self {
        case .theyOweMe: return "arrow.down.circle.fill"
        case .iOweThem: return "arrow.up.circle.fill"
        }
    }
}

struct MoneyDebt: Identifiable, Codable {
    var id = UUID()
    var personId: UUID
    var amount: Double
    var description: String
    var direction: DebtDirection
    var createdAt: Date
    var isPaid: Bool
    var paidOn: Date?

    init(id: UUID = UUID(), personId: UUID, amount: Double, description: String,
         direction: DebtDirection = .theyOweMe, createdAt: Date = Date(),
         isPaid: Bool = false, paidOn: Date? = nil) {
        self.id = id
        self.personId = personId
        self.amount = amount
        self.description = description
        self.direction = direction
        self.createdAt = createdAt
        self.isPaid = isPaid
        self.paidOn = paidOn
    }
}
