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

      const roleMapping = {
        ADMIN: ["admin"],
        EMPLOYEE: ["landlord", "employee"],
        USER: ["student", "user"],
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
        alert("Cannot connect to server. Is the backend running on port 5001?");
      } else {
        alert(error?.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    USER: {
      name: "User",
      short: "U",
      color: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-400",
      active: "from-indigo-600 to-violet-600",
    },
    EMPLOYEE: {
      name: "Employee",
      short: "E",
      color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400",
      active: "from-emerald-600 to-teal-600",
    },
    ADMIN: {
      name: "Admin",
      short: "A",
      color: "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400",
      active: "from-rose-600 to-red-600",
    },
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200 lg:grid-cols-[1fr_0.95fr]">
          <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-fit text-3xl font-extrabold"
            >
              Room<span className="text-indigo-300">Finder</span>
            </button>

            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/75">
                Student room finder
              </p>
              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Sign in and manage rooms from one place.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                Students search rooms, employees verify listings, and admins manage the platform.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {["User", "Employee", "Admin"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-bold">{item}</p>
                  <p className="mt-1 text-xs text-white/55">Access</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mb-5 text-3xl font-extrabold text-slate-950 lg:hidden"
                >
                  Room<span className="text-indigo-600">Finder</span>
                </button>
                <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                  Welcome back
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Login</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Select your role and continue with your credentials.
                </p>
              </div>

              {!role ? (
                <div className="grid gap-3">
                  {Object.entries(roleConfig).map(([roleKey, config]) => (
                    <button
                      key={roleKey}
                      onClick={() => setRole(roleKey)}
                      type="button"
                      className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left font-semibold transition hover:-translate-y-0.5 hover:shadow-lg ${config.color}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-base font-bold shadow-sm">
                          {config.short}
                        </span>
                        <span>{config.name}</span>
                      </span>
                      <span className="text-sm">Continue</span>
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleLogin();
                  }}
                >
                  <div className={`rounded-2xl bg-gradient-to-r ${roleConfig[role].active} p-4 text-white shadow-lg`}>
                    <p className="text-sm text-white/75">Login as</p>
                    <p className="text-xl font-bold">{roleConfig[role].name}</p>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Email address
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </span>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`rounded-2xl bg-gradient-to-r ${roleConfig[role].active} px-5 py-3.5 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {role === "USER" ? (
                      <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Create Account
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setRole("")}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
