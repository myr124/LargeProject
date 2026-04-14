// SignUp.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Wheat, ChefHat } from "lucide-react";
import { apiReq } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DarkModeToggle from "@/components/DarkModeToggle";

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
  form?: string;
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const res = await apiReq("/register", form);
    if (res.error) {
      setErrors({
        ...validationErrors,
        form: typeof res.error === "string" ? res.error : "Unable to create account.",
      });
    } else {
      alert("Account created successfully! Please check your email to verify your account.");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-lg font-medium text-foreground">
          <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center">
            <Wheat className="w-4 h-4 text-white" />
          </div>
          BreadBoxd
        </a>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-orange-700 dark:text-orange-400 hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-14">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-7 h-7 text-orange-700 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-medium text-foreground mb-1">Create your account</h1>
            <p className="text-sm text-muted-foreground">Start logging your culinary adventures</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {errors.form && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errors.form}
                  </p>
                )}

                <Field id="firstName" label="First name" type="text" placeholder="First name"
                  value={form.firstName} onChange={update("firstName")} error={errors.firstName} autoComplete="given-name" />

                <Field id="lastName" label="Last name" type="text" placeholder="Last name"
                  value={form.lastName} onChange={update("lastName")} error={errors.lastName} autoComplete="family-name" />

                <Field id="username" label="Username" type="text" placeholder="e.g. pasta_enjoyer"
                  value={form.username} onChange={update("username")} error={errors.username} autoComplete="username" />

                <Field id="email" label="Email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={update("email")} error={errors.email} autoComplete="email" />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wide">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={update("password")}
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      className="pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  <PasswordStrength password={form.password} />
                </div>

                <Field id="confirmPassword" label="Confirm password"
                  type={showPassword ? "text" : "password"} placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={update("confirmPassword")}
                  error={errors.confirmPassword} autoComplete="new-password" />

                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(v: boolean | "indeterminate") => setAgreedToTerms(v === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-snug cursor-pointer">
                      I agree to the{" "}
                      <a href="/terms" className="text-orange-700 dark:text-orange-400 hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="/privacy" className="text-orange-700 dark:text-orange-400 hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                  {errors.terms && <p className="text-xs text-destructive ml-6">{errors.terms}</p>}
                </div>

                <Button type="submit" className="w-full mt-1">Create account</Button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or sign up with</span>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-3">
                <OAuthButton icon="G" label="Continue with Google" />
                <OAuthButton icon="f" label="Continue with Facebook" />
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-orange-700 dark:text-orange-400 hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
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
      <Label htmlFor={id} className="text-xs uppercase tracking-wide">{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Password strength indicator ─────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const length = password.length;
  const strength: number =
    length === 0 ? 0
    : length < 8  ? 1
    : length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2
    : length >= 12 && /[^a-zA-Z0-9]/.test(password) ? 4
    : 3;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-green-500"];
  const textColors = ["", "text-red-500", "text-amber-500", "text-lime-600", "text-green-600"];

  if (strength === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]}</span>
    </div>
  );
}

// ─── OAuth Button ─────────────────────────────────────────────────────────────

function OAuthButton({ icon, label }: { icon: string; label: string }) {
  return (
    <Button type="button" variant="outline" className="w-full">
      <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
        {icon}
      </span>
      {label}
    </Button>
  );
}
