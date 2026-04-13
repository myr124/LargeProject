import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wheat, Star, Search } from "lucide-react";
import { motion } from "framer-motion";
import { apiGet } from "../utils/api";
import Navbar from "../components/ui/Navbar";
import { Input } from "@/components/ui/input";
import { fadeUp, staggerContainer, staggerItem } from "../utils/motion";

export default function Discover() {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiGet("getAllPosts")
      .then((res) => { if (Array.isArray(res)) setAllPosts(res); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = allPosts.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (p.title ?? "").toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q) ||
      (Array.isArray(p.tags) ? p.tags : []).some((t: string) => t.toLowerCase().includes(q)) ||
      (Array.isArray(p.ingredients) ? p.ingredients : []).some((i: string) => i.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main
        className="max-w-6xl mx-auto px-6 py-10"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Recipes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading ? "Loading…" : `${filtered.length} recipe${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              placeholder="Search by title, ingredient, tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted h-56" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground text-sm"
          >
            {query ? `No recipes match "${query}".` : "No recipes yet. Be the first to post one!"}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {filtered.map((post) => (
              <motion.div key={post._id} variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <Link
                  to={`/post/${post._id}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow block h-full"
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    {post.image_urls?.[0] ? (
                      <img
                        src={post.image_urls[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wheat className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-0.5 text-xs font-medium text-orange-600 dark:text-orange-400">
                        <Star className="w-3 h-3 fill-current" />
                        {post.rating ? post.rating.toFixed(1) : "New"}
                      </span>
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <span className="text-xs text-muted-foreground truncate max-w-[60%] text-right">
                          {post.tags[0].replace(/\w\S*/g, (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
