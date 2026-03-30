import Foundation
import Combine

class AppStore: ObservableObject {

    @Published var items: [Item] = [] { didSet { save() } }
    @Published var people: [Person] = [] { didSet { save() } }
    @Published var loans: [Loan] = [] { didSet { save() } }
    @Published var debts: [MoneyDebt] = [] { didSet { save() } }

    private let defaults = UserDefaults.standard

    init() { load() }

    // MARK: - Computed

    var activeLoans: [Loan] {
        loans.filter { !$0.isReturned }
    }

    var activeDebts: [MoneyDebt] {
        debts.filter { !$0.isPaid }
    }

    func person(for id: UUID) -> Person? {
        people.first { $0.id == id }
    }

    func item(for id: UUID) -> Item? {
        items.first { $0.id == id }
    }

    func isLent(_ item: Item) -> Bool {
        activeLoans.contains { $0.itemId == item.id }
    }

    func currentLoan(for item: Item) -> Loan? {
        activeLoans.first { $0.itemId == item.id }
    }

    func activeLoans(for personId: UUID) -> [Loan] {
        activeLoans.filter { $0.personId == personId }
    }

    func activeDebts(for personId: UUID) -> [MoneyDebt] {
        activeDebts.filter { $0.personId == personId }
    }

    /// All people who currently have something borrowed or owe money
    var activePeople: [Person] {
        let loanPersonIds = Set(activeLoans.map { $0.personId })
        let debtPersonIds = Set(activeDebts.map { $0.personId })
        let allIds = loanPersonIds.union(debtPersonIds)
        return people.filter { allIds.contains($0.id) }
            .sorted { $0.name < $1.name }
    }

    var totalTheyOweMe: Double {
        activeDebts
            .filter { $0.direction == .theyOweMe }
            .reduce(0) { $0 + $1.amount }
    }

    var totalIOweThem: Double {
        activeDebts
            .filter { $0.direction == .iOweThem }
            .reduce(0) { $0 + $1.amount }
    }

    // MARK: - Mutations

    func markReturned(_ loan: Loan) {
        if let idx = loans.firstIndex(where: { $0.id == loan.id }) {
            loans[idx].isReturned = true
            loans[idx].returnedOn = Date()
        }
    }

    func markPaid(_ debt: MoneyDebt) {
        if let idx = debts.firstIndex(where: { $0.id == debt.id }) {
            debts[idx].isPaid = true
            debts[idx].paidOn = Date()
        }
    }

    func deleteItem(_ item: Item) {
        // Remove related loans first
        loans.removeAll { $0.itemId == item.id }
        items.removeAll { $0.id == item.id }
    }

    func deletePerson(_ person: Person) {
        loans.removeAll { $0.personId == person.id }
        debts.removeAll { $0.personId == person.id }
        people.removeAll { $0.id == person.id }
    }

    func deleteLoan(_ loan: Loan) {
        loans.removeAll { $0.id == loan.id }
    }

    func deleteDebt(_ debt: MoneyDebt) {
        debts.removeAll { $0.id == debt.id }
    }

    // MARK: - Persistence

    private enum Keys {
        static let items = "lg_items"
        static let people = "lg_people"
        static let loans = "lg_loans"
        static let debts = "lg_debts"
    }

    private func save() {
        let encoder = JSONEncoder()
        if let d = try? encoder.encode(items) { defaults.set(d, forKey: Keys.items) }
        if let d = try? encoder.encode(people) { defaults.set(d, forKey: Keys.people) }
        if let d = try? encoder.encode(loans) { defaults.set(d, forKey: Keys.loans) }
        if let d = try? encoder.encode(debts) { defaults.set(d, forKey: Keys.debts) }
    }

    private func load() {
        let decoder = JSONDecoder()
        if let d = defaults.data(forKey: Keys.items),
           let v = try? decoder.decode([Item].self, from: d) { items = v }
        if let d = defaults.data(forKey: Keys.people),
           let v = try? decoder.decode([Person].self, from: d) { people = v }
        if let d = defaults.data(forKey: Keys.loans),
           let v = try? decoder.decode([Loan].self, from: d) { loans = v }
        if let d = defaults.data(forKey: Keys.debts),
           let v = try? decoder.decode([MoneyDebt].self, from: d) { debts = v }
    }
}
