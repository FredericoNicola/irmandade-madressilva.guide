import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

function ThemeToggle({
  isDark,
  toggleDark,
}: {
  isDark: boolean;
  toggleDark: () => void;
}) {
  return (
    <button
      onClick={toggleDark}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center transition-colors"
      style={{ color: "var(--fg-muted)" }}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <nav
      style={{
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-[68px] items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMenu}
          >
            <Logo
              size={30}
              className="transition-transform duration-300 group-hover:rotate-[36deg]"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--fg-muted)" }}
              >
                Irmandade
              </span>
              <span
                className="font-serif text-[17px] leading-tight"
                style={{ color: "var(--fg)" }}
              >
                Madressilva
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm transition-colors hover:text-[var(--brand)]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Dashboard
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin/users"
                    className="text-sm transition-colors hover:text-[var(--brand)]"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    Users
                  </Link>
                )}
                <span className="text-sm" style={{ color: "var(--fg-subtle)" }}>
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary btn-sm">
                Sign in
              </Link>
            )}
            <ThemeToggle isDark={isDark} toggleDark={toggleDark} />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle isDark={isDark} toggleDark={toggleDark} />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="flex h-8 w-8 items-center justify-center transition-colors"
              style={{ color: "var(--fg-muted)" }}
            >
              {mobileOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <div className="mx-auto max-w-7xl px-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-4 text-sm transition-colors hover:text-[var(--brand)]"
                  style={{
                    color: "var(--fg-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin/users"
                    className="block py-4 text-sm transition-colors hover:text-[var(--brand)]"
                    style={{
                      color: "var(--fg-muted)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onClick={closeMenu}
                  >
                    Users
                  </Link>
                )}
                <div
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary btn-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4">
                <Link
                  to="/login"
                  className="btn-primary btn-sm block w-full text-center"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
