import SwiftUI

struct LoansView: View {
    @EnvironmentObject var store: AppStore
    @State private var showAddLoan = false
    @State private var showReturned = false

    var displayedLoans: [Loan] {
        let loans = showReturned ? store.loans : store.activeLoans
        return loans.sorted { $0.lentOn > $1.lentOn }
    }

    var body: some View {
        NavigationStack {
            Group {
                if displayedLoans.isEmpty {
                    EmptyStateView(
                        icon: "arrow.left.arrow.right.circle",
                        title: showReturned ? "Noch nichts verliehen" : "Alles zurück",
                        subtitle: showReturned
                            ? "Du hast noch nichts verliehen."
                            : "Keine offenen Verleihungen."
                    )
                } else {
                    List {
                        ForEach(displayedLoans) { loan in
                            LoanRow(loan: loan)
                                .swipeActions(edge: .leading) {
                                    if !loan.isReturned {
                                        Button {
                                            store.markReturned(loan)
                                        } label: {
                                            Label("Zurück", systemImage: "checkmark")
                                        }
                                        .tint(.green)
                                    }
                                }
                                .swipeActions(edge: .trailing) {
                                    Button(role: .destructive) {
                                        store.deleteLoan(loan)
                                    } label: {
                                        Label("Löschen", systemImage: "trash")
                                    }
                                }
                        }
                    }
                    .listStyle(.insetGrouped)
                }
            }
            .navigationTitle("Verleihungen")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        withAnimation { showReturned.toggle() }
                    } label: {
                        Label(
                            showReturned ? "Alle" : "Mit zurückgeg.",
                            systemImage: showReturned ? "eye.slash" : "eye"
                        )
                        .labelStyle(.iconOnly)
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showAddLoan = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddLoan) { AddLoanView() }
        }
    }
}

struct LoanRow: View {
    @EnvironmentObject var store: AppStore
    let loan: Loan

    var person: Person? { store.person(for: loan.personId) }
    var item: Item? { store.item(for: loan.itemId) }

    var body: some View {
        HStack(spacing: 14) {
            if let person = person {
                AvatarView(initials: person.initials, color: loan.isReturned ? .gray : .orange)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(item?.name ?? "Unbekanntes Gerät")
                    .font(.headline)
                    .strikethrough(loan.isReturned)

                if let person = person {
                    Text(person.name)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                HStack(spacing: 6) {
                    Image(systemName: "calendar")
                        .font(.caption2)
                    Text(loan.lentOn.formatted(date: .abbreviated, time: .omitted))
                        .font(.caption)

                    if let due = loan.dueDate {
                        Text("·")
                        Image(systemName: "clock")
                            .font(.caption2)
                        Text(due.formatted(date: .abbreviated, time: .omitted))
                            .font(.caption)
                            .foregroundColor(loan.isOverdue ? .red : .secondary)
                    }
                }
                .foregroundColor(.secondary)
            }

            Spacer()

            if loan.isReturned {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.green)
            } else if loan.isOverdue {
                VStack(alignment: .trailing) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .foregroundColor(.red)
                    Text("Überfällig")
                        .font(.caption2)
                        .foregroundColor(.red)
                }
            }
        }
        .padding(.vertical, 4)
        .opacity(loan.isReturned ? 0.6 : 1)
    }
}
