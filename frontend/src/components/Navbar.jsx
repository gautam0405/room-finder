import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Add Room", path: "/add" },
  { label: "Search Room", path: "/search" },
  { label: "Map", path: "/map" },
];

function MoonIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.3 14.4A7.8 7.8 0 0 1 9.6 3.7 8.5 8.5 0 1 0 20.3 14.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleAuthAction = () => {
    setOpen(false);

    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    navigate("/login");
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100/80 bg-white/90 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <button
          type="button"
          onClick={() => goTo("/")}
          className="flex items-center"
          aria-label="Go to home"
        >
          <span className="text-2xl font-extrabold tracking-normal text-black">
            Room<span className="text-indigo-600">Finder</span>
          </span>
        </button>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => goTo(link.path)}
              className="text-lg font-medium text-slate-700 transition-colors duration-300 hover:text-indigo-600"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            aria-label="Toggle dark mode"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-500 bg-white text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-500/15"
          >
            <MoonIcon className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={handleAuthAction}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/35"
          >
            {token ? "Logout" : "Login"}
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:border-indigo-500 hover:text-indigo-600 lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-80 max-w-[86vw] flex-col border-l border-white/30 bg-white/85 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo("/")}
            className="flex items-center"
            aria-label="Go to home"
          >
            <span className="text-2xl font-extrabold tracking-normal text-black">
              Room<span className="text-indigo-600">Finder</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-900 transition-all duration-300 hover:bg-white"
            aria-label="Close menu"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => goTo(link.path)}
              className="rounded-2xl px-4 py-3 text-left text-base font-medium text-slate-700 transition-all duration-300 hover:bg-slate-950 hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            aria-label="Toggle dark mode"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 transition-all duration-300 hover:bg-white hover:text-slate-950"
          >
            <MoonIcon />
          </button>

          <button
            type="button"
            onClick={handleAuthAction}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {token ? "Logout" : "Login"}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </aside>
    </header>
  );
}

export default Navbar;
