import SwiftUI

struct AddMoneyDebtView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) var dismiss

    @State private var selectedPersonId: UUID? = nil
    @State private var isNewPerson = false
    @State private var newPersonName = ""
    @State private var amount = ""
    @State private var description = ""
    @State private var direction: DebtDirection = .theyOweMe
    @State private var date = Date()

    var canSave: Bool {
        let hasAmount = Double(amount.replacingOccurrences(of: ",", with: ".")) != nil
        let hasPerson = selectedPersonId != nil ||
            (!newPersonName.trimmingCharacters(in: .whitespaces).isEmpty && isNewPerson)
        return hasAmount && hasPerson && !description.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            Form {
                // Direction toggle
                Section {
                    Picker("Richtung", selection: $direction) {
                        ForEach(DebtDirection.allCases, id: \.self) { d in
                            Label(d.rawValue, systemImage: d.icon).tag(d)
                        }
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()
                }

                // Person
                Section("Person") {
                    Toggle("Neue Person anlegen", isOn: $isNewPerson)

                    if isNewPerson {
                        TextField("Name der Person", text: $newPersonName)
                    } else {
                        Picker("Person wählen", selection: $selectedPersonId) {
                            Text("Bitte wählen").tag(Optional<UUID>(nil))
                            ForEach(store.people) { person in
                                Text(person.name).tag(Optional(person.id))
                            }
                        }
                        if store.people.isEmpty {
                            Text("Noch keine Personen gespeichert.")
                                .font(.caption).foregroundColor(.secondary)
                        }
                    }
                }

                // Amount & description
                Section("Betrag & Beschreibung") {
                    HStack {
                        TextField("0,00", text: $amount)
                            .keyboardType(.decimalPad)
                        Text("€")
                            .foregroundColor(.secondary)
                    }
                    TextField("Wofür?", text: $description)
                }

                Section("Datum") {
                    DatePicker("Datum", selection: $date, displayedComponents: .date)
                }
            }
            .navigationTitle("Schulden eintragen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Speichern") { save() }
                        .disabled(!canSave)
                }
            }
            .onAppear {
                if store.people.isEmpty { isNewPerson = true }
            }
        }
    }

    private func save() {
        guard let amt = Double(amount.replacingOccurrences(of: ",", with: ".")) else { return }

        var personId: UUID
        if isNewPerson {
            let person = Person(name: newPersonName.trimmingCharacters(in: .whitespaces))
            store.people.append(person)
            personId = person.id
        } else if let pid = selectedPersonId {
            personId = pid
        } else { return }

        let debt = MoneyDebt(
            personId: personId,
            amount: amt,
            description: description.trimmingCharacters(in: .whitespaces),
            direction: direction,
            createdAt: date
        )
        store.debts.append(debt)
        dismiss()
    }
}
