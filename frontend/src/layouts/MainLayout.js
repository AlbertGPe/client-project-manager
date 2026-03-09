import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;