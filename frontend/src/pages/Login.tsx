// Login.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { apiReq } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await apiReq("/login", { email, password });
    if (res.error) {
      alert(res.error);
    } else {
      localStorage.setItem("token", res.accessToken);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-lg font-medium text-foreground">
          <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center text-sm">🍞</div>
          BreadBoxd
        </a>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-orange-700 dark:text-orange-400 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🍞
            </div>
            <h1 className="text-2xl font-medium text-foreground mb-1">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Log in to your BreadBoxd account</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wide">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor="password" className="text-xs uppercase tracking-wide">Password</Label>
                    <a href="/forgot-password" className="text-xs text-orange-700 dark:text-orange-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
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

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(v: boolean | "indeterminate") => setRememberMe(v === true)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" className="w-full mt-1">Log in</Button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-3">
                <OAuthButton icon="G" label="Continue with Google" />
                <OAuthButton icon="f" label="Continue with Facebook" />
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to BreadBoxd?{" "}
            <a href="/signup" className="text-orange-700 dark:text-orange-400 hover:underline font-medium">
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

interface OAuthButtonProps {
  icon: string;
  label: string;
}

function OAuthButton({ icon, label }: OAuthButtonProps) {
  return (
    <Button type="button" variant="outline" className="w-full">
      <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
        {icon}
      </span>
      {label}
    </Button>
  );
}
