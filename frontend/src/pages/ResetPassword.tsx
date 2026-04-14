import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Wheat, CheckCircle } from "lucide-react";
import { apiReq } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const res = await apiReq(`/reset-password/${token}`, { password });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
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
        <DarkModeToggle />
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wheat className="w-7 h-7 text-orange-700 dark:text-orange-400" />
                </div>
                <h1 className="text-2xl font-medium text-foreground mb-1">Set a new password</h1>
                <p className="text-sm text-muted-foreground">Must be at least 8 characters.</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password" className="text-xs uppercase tracking-wide">New password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="confirm" className="text-xs uppercase tracking-wide">Confirm password</Label>
                      <Input
                        id="confirm"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <Button type="submit" className="w-full mt-1" disabled={loading}>
                      {loading ? "Resetting…" : "Reset password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-medium text-foreground mb-1">Password updated</h1>
                <p className="text-sm text-muted-foreground">You can now log in with your new password.</p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <Button asChild className="w-full">
                    <a href="/login">Log in to BreadBoxd</a>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
