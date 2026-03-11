import { Route, Routes } from "react-router-dom";
import ProjectsList from "./components/projects/projects-list/ProjectsList";
import HomePage from "./pages/HomePage";
import ClientsList from "./components/clients/clients-list/ClientsList";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateClientPage from "./pages/CreateClientPage";


function App() {
  return (
    <Routes>
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/new" element={<CreateClientPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>

    </Routes>
  );
}

export default App;
