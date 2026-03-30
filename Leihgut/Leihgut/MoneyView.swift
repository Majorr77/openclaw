import SwiftUI

struct MoneyView: View {
    @EnvironmentObject var store: AppStore
    @State private var showAddDebt = false
    @State private var showPaid = false

    var displayedDebts: [MoneyDebt] {
        (showPaid ? store.debts : store.activeDebts)
            .sorted { $0.createdAt > $1.createdAt }
    }

    var theyOweMe: [MoneyDebt] {
        displayedDebts.filter { $0.direction == .theyOweMe }
    }

    var iOweThem: [MoneyDebt] {
        displayedDebts.filter { $0.direction == .iOweThem }
    }

    var body: some View {
        NavigationStack {
            Group {
                if displayedDebts.isEmpty {
                    EmptyStateView(
                        icon: "eurosign.circle",
                        title: "Keine Schulden",
                        subtitle: "Alle Schulden sind beglichen."
                    )
                } else {
                    List {
                        if !theyOweMe.isEmpty {
                            Section {
                                ForEach(theyOweMe) { debt in
                                    DebtRow(debt: debt)
                                        .swipeActions(edge: .leading) {
                                            if !debt.isPaid {
                                                Button {
                                                    store.markPaid(debt)
                                                } label: {
                                                    Label("Bezahlt", systemImage: "checkmark")
                                                }
                                                .tint(.green)
                                            }
                                        }
                                        .swipeActions(edge: .trailing) {
                                            Button(role: .destructive) {
                                                store.deleteDebt(debt)
                                            } label: {
                                                Label("Löschen", systemImage: "trash")
                                            }
                                        }
                                }
                            } header: {
                                HStack {
                                    Label("Sie schulden mir", systemImage: "arrow.down.circle.fill")
                                        .foregroundColor(.green)
                                    Spacer()
                                    Text(String(format: "%.2f €", theyOweMe.filter { !$0.isPaid }.reduce(0) { $0 + $1.amount }))
                                        .font(.caption.bold())
                                        .foregroundColor(.green)
                                }
                            }
                        }

                        if !iOweThem.isEmpty {
                            Section {
                                ForEach(iOweThem) { debt in
                                    DebtRow(debt: debt)
                                        .swipeActions(edge: .leading) {
                                            if !debt.isPaid {
                                                Button {
                                                    store.markPaid(debt)
                                                } label: {
                                                    Label("Bezahlt", systemImage: "checkmark")
                                                }
                                                .tint(.green)
                                            }
                                        }
                                        .swipeActions(edge: .trailing) {
                                            Button(role: .destructive) {
                                                store.deleteDebt(debt)
                                            } label: {
                                                Label("Löschen", systemImage: "trash")
                                            }
                                        }
                                }
                            } header: {
                                HStack {
                                    Label("Ich schulde", systemImage: "arrow.up.circle.fill")
                                        .foregroundColor(.red)
                                    Spacer()
                                    Text(String(format: "%.2f €", iOweThem.filter { !$0.isPaid }.reduce(0) { $0 + $1.amount }))
                                        .font(.caption.bold())
                                        .foregroundColor(.red)
                                }
                            }
                        }
                    }
                    .listStyle(.insetGrouped)
                }
            }
            .navigationTitle("Geld")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        withAnimation { showPaid.toggle() }
                    } label: {
                        Image(systemName: showPaid ? "eye.slash" : "eye")
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showAddDebt = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddDebt) { AddMoneyDebtView() }
        }
    }
}

struct DebtRow: View {
    @EnvironmentObject var store: AppStore
    let debt: MoneyDebt

    var person: Person? { store.person(for: debt.personId) }

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: debt.direction.icon)
                .font(.title2)
                .foregroundColor(debt.isPaid ? .gray : (debt.direction == .theyOweMe ? .green : .red))

            VStack(alignment: .leading, spacing: 3) {
                Text(person?.name ?? "Unbekannt")
                    .font(.headline)
                    .strikethrough(debt.isPaid)

                Text(debt.description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .strikethrough(debt.isPaid)

                Text(debt.createdAt.formatted(date: .abbreviated, time: .omitted))
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing) {
                Text(String(format: "%.2f €", debt.amount))
                    .font(.headline.bold())
                    .foregroundColor(debt.isPaid ? .secondary : (debt.direction == .theyOweMe ? .green : .red))
                    .strikethrough(debt.isPaid)

                if debt.isPaid {
                    Text("Bezahlt")
                        .font(.caption)
                        .foregroundColor(.green)
                }
            }
        }
        .padding(.vertical, 4)
        .opacity(debt.isPaid ? 0.6 : 1)
    }
}
