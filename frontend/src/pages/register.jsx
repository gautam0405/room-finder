import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isAuthenticated } from "../utils/session";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    location: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const updateField = (field, value) => {
    const nextValue = field === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("");

      if (!/^\d{10}$/.test(form.phone.trim())) {
        setMsg("Phone number must be exactly 10 digits");
        return;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        location: form.location.trim(),
      };

      await api.post("/register", payload);

      setMsg("Registered successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (!err.response) {
        setMsg("Cannot connect to server. Is the backend running on port 5001?");
        return;
      }

      const serverMsg = err.response?.data?.message;
      const detail = err.response?.data?.error;
      setMsg(detail ? `${serverMsg}: ${detail}` : serverMsg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = msg.toLowerCase().includes("success");

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-indigo-950/10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-fit text-3xl font-extrabold tracking-normal"
            >
              Room<span className="text-indigo-300">Finder</span>
            </button>

            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
                Student room finder
              </p>
              <h1 className="max-w-sm text-4xl font-bold leading-tight">
                Create your account and find rooms faster.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
                Save your details, search better rooms, and connect with listings that match your city and budget.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">9+</p>
                <p className="mt-1 text-xs text-white/65">Cities</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">1k+</p>
                <p className="mt-1 text-xs text-white/65">Rooms</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">24h</p>
                <p className="mt-1 text-xs text-white/65">Access</p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mx-auto max-w-xl">
              <div className="mb-8 text-center lg:text-left">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mb-5 text-3xl font-extrabold tracking-normal text-black lg:hidden"
                >
                  Room<span className="text-indigo-600">Finder</span>
                </button>
                <h2 className="text-3xl font-bold text-slate-950">Register</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Fill in your details to start searching rooms.
                </p>
              </div>

              {msg ? (
                <div
                  className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    isSuccess
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {msg}
                </div>
              ) : null}

              <form onSubmit={handleRegister} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </span>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      placeholder="Enter 10-digit phone number"
                      value={form.phone}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </span>
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="City or area"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Login
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
