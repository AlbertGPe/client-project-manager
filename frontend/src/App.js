import { Route, Routes } from "react-router-dom";
import ProjectsList from "./components/projects/projects-list/ProjectsList";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import ClientsList from "./components/clients/clients-list/ClientsList";

function App() {
  return (
    <div>
        <Navbar />
      <div className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsList />} />
           <Route path="/clients" element={<ClientsList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
