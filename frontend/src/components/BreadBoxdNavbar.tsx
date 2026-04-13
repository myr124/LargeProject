import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

interface BreadBoxdNavbarProps {
  variant: "full" | "minimal";
  authPrompt?: {
    message: string;
    linkText: string;
    linkHref: string;
  };
}

const navLinks = ["Discover", "My Recipes", "Lists", "Community"];

export default function BreadBoxdNavbar({ variant, authPrompt }: BreadBoxdNavbarProps) {
  return (
    <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 px-6 py-3 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 text-lg font-medium text-stone-800 dark:text-stone-100">
        <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center text-sm">
          🍞
        </div>
        BreadBoxd
      </a>

      {variant === "full" && (
        <>
          <div className="hidden md:flex items-center gap-6 text-sm text-stone-500 dark:text-stone-400">
            {navLinks.map((link) => (
              <a key={link} href="#" className="hover:text-stone-800 dark:hover:text-stone-100 transition-colors">
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Log in</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/signup">Sign up</a>
            </Button>
          </div>
        </>
      )}

      {variant === "minimal" && authPrompt && (
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {authPrompt.message}{" "}
            <a href={authPrompt.linkHref} className="text-orange-700 dark:text-orange-400 hover:underline font-medium">
              {authPrompt.linkText}
            </a>
          </p>
        </div>
      )}
    </nav>
  );
}
