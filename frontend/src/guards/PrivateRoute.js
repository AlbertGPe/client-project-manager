import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthStore";
 
function PrivateRoute() {
  const { user } = useContext(AuthContext);
 
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
 
  return <Outlet />;
}
 
export default PrivateRoute;