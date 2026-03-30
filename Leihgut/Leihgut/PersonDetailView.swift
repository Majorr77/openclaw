import SwiftUI

struct PersonDetailView: View {
    @EnvironmentObject var store: AppStore
    let person: Person

    @State private var showAddLoan = false
    @State private var showAddDebt = false

    var activeLoans: [Loan] { store.activeLoans(for: person.id) }
    var allLoans: [Loan] { store.loans.filter { $0.personId == person.id } }
    var activeDebts: [MoneyDebt] { store.activeDebts(for: person.id) }
    var allDebts: [MoneyDebt] { store.debts.filter { $0.personId == person.id } }

    var totalTheyOweMe: Double {
        activeDebts.filter { $0.direction == .theyOweMe }.reduce(0) { $0 + $1.amount }
    }
    var totalIOweThem: Double {
        activeDebts.filter { $0.direction == .iOweThem }.reduce(0) { $0 + $1.amount }
    }

    var body: some View {
        List {
            // Header
            Section {
                HStack(spacing: 16) {
                    AvatarView(initials: person.initials, color: .orange, size: 60)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(person.name).font(.title2.bold())
                        if !person.phone.isEmpty {
                            Label(person.phone, systemImage: "phone")
                                .font(.subheadline).foregroundColor(.secondary)
                        }
                        if !person.notes.isEmpty {
                            Text(person.notes).font(.caption).foregroundColor(.secondary)
                        }
                    }
                }
                .padding(.vertical, 4)
            }

            // Summary badges
            if !activeLoans.isEmpty || !activeDebts.isEmpty {
                Section("Ausstehend") {
                    if !activeLoans.isEmpty {
                        HStack {
                            Image(systemName: "wrench.fill").foregroundColor(.orange)
                            Text("\(activeLoans.count) Gegenstand\(activeLoans.count != 1 ? "\"e" : "") verliehen")
                            Spacer()
                        }
                    }
                    if totalTheyOweMe > 0 {
                        HStack {
                            Image(systemName: "arrow.down.circle.fill").foregroundColor(.green)
                            Text("Schuldet mir \(String(format: "%.2f", totalTheyOweMe)) €")
                            Spacer()
                        }
                    }
                    if totalIOweThem > 0 {
                        HStack {
                            Image(systemName: "arrow.up.circle.fill").foregroundColor(.red)
                            Text("Ich schulde \(String(format: "%.2f", totalIOweThem)) €")
                            Spacer()
                        }
                    }
                }
            }

            // Active loans
            if !activeLoans.isEmpty {
                Section("Verliehene Gegenstände") {
                    ForEach(activeLoans) { loan in
                        if let item = store.item(for: loan.itemId) {
                            HStack {
                                Image(systemName: item.category.icon)
                                    .foregroundColor(.orange)
                                    .frame(width: 28)
                                VStack(alignment: .leading) {
                                    Text(item.name).font(.headline)
                                    Text("Seit \(loan.lentOn.formatted(date: .abbreviated, time: .omitted))")
                                        .font(.caption).foregroundColor(.secondary)
                                    if let due = loan.dueDate {
                                        Text("Fällig: \(due.formatted(date: .abbreviated, time: .omitted))")
                                            .font(.caption)
                                            .foregroundColor(loan.isOverdue ? .red : .secondary)
                                    }
                                }
                                Spacer()
                                Button("Zurück") {
                                    store.markReturned(loan)
                                }
                                .buttonStyle(.bordered)
                                .tint(.green)
                                .font(.caption)
                            }
                        }
                    }
                }
            }

            // Active debts
            if !activeDebts.isEmpty {
                Section("Offene Schulden") {
                    ForEach(activeDebts) { debt in
                        HStack {
                            Image(systemName: debt.direction.icon)
                                .foregroundColor(debt.direction == .theyOweMe ? .green : .red)
                            VStack(alignment: .leading) {
                                Text(debt.description).font(.subheadline)
                                Text(debt.createdAt.formatted(date: .abbreviated, time: .omitted))
                                    .font(.caption).foregroundColor(.secondary)
                            }
                            Spacer()
                            Text(String(format: "%.2f €", debt.amount))
                                .font(.headline.bold())
                                .foregroundColor(debt.direction == .theyOweMe ? .green : .red)
                        }
                        .swipeActions(edge: .leading) {
                            Button {
                                store.markPaid(debt)
                            } label: {
                                Label("Bezahlt", systemImage: "checkmark")
                            }
                            .tint(.green)
                        }
                    }
                }
            }

            // History section
            if allLoans.filter({ $0.isReturned }).count > 0 {
                Section("Zurückgegeben") {
                    ForEach(allLoans.filter { $0.isReturned }) { loan in
                        if let item = store.item(for: loan.itemId) {
                            HStack {
                                Image(systemName: item.category.icon)
                                    .foregroundColor(.gray)
                                    .frame(width: 28)
                                Text(item.name)
                                    .foregroundColor(.secondary)
                                Spacer()
                                if let ret = loan.returnedOn {
                                    Text(ret.formatted(date: .abbreviated, time: .omitted))
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                    }
                }
            }

            // Quick actions
            Section {
                Button {
                    showAddLoan = true
                } label: {
                    Label("Weiteres Werkzeug verleihen", systemImage: "plus.circle")
                }
                Button {
                    showAddDebt = true
                } label: {
                    Label("Schulden eintragen", systemImage: "eurosign.circle")
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(person.name)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddLoan) { AddLoanView() }
        .sheet(isPresented: $showAddDebt) { AddMoneyDebtView() }
    }
}
