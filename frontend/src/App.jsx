import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx"; // ✅ FIXED
import Register from "./pages/register.jsx";

import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage.jsx";
import SearchRoom from "./pages/SearchRoom.jsx";
import AddRoom from "./pages/AddRoom.jsx";
import Map from "./pages/Map.jsx";
import Footer from "./components/footer.jsx";
import { getToken } from "./utils/session";


function AppContent() {
  const navigate = useNavigate();
const location = useLocation();
  const [hideFooterForSearchResults, setHideFooterForSearchResults] = useState(false);
  const hideNavbar = [
    "/login",
    "/register",
    "/admin-dashboard",
    "/landlord-dashboard",
  ].includes(location.pathname);
  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("User already logged in ✅");
    }
  }, []);

  useEffect(() => {
    setHideFooterForSearchResults(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleVisibility = (event) => {
      setHideFooterForSearchResults(Boolean(event.detail?.visible));
    };

    window.addEventListener("search-results-visibility", handleVisibility);
    return () => window.removeEventListener("search-results-visibility", handleVisibility);
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchRoom />} />
        <Route path="/map" element={<Map />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute allowRoles={["student", "admin", "landlord", "user"]}>
              <AddRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord-dashboard"
          element={
            <ProtectedRoute allowRoles={["landlord", "employee"]}>
              <EmployeeDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNavbar && !hideFooterForSearchResults && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
