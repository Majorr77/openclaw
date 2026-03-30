import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var store: AppStore
    @State private var showAddItem = false
    @State private var showAddLoan = false
    @State private var showAddDebt = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Stats row
                    HStack(spacing: 12) {
                        StatCard(
                            title: "Werkzeuge",
                            value: "\(store.items.count)",
                            subtitle: "\(store.activeLoans.count) verliehen",
                            icon: "wrench.and.screwdriver.fill",
                            color: .orange
                        )
                        StatCard(
                            title: "Offen",
                            value: "\(store.activeLoans.count)",
                            subtitle: "Verleihungen",
                            icon: "arrow.left.arrow.right.circle.fill",
                            color: .blue
                        )
                    }

                    HStack(spacing: 12) {
                        StatCard(
                            title: "Schulden",
                            value: String(format: "%.0f €", store.totalTheyOweMe),
                            subtitle: "schulden mir",
                            icon: "arrow.down.circle.fill",
                            color: .green
                        )
                        StatCard(
                            title: "Ich schulde",
                            value: String(format: "%.0f €", store.totalIOweThem),
                            subtitle: "von mir",
                            icon: "arrow.up.circle.fill",
                            color: .red
                        )
                    }

                    // Active people section
                    if !store.activePeople.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Was noch aussteht")
                                .font(.headline)
                                .padding(.horizontal)

                            ForEach(store.activePeople) { person in
                                NavigationLink(destination: PersonDetailView(person: person)) {
                                    PersonSummaryRow(person: person)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    } else {
                        EmptyStateView(
                            icon: "checkmark.circle.fill",
                            title: "Alles zurück!",
                            subtitle: "Du hast nichts verliehen und keine offenen Schulden."
                        )
                        .padding(.top, 40)
                    }

                    Spacer(minLength: 20)
                }
                .padding(.top)
            }
            .navigationTitle("Leihgut")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button { showAddItem = true } label: {
                            Label("Werkzeug hinzufügen", systemImage: "wrench.fill")
                        }
                        Button { showAddLoan = true } label: {
                            Label("Verleihung eintragen", systemImage: "arrow.left.arrow.right")
                        }
                        Button { showAddDebt = true } label: {
                            Label("Schulden eintragen", systemImage: "eurosign.circle")
                        }
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title3)
                    }
                }
            }
            .sheet(isPresented: $showAddItem) { AddItemView() }
            .sheet(isPresented: $showAddLoan) { AddLoanView() }
            .sheet(isPresented: $showAddDebt) { AddMoneyDebtView() }
        }
    }
}

// MARK: - Supporting Views

struct StatCard: View {
    let title: String
    let value: String
    let subtitle: String
    let icon: String
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
                .frame(width: 36)

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.title2.bold())
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
        .padding(.horizontal, 4)
    }
}

struct PersonSummaryRow: View {
    @EnvironmentObject var store: AppStore
    let person: Person

    var loans: [Loan] { store.activeLoans(for: person.id) }
    var debts: [MoneyDebt] { store.activeDebts(for: person.id) }

    var body: some View {
        HStack(spacing: 14) {
            AvatarView(initials: person.initials, color: .orange)

            VStack(alignment: .leading, spacing: 4) {
                Text(person.name)
                    .font(.headline)

                HStack(spacing: 8) {
                    if !loans.isEmpty {
                        Label("\(loans.count) Gegenstand\(loans.count > 1 ? "\"e" : "")", systemImage: "wrench.fill")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }
                    if !debts.isEmpty {
                        let total = debts.filter { $0.direction == .theyOweMe }.reduce(0) { $0 + $1.amount }
                        if total > 0 {
                            Label(String(format: "%.2f €", total), systemImage: "eurosign")
                                .font(.caption)
                                .foregroundColor(.green)
                        }
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
        .padding(.horizontal)
    }
}

struct AvatarView: View {
    let initials: String
    let color: Color
    var size: CGFloat = 40

    var body: some View {
        Text(initials)
            .font(.system(size: size * 0.4, weight: .semibold))
            .foregroundColor(.white)
            .frame(width: size, height: size)
            .background(color.gradient)
            .clipShape(Circle())
    }
}

struct EmptyStateView: View {
    let icon: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 56))
                .foregroundColor(.green)
            Text(title)
                .font(.title3.bold())
            Text(subtitle)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
    }
}
