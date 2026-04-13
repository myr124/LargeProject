import { useState } from "react";
import { Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Navbar() {
  const [isLoggedIn] = useState(() => !!localStorage.getItem("token"));

  return (
    <nav className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
      <div
        className="flex items-center gap-2 text-lg font-medium text-foreground cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center">
          <Wheat className="w-4 h-4 text-white" />
        </div>
        BreadBoxd
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <button className="hover:text-foreground transition-colors" onClick={() => (window.location.href = "/")}>
          Discover
        </button>
        <button className="hover:text-foreground transition-colors" onClick={() => (window.location.href = "/saved")}>
          My Recipes
        </button>
        <button className="hover:text-foreground transition-colors" onClick={() => (window.location.href = "/lists")}>
          Lists
        </button>
        <button className="hover:text-foreground transition-colors" onClick={() => (window.location.href = "/community")}>
          Community
        </button>
      </div>

      <div className="flex items-center gap-2">
        <DarkModeToggle />
        {isLoggedIn ? (
          <>
            <Button size="sm" variant="outline" onClick={() => (window.location.href = "/new-post")}>Post</Button>
            <Button size="sm" variant="outline" onClick={() => (window.location.href = "/profile")}>
              Profile
            </Button>
            <Button size="sm" onClick={doLogout}>
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => (window.location.href = "/login")}>
              Log in
            </Button>
            <Button size="sm" onClick={() => (window.location.href = "/signup")}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

function doLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
