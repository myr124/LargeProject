import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Wheat, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiGet } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DarkModeToggle from "@/components/DarkModeToggle";

type Status = "loading" | "success" | "error";

export default function EmailVerified() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided.");
      return;
    }

    apiGet(`/verify/${token}`)
      .then((res) => {
        if (res.error) {
          setErrorMessage(res.error);
          setStatus("error");
        } else {
          setStatus("success");
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong. Please try again.");
        setStatus("error");
      });
  }, [token]);

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
          {status === "loading" && (
            <div className="text-center">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-7 h-7 text-muted-foreground animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Verifying your email…</p>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-medium text-foreground mb-1">Email verified</h1>
                <p className="text-sm text-muted-foreground">Your account is now active. You can log in.</p>
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

          {status === "error" && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-medium text-foreground mb-1">Verification failed</h1>
                <p className="text-sm text-muted-foreground">
                  {errorMessage || "This link is invalid or has expired."}
                </p>
              </div>
              <Card>
                <CardContent className="pt-6 flex flex-col gap-3">
                  <Button asChild variant="outline" className="w-full">
                    <a href="/signup">Create a new account</a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Verification links expire after 1 hour.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
