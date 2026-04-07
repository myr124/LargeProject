// Login.jsx
// BreadBoxd login page.
// Uses only Tailwind utility classes — no extra dependencies needed.

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up your auth logic here
    console.log({ email, password, rememberMe });
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Minimal navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-lg font-medium text-stone-800">
          <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center text-sm">
            🍞
          </div>
          BreadBoxd
        </a>
        <p className="text-sm text-stone-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-orange-700 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </nav>

      {/* Page body */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🍞
            </div>
            <h1 className="text-2xl font-medium text-stone-800 mb-1">Welcome back</h1>
            <p className="text-sm text-stone-500">Log in to your BreadBoxd account</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="password" className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-xs text-orange-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors text-xs"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 accent-orange-700 cursor-pointer"
                />
                <span className="text-sm text-stone-500">Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium rounded-lg transition-colors mt-1"
              >
                Log in
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-stone-200" />
              <span className="text-xs text-stone-400">or continue with</span>
              <div className="flex-1 border-t border-stone-200" />
            </div>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3">
              <OAuthButton icon="G" label="Continue with Google" />
              <OAuthButton icon="f" label="Continue with Facebook" />
            </div>
          </div>

          {/* Sign up nudge */}
          <p className="text-center text-sm text-stone-400 mt-6">
            New to BreadBoxd?{" "}
            <a href="/signup" className="text-orange-700 hover:underline font-medium">
              Create a free account
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-100 px-6 py-4 flex items-center justify-center gap-6 text-xs text-stone-400">
        {["About", "Privacy", "Terms", "Help"].map((l) => (
          <a key={l} href="#" className="hover:text-stone-600 transition-colors">{l}</a>
        ))}
      </footer>
    </div>
  );
}

// ─── OAuth Button ────────────────────────────────────────────────────────────

function OAuthButton({ icon, label }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 text-sm text-stone-700 font-medium transition-colors"
    >
      <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600">
        {icon}
      </span>
      {label}
    </button>
  );
}
