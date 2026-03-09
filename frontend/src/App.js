import { Route, Routes } from "react-router-dom";
import ProjectsList from "./components/projects/projects-list/ProjectsList";
import HomePage from "./pages/HomePage";
import ClientsList from "./components/clients/clients-list/ClientsList";
import UsersRegister from "./components/users/users-register/UsersRegister";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import UsersLogin from "./components/users/users-login/UsersLogin";


function App() {
  return (
    <Routes>
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/clients" element={<ClientsList />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth/register" element={<UsersRegister />} />
        <Route path="/auth/login" element={<UsersLogin />} />

      </Route>

    </Routes>
  );
}

export default App;
