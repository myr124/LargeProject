// SignUp.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { apiReq } from "../utils/api";

interface FormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignUp() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function update(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.username.trim()) errs.username = "Username is required.";
    if (!form.email.includes("@")) errs.email = "Enter a valid email.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match.";
    if (!agreedToTerms) errs.terms = "You must agree to the terms.";
    return errs;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiReq("/register", form);
    if (res.error) {
      setErrors({ ...validate(), ...res.error });
    } else{
        alert("Account created successfully! Please check your email to verify your account.");
        window.location.href = "/login";
    }
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
          Already have an account?{" "}
          <a href="/login" className="text-orange-700 hover:underline font-medium">
            Log in
          </a>
        </p>
      </nav>

      {/* Page body */}
      <div className="flex flex-1 items-center justify-center px-4 py-14">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🍳
            </div>
            <h1 className="text-2xl font-medium text-stone-800 mb-1">Create your account</h1>
            <p className="text-sm text-stone-500">Start logging your culinary adventures</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">




              {/* First name */}
              <Field
                id="firstName"
                label="First name"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={update("firstName")}
                error={errors.firstName}
                autoComplete="given-name"
              />

              {/* Last name */}
              <Field
                id="lastName"
                label="Last name"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={update("lastName")}
                error={errors.lastName}
                autoComplete="family-name"
              />

              {/* Username */}
              <Field
                id="username"
                label="Username"
                type="text"
                placeholder="e.g. pasta_enjoyer"
                value={form.username}
                onChange={update("username")}
                error={errors.username}
                autoComplete="username"
              />

              {/* Email */}
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
                autoComplete="email"
              />

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={update("password")}
                    autoComplete="new-password"
                    className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition ${
                      errors.password ? "border-red-400" : "border-stone-200"
                    }`}
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
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm password */}
              <Field
                id="confirmPassword"
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              {/* Terms */}
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 accent-orange-700 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-stone-500 leading-snug">
                    I agree to the{" "}
                    <a href="/terms" className="text-orange-700 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-orange-700 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-red-500 ml-6">{errors.terms}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium rounded-lg transition-colors mt-1"
              >
                Create account
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-stone-200" />
              <span className="text-xs text-stone-400">or sign up with</span>
              <div className="flex-1 border-t border-stone-200" />
            </div>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3">
              <OAuthButton icon="G" label="Continue with Google" />
              <OAuthButton icon="f" label="Continue with Facebook" />
            </div>
          </div>

          {/* Log in nudge */}
          <p className="text-center text-sm text-stone-400 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-orange-700 hover:underline font-medium">
              Log in
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

// ─── Reusable field ──────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

function Field({ id, label, type, placeholder, value, onChange, error, autoComplete }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-stone-600 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition ${
          error ? "border-red-400" : "border-stone-200"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Password strength indicator ─────────────────────────────────────────────

interface PasswordStrengthProps {
  password: string;
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  const length = password.length;
  const strength: number =
    length === 0 ? 0
    : length < 8  ? 1
    : length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2
    : length >= 12 && /[^a-zA-Z0-9]/.test(password) ? 4
    : 3;

  const labels: string[] = ["", "Weak", "Fair", "Good", "Strong"];
  const colors: string[] = ["", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-green-500"];
  const textColors: string[] = ["", "text-red-500", "text-amber-500", "text-lime-600", "text-green-600"];

  if (strength === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${textColors[strength]}`}>
        {labels[strength]}
      </span>
    </div>
  );
}

// ─── OAuth Button ─────────────────────────────────────────────────────────────

interface OAuthButtonProps {
  icon: string;
  label: string;
}

function OAuthButton({ icon, label }: OAuthButtonProps) {
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
