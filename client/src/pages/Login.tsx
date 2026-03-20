import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Decorative left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}
      >
        <Logo size={40} className="opacity-80" />
        <div>
          <p className="font-serif text-5xl italic leading-tight opacity-90">
            The places that
            <br />
            made us who we are.
          </p>
          <p className="mt-6 text-sm opacity-50">— Irmandade Madressilva</p>
        </div>
        <p className="text-xs opacity-30 uppercase tracking-widest">Lisboa</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <Logo size={24} />
          </div>
          <h2 className="font-serif text-3xl" style={{ color: "var(--fg)" }}>
            Sign in
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--fg-muted)" }}>
            Welcome back to Irmandade Madressilva
          </p>

          {error && (
            <div className="mt-6 border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-800 dark:bg-danger-900/20 dark:text-danger-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg w-full"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
