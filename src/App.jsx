import "./App.css"; 
import Header from "./components/Header"; 
import Footer from "./components/Footer"; 
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-grid min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
