import Foundation

struct Loan: Identifiable, Codable {
    var id = UUID()
    var itemId: UUID
    var personId: UUID
    var lentOn: Date
    var dueDate: Date?
    var notes: String
    var isReturned: Bool
    var returnedOn: Date?

    init(id: UUID = UUID(), itemId: UUID, personId: UUID, lentOn: Date = Date(),
         dueDate: Date? = nil, notes: String = "", isReturned: Bool = false, returnedOn: Date? = nil) {
        self.id = id
        self.itemId = itemId
        self.personId = personId
        self.lentOn = lentOn
        self.dueDate = dueDate
        self.notes = notes
        self.isReturned = isReturned
        self.returnedOn = returnedOn
    }

    var isOverdue: Bool {
        guard let due = dueDate, !isReturned else { return false }
        return due < Date()
    }
}
