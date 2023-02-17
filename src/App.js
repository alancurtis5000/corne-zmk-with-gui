import "./App.scss";
import { BottomActions } from "./components/bottom-actions/bottom-actions.componet";
import { Header } from "./components/header/header.component";
import { AppRouter } from "./router/app-router";
import { LayoutProvider } from "./providers/layout/layout.provider";

function App() {
  return (
    <div className="App">
      <LayoutProvider>
        <Header />
        <AppRouter />
        <BottomActions />
      </LayoutProvider>
    </div>
  );
}

export default App;
