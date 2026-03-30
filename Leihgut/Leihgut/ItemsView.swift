import SwiftUI

struct ItemsView: View {
    @EnvironmentObject var store: AppStore
    @State private var showAddItem = false
    @State private var searchText = ""

    var filteredItems: [Item] {
        if searchText.isEmpty { return store.items }
        return store.items.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        NavigationStack {
            Group {
                if store.items.isEmpty {
                    EmptyStateView(
                        icon: "wrench.and.screwdriver",
                        title: "Keine Werkzeuge",
                        subtitle: "Füge dein erstes Werkzeug oder Gerät hinzu."
                    )
                } else {
                    List {
                        ForEach(filteredItems) { item in
                            NavigationLink(destination: ItemDetailView(item: item)) {
                                ItemRow(item: item)
                            }
                        }
                        .onDelete { indexSet in
                            indexSet.map { filteredItems[$0] }.forEach { store.deleteItem($0) }
                        }
                    }
                    .listStyle(.insetGrouped)
                    .searchable(text: $searchText, prompt: "Werkzeug suchen")
                }
            }
            .navigationTitle("Werkzeuge")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showAddItem = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddItem) { AddItemView() }
        }
    }
}

struct ItemRow: View {
    @EnvironmentObject var store: AppStore
    let item: Item

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: item.category.icon)
                .font(.title3)
                .foregroundColor(.orange)
                .frame(width: 32)

            VStack(alignment: .leading, spacing: 3) {
                Text(item.name)
                    .font(.headline)
                Text(item.category.rawValue)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            if store.isLent(item), let loan = store.currentLoan(for: item),
               let person = store.person(for: loan.personId) {
                VStack(alignment: .trailing, spacing: 2) {
                    Text("Verliehen")
                        .font(.caption.bold())
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(loan.isOverdue ? Color.red : Color.orange)
                        .cornerRadius(8)
                    Text(person.name)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            } else {
                Text("Verfügbar")
                    .font(.caption.bold())
                    .foregroundColor(.green)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.green.opacity(0.15))
                    .cornerRadius(8)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Item Detail

struct ItemDetailView: View {
    @EnvironmentObject var store: AppStore
    let item: Item
    @State private var showAddLoan = false
    @State private var showEdit = false
    @Environment(\.dismiss) var dismiss

    var loanHistory: [Loan] {
        store.loans.filter { $0.itemId == item.id }
            .sorted { $0.lentOn > $1.lentOn }
    }

    var body: some View {
        List {
            // Status section
            Section {
                HStack {
                    Image(systemName: item.category.icon)
                        .font(.largeTitle)
                        .foregroundColor(.orange)
                    VStack(alignment: .leading) {
                        Text(item.name).font(.title2.bold())
                        Text(item.category.rawValue).foregroundColor(.secondary)
                    }
                    Spacer()
                }
                .padding(.vertical, 4)

                if !item.notes.isEmpty {
                    Text(item.notes).foregroundColor(.secondary)
                }
            }

            // Current loan
            if store.isLent(item), let loan = store.currentLoan(for: item),
               let person = store.person(for: loan.personId) {
                Section("Aktuell verliehen") {
                    HStack {
                        AvatarView(initials: person.initials, color: .orange)
                        VStack(alignment: .leading) {
                            Text(person.name).font(.headline)
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
                        .buttonStyle(.borderedProminent)
                        .tint(.green)
                    }
                }
            } else {
                Section {
                    Button {
                        showAddLoan = true
                    } label: {
                        Label("Verleihen", systemImage: "arrow.right.circle.fill")
                    }
                    .foregroundColor(.orange)
                }
            }

            // History
            if !loanHistory.isEmpty {
                Section("Verlauf") {
                    ForEach(loanHistory) { loan in
                        if let person = store.person(for: loan.personId) {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(person.name).font(.subheadline)
                                    Text(loan.lentOn.formatted(date: .abbreviated, time: .omitted))
                                        .font(.caption).foregroundColor(.secondary)
                                }
                                Spacer()
                                if loan.isReturned {
                                    Label("Zurück", systemImage: "checkmark.circle.fill")
                                        .font(.caption).foregroundColor(.green)
                                } else {
                                    Text("Offen")
                                        .font(.caption.bold())
                                        .foregroundColor(.orange)
                                }
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle(item.name)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddLoan) { AddLoanView(preselectedItem: item) }
    }
}
