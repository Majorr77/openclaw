import SwiftUI

struct AddLoanView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) var dismiss

    var preselectedItem: Item? = nil

    @State private var selectedItemId: UUID? = nil
    @State private var selectedPersonId: UUID? = nil
    @State private var newPersonName = ""
    @State private var isNewPerson = false
    @State private var lentOn = Date()
    @State private var hasDueDate = false
    @State private var dueDate = Date().addingTimeInterval(60 * 60 * 24 * 14) // 2 weeks
    @State private var notes = ""

    var availableItems: [Item] {
        store.items.filter { !store.isLent($0) }
    }

    var canSave: Bool {
        selectedItemId != nil &&
        (selectedPersonId != nil || (!newPersonName.trimmingCharacters(in: .whitespaces).isEmpty && isNewPerson))
    }

    var body: some View {
        NavigationStack {
            Form {
                // Item picker
                Section("Werkzeug") {
                    if availableItems.isEmpty && preselectedItem == nil {
                        Text("Keine verfügbaren Werkzeuge")
                            .foregroundColor(.secondary)
                    } else {
                        Picker("Werkzeug wählen", selection: $selectedItemId) {
                            Text("Bitte wählen").tag(Optional<UUID>(nil))
                            ForEach(preselectedItem.map { [$0] } ?? availableItems) { item in
                                Label(item.name, systemImage: item.category.icon).tag(Optional(item.id))
                            }
                        }
                    }
                }

                // Person picker
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
                            Text("Noch keine Personen. Lege eine neue an.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }

                // Dates
                Section("Datum") {
                    DatePicker("Verliehen am", selection: $lentOn, displayedComponents: .date)

                    Toggle("Rückgabedatum", isOn: $hasDueDate)
                    if hasDueDate {
                        DatePicker("Fällig am", selection: $dueDate, in: lentOn..., displayedComponents: .date)
                    }
                }

                Section("Notizen") {
                    TextField("Optional", text: $notes, axis: .vertical)
                        .lineLimit(3...6)
                }
            }
            .navigationTitle("Verleihung eintragen")
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
                if let item = preselectedItem {
                    selectedItemId = item.id
                }
                if store.people.isEmpty {
                    isNewPerson = true
                }
            }
        }
    }

    private func save() {
        var personId: UUID

        if isNewPerson {
            let person = Person(name: newPersonName.trimmingCharacters(in: .whitespaces))
            store.people.append(person)
            personId = person.id
        } else if let pid = selectedPersonId {
            personId = pid
        } else {
            return
        }

        guard let itemId = selectedItemId else { return }

        let loan = Loan(
            itemId: itemId,
            personId: personId,
            lentOn: lentOn,
            dueDate: hasDueDate ? dueDate : nil,
            notes: notes
        )
        store.loans.append(loan)
        dismiss()
    }
}
