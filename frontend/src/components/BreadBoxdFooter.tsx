interface BreadBoxdFooterProps {
  variant: "full" | "minimal";
}

const minimalLinks = ["About", "Privacy", "Terms", "Help"];
const fullLinks = ["About", "Blog", "Privacy", "Terms"];

export default function BreadBoxdFooter({ variant }: BreadBoxdFooterProps) {
  if (variant === "full") {
    return (
      <footer className="border-t border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 px-6 py-5 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
        <span>© 2026 BreadBoxd</span>
        <div className="flex gap-4">
          {fullLinks.map((l) => (
            <a key={l} href="#" className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 px-6 py-4 flex items-center justify-center gap-6 text-xs text-stone-400 dark:text-stone-500">
      {minimalLinks.map((l) => (
        <a key={l} href="#" className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">{l}</a>
      ))}
    </footer>
  );
}
