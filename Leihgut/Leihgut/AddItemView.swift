import SwiftUI

struct AddItemView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) var dismiss

    @State private var name = ""
    @State private var category: ItemCategory = .tool
    @State private var notes = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Werkzeug") {
                    TextField("Name (z.B. Bohrmaschine)", text: $name)

                    Picker("Kategorie", selection: $category) {
                        ForEach(ItemCategory.allCases, id: \.self) { cat in
                            Label(cat.rawValue, systemImage: cat.icon).tag(cat)
                        }
                    }
                }

                Section("Notizen") {
                    TextField("Optional", text: $notes, axis: .vertical)
                        .lineLimit(3...6)
                }
            }
            .navigationTitle("Werkzeug hinzufügen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Speichern") { save() }
                        .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }

    private func save() {
        let item = Item(name: name.trimmingCharacters(in: .whitespaces),
                        category: category, notes: notes)
        store.items.append(item)
        dismiss()
    }
}
