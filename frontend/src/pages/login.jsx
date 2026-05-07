import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getDefaultRoute, setSession } from "../utils/session";

export default function Login() {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      const { token, user } = res.data;
      const backendRole = user?.role?.toLowerCase();

      // Map UI roles to acceptable backend roles
      const roleMapping = {
        ADMIN: ["admin"],
        EMPLOYEE: ["landlord", "employee"],
        USER: ["student", "user"]
      };

      if (role && !roleMapping[role].includes(backendRole)) {
        alert(`This account is registered as ${backendRole}. Please select the correct role.`);
        setLoading(false);
        return;
      }

      setSession({ token, user });
      navigate(getDefaultRoute(user));
    } catch (error) {
      if (!error.response) {
        alert("Cannot connect to server. Is the backend running on port 5001? 🔌");
      } else {
        alert(error?.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    USER: { name: "User", emoji: "👤", color: "#667eea" },
    EMPLOYEE: { name: "Employee", emoji: "🏢", color: "#764ba2" },
    ADMIN: { name: "Admin", emoji: "⚙️", color: "#d64545" },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "var(--color-background-primary)",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "420px",
        padding: "2.5rem",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🏠</div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "500",
            margin: "0 0 0.5rem",
            color: "var(--color-text-primary)",
          }}>
            Student Room Finder
          </h1>
          <p style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            margin: "0",
          }}>
            Find your perfect accommodation
          </p>
        </div>

        {!role ? (
          /* Role Selection */
          <div>
            <p style={{
              fontSize: "14px",
              color: "var(--color-text-secondary)",
              margin: "0 0 1.5rem",
              textAlign: "center",
              fontWeight: "500",
            }}>
              Select your role to continue
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              {Object.entries(roleConfig).map(([roleKey, { name, emoji, color }]) => (
                <button
                  key={roleKey}
                  onClick={() => setRole(roleKey)}
                  style={{
                    padding: "1rem",
                    border: `1.5px solid ${color}`,
                    background: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: color,
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{emoji}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Login Form */
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "var(--color-text-primary)",
                margin: "0 0 0.5rem",
              }}>
                Login as <span style={{ color: roleConfig[role].color, fontWeight: "600" }}>
                  {roleConfig[role].name}
                </span>
              </p>
              <p style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                margin: "0",
              }}>
                Enter your credentials to access
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  padding: "12px 14px",
                  border: "1px solid var(--color-border-tertiary)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-tertiary)";
                  e.target.style.boxShadow = "none";
                }}
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  padding: "12px 14px",
                  border: "1px solid var(--color-border-tertiary)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-tertiary)";
                  e.target.style.boxShadow = "none";
                }}
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  padding: "12px",
                  background: loading
                    ? "#ccc"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", fontSize: "13px" }}>
              {role === "USER" && (
                <button
                  onClick={() => navigate("/register")}
                  style={{
                    flex: "1",
                    padding: "10px",
                    background: "var(--color-background-secondary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: "8px",
                    color: "var(--color-text-primary)",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  Create Account
                </button>
              )}
              <button
                onClick={() => setRole("")}
                style={{
                  flex: "1",
                  padding: "10px",
                  background: "var(--color-background-secondary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "8px",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
