// BreadBoxd.tsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Flame, Users, BarChart2, TrendingUp, Sparkles, Star, Wheat } from "lucide-react";
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
        <h2 className="text-base font-medium text-foreground flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /> Popular this week</h2>
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
          <Wheat className="w-10 h-10 text-muted-foreground" />
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-bold text-foreground mb-1 truncate">
          {recipe.title}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-medium">
            <Star className="w-3 h-3 fill-current" />
            {recipe.rating ? recipe.rating.toFixed(1) : "New"}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Activity Feed ──────────────────────────────────────────────────────────

interface ActivityItem {
  postId: string;
  postTitle: string;
  postRating: number;
  createdAt: string;
  author: { firstName: string; lastName: string; username: string; profilePictureUrl?: string } | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

const avatarColors = [
  "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
  "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200",
  "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200",
  "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
];

function ActivityFeed() {
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    apiGet(`getFriendActivity/${userId}`)
      .then((res) => { if (Array.isArray(res)) setActivity(res); })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-medium text-foreground flex items-center gap-1.5"><Users className="w-4 h-4" /> Friend activity</h2>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2.5 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : activity.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
          {userId ? "Follow some cooks to see their activity here." : "Log in to see friend activity."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activity.map((a, i) => {
            const author = a.author;
            const colorClass = avatarColors[i % avatarColors.length];
            const name = author ? `${author.firstName} ${author.lastName}` : "Someone";
            const stars = a.postRating ? "★".repeat(Math.round(a.postRating)) : null;
            return (
              <div key={a.postId} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 overflow-hidden ${colorClass}`}>
                  {author?.profilePictureUrl ? (
                    <img src={author.profilePictureUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    author ? initials(author.firstName, author.lastName) : "?"
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">{name}</strong> posted{" "}
                    <Link to={`/post/${a.postId}`} className="font-semibold text-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      {a.postTitle}
                    </Link>
                    {stars && (
                      <span className="inline-flex ml-1">
                        {Array.from({ length: Math.round(a.postRating) }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{timeAgo(a.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Your Stats ─────────────────────────────────────────────────────────────

function YourStats() {
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  const [user, setUser] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    Promise.all([
      apiGet(`getUserInfo/${userId}`),
      apiGet(`getPostsByUser/${userId}`),
    ]).then(([userRes, postsRes]) => {
      if (!userRes.error) setUser(userRes);
      if (Array.isArray(postsRes)) {
        const toProperCase = (s: string) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        const allTags = postsRes.flatMap((p: any) => Array.isArray(p.tags) ? p.tags : []);
        setTags([...new Set((allTags as string[]).map(toProperCase))].slice(0, 8));
      }
    }).finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return (
    <div className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
      <a href="/login" className="text-orange-700 dark:text-orange-400 hover:underline">Log in</a> to see your stats.
    </div>
  );

  if (loading) return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-muted rounded w-24" />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(n => <div key={n} className="h-16 bg-muted rounded-lg" />)}
      </div>
    </div>
  );

  const stats = [
    { num: user?.postCount ?? 0,              label: "Recipes logged" },
    { num: user?.followerCount ?? 0,           label: "Followers" },
    { num: user?.savedPosts?.length ?? 0,      label: "Saved" },
  ];

  return (
    <div>
      <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-1.5"><BarChart2 className="w-4 h-4" /> Your stats</h2>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-medium text-foreground">{s.num}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {tags.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground mb-2">Your tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar() {
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  const [trending, setTrending] = useState<{ name: string; count: number }[]>([]);
  const [suggested, setSuggested] = useState<any[]>([]);

  useEffect(() => {
    apiGet("getTrendingIngredients").then((res) => {
      if (Array.isArray(res)) setTrending(res);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    apiGet(`getSuggestedPosts/${userId}`).then((res) => {
      if (Array.isArray(res)) setSuggested(res);
    });
  }, [userId]);

  return (
    <aside className="flex flex-col gap-8 pt-1">
      {/* Trending Ingredients */}
      <div>
        <h2 className="text-base font-medium text-foreground mb-3 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Trending ingredients</h2>
        {trending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {trending.map((t, i) => (
              <div key={t.name} className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg">
                <span className="text-xs font-medium text-orange-700 dark:text-orange-400 w-5">#{i + 1}</span>
                <span className="text-sm font-medium text-foreground flex-1 truncate">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.count} use{t.count !== 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested for You */}
      {userId && (
        <div>
          <h2 className="text-base font-medium text-foreground mb-3 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Suggested for you</h2>
          {suggested.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing to suggest yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {suggested.map((post) => (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="flex bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors"
                >
                  <div className="w-14 h-14 flex-shrink-0 bg-muted overflow-hidden">
                    {post.image_urls?.[0] ? (
                      <img src={post.image_urls[0]} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wheat className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.rating > 0 ? (
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{post.rating.toFixed(1)}</span>
                    ) : "New"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
