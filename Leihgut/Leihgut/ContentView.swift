import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: AppStore

    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Übersicht", systemImage: "house.fill")
                }

            ItemsView()
                .tabItem {
                    Label("Werkzeuge", systemImage: "wrench.and.screwdriver.fill")
                }

            LoansView()
                .tabItem {
                    Label("Verliehen", systemImage: "arrow.left.arrow.right.circle.fill")
                }

            MoneyView()
                .tabItem {
                    Label("Geld", systemImage: "eurosign.circle.fill")
                }
        }
        .tint(.orange)
    }
}
