import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateClientPage from "./pages/CreateClientPage";
import ProjectsPage from "./pages/ProjectsPage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import AuthStore from "./contexts/AuthStore";

function App() {
  return (
    <>
      <AuthStore>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<CreateClientPage />} />
            <Route path="/projects/new" element={<CreateProjectPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthStore>
    </>
  );
}

export default App;
