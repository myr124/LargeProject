import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Wheat, KeyRound } from "lucide-react";
import { apiReq } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [urlParams, setUrlParams] = useState({ email: "", token: "" });

  // Grab the email and token from the URL when the component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlParams({
      email: params.get("email") || "",
      token: params.get("token") || ""
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!urlParams.email || !urlParams.token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiReq("/resetpassword", {
        email: urlParams.email,
        token: urlParams.token,
        newPassword: password,
      });

      if (res.error) {
        setError(res.error || "Failed to reset password. The link may have expired.");
      } else {
        setSuccess("Your password has been successfully reset. You can now log in.");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
            Remembered it?{" "}
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
              <KeyRound className="w-7 h-7 text-orange-700 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-medium text-foreground mb-1">Reset your password</h1>
            <p className="text-sm text-muted-foreground">Enter a new password for your account</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {success ? (
                <div className="text-center flex flex-col gap-4">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
                  <Button asChild className="w-full">
                    <a href="/login">Go to Login</a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {error && <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">{error}</p>}
                  
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password" className="text-xs uppercase tracking-wide">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        className="pr-14"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wide">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full mt-1" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}