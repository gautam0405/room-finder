import { Navigate, useLocation } from "react-router-dom";
import { getDefaultRoute, getSessionUser, isAuthenticated, normalizeRole } from "../utils/session";

function ProtectedRoute({ allowRoles = [], children }) {
  const location = useLocation();
  const user = getSessionUser();

  // 🔐 NOT LOGGED IN
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔐 ROLE CHECK
  if (allowRoles.length > 0 && !allowRoles.includes(normalizeRole(user.role))) {
    return <Navigate to={getDefaultRoute(user)} replace />;
  }

  return children;
}

export default ProtectedRoute;