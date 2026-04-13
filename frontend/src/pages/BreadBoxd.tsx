// BreadBoxd.tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { apiGet } from "../utils/api";
import { Button } from "@/components/ui/button";

export default function BreadBoxd() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <Hero />
      <main>
        <PopularRecipes />
        <div className="border-t border-border" />
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <ActivityFeed />
            <YourStats />
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  );
}


// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="bg-muted border-b border-border px-6 py-14 text-center">
      <p className="text-xs font-medium tracking-widest text-orange-700 dark:text-orange-400 uppercase mb-3">
        Your kitchen, your story
      </p>
      <h1 className="text-3xl font-medium text-foreground leading-snug mb-3">
        Track, review & discover<br />recipes you love
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        Log every dish you've cooked, rate your favorites, and find your next
        culinary adventure — like Letterboxd, but for food.
      </p>
      <div className="flex gap-3 justify-center">
        <Button>Start cooking</Button>
        <Button variant="outline">Browse recipes</Button>
      </div>
    </div>
  );
}

// ─── Popular Recipes ────────────────────────────────────────────────────────

function PopularRecipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await apiGet("getAllPosts");
        if (!res.error && Array.isArray(res)) {
          setRecipes(res.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch popular recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-medium text-foreground">🔥 Popular this week</h2>
        <Link to="/discover" className="text-xs text-orange-700 dark:text-orange-400 hover:underline">See all →</Link>
      </div>

      {loading ? (
        <div className="flex gap-4 animate-pulse">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-40 flex-1 bg-muted rounded-xl" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-xl">
          No recipes found. Start cooking to populate this list!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recipes.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}
    </section>
  );
}

function RecipeCard({ recipe }: { recipe: any }) {
  const imageUrl = recipe.image_urls?.[0];

  return (
    <Link
      to={`/post/${recipe._id}`}
      className="block bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-border/80 transition-all group hover:shadow-md"
    >
      <div className="h-28 bg-muted flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl">🍞</span>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-bold text-foreground mb-1 truncate">
          {recipe.title}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-orange-600 dark:text-orange-400 font-medium tracking-wide">
            ★ {recipe.rating ? recipe.rating.toFixed(1) : "New"}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Activity Feed ──────────────────────────────────────────────────────────

interface Activity {
  initials: string;
  avatarBg: string;
  avatarText: string;
  text: ReactNode;
  time: string;
}

const activities: Activity[] = [
  {
    initials: "JK", avatarBg: "bg-orange-100 dark:bg-orange-900", avatarText: "text-orange-800 dark:text-orange-200",
    text: <><strong>Jamie K.</strong> logged <strong>Sourdough Focaccia</strong> and rated it ★★★★★</>,
    time: "20 min ago",
  },
  {
    initials: "SR", avatarBg: "bg-green-100 dark:bg-green-900", avatarText: "text-green-800 dark:text-green-200",
    text: <><strong>Sara R.</strong> added <strong>Miso Glazed Salmon</strong> to her "Weeknight Wins" list</>,
    time: "1 hr ago",
  },
  {
    initials: "TM", avatarBg: "bg-indigo-100 dark:bg-indigo-900", avatarText: "text-indigo-800 dark:text-indigo-200",
    text: <><strong>Tom M.</strong> reviewed <strong>Beef Bourguignon</strong> — "Worth every hour of prep."</>,
    time: "3 hr ago",
  },
  {
    initials: "LL", avatarBg: "bg-pink-100 dark:bg-pink-900", avatarText: "text-pink-800 dark:text-pink-200",
    text: <><strong>Laura L.</strong> logged <strong>Shakshuka</strong> for the 4th time this month</>,
    time: "Yesterday",
  },
];

function ActivityFeed() {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-medium text-foreground">👥 Friend activity</h2>
        <a href="#" className="text-xs text-orange-700 dark:text-orange-400 hover:underline">Follow more →</a>
      </div>
      <div className="flex flex-col gap-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${a.avatarBg} ${a.avatarText}`}>
              {a.initials}
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.text}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Your Stats ─────────────────────────────────────────────────────────────

interface Stat {
  num: string;
  label: string;
}

const stats: Stat[] = [
  { num: "142", label: "Recipes logged" },
  { num: "38",  label: "Unique cuisines" },
  { num: "12",  label: "Lists made" },
];

const cuisineTags: string[] = ["Italian", "Japanese", "Mexican", "Thai", "French", "Indian"];

function YourStats() {
  return (
    <div>
      <h2 className="text-base font-medium text-foreground mb-4">📊 Your stats</h2>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-medium text-foreground">{s.num}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-2">Your most-cooked cuisines</p>
      <div className="flex flex-wrap gap-1.5">
        {cuisineTags.map((tag) => (
          <span key={tag} className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

interface TrendingItem {
  rank: string;
  name: string;
  count: string;
}

interface SuggestedItem {
  emoji: string;
  bg: string;
  title: string;
  reason: string;
}

const trending: TrendingItem[] = [
  { rank: "#1", name: "White miso", count: "3.2k uses" },
  { rank: "#2", name: "Nduja",      count: "2.8k uses" },
  { rank: "#3", name: "Yuzu",       count: "2.1k uses" },
  { rank: "#4", name: "Sumac",      count: "1.9k uses" },
  { rank: "#5", name: "Tamarind",   count: "1.6k uses" },
];

const suggested: SuggestedItem[] = [
  { emoji: "🫕", bg: "bg-orange-50 dark:bg-orange-900/30", title: "Birria Tacos", reason: "Based on your Mexican logs" },
  { emoji: "🍱", bg: "bg-green-50 dark:bg-green-900/30",  title: "Bento Bowl",   reason: "Popular with your friends" },
];

function Sidebar() {
  return (
    <aside className="flex flex-col gap-8 pt-1">
      <div>
        <h2 className="text-base font-medium text-foreground mb-3">📈 Trending ingredients</h2>
        <div className="flex flex-col gap-2">
          {trending.map((t) => (
            <div key={t.rank} className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <span className="text-xs font-medium text-orange-700 dark:text-orange-400 w-5">{t.rank}</span>
              <span className="text-sm font-medium text-foreground flex-1">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium text-foreground mb-3">✨ Suggested for you</h2>
        <div className="flex flex-col gap-3">
          {suggested.map((s) => (
            <div key={s.title} className="flex bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-border/80 transition-colors">
              <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center text-2xl ${s.bg}`}>
                {s.emoji}
              </div>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
