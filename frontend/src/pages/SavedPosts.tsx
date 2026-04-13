import { useEffect, useState, useMemo } from "react";
import { Wheat, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet } from "../utils/api";
import useFetchUser from "../components/FetchUserHook";
import Navbar from "../components/ui/Navbar";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedPosts() {
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId ?? null;
    } catch {
      return null;
    }
  }, []);

  const user = useFetchUser(userId);
  const [savedPostsData, setSavedPostsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.savedPosts || user.savedPosts.length === 0) {
      setSavedPostsData([]);
      return;
    }

    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const postPromises = user.savedPosts.map((id: string) => apiGet(`getPostsById/${id}`));
        const results = await Promise.all(postPromises);
        const actualPosts = results
          .map((res) => (Array.isArray(res) ? res[0] : res))
          .filter(Boolean);
        setSavedPostsData(actualPosts);
      } catch (err) {
        console.error("Failed to fetch saved posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Saved Creations</h2>

        {loading ? (
          <div className="flex gap-4 animate-pulse">
            <div className="h-48 w-full md:w-1/3 bg-muted rounded-xl" />
            <div className="h-48 w-full md:w-1/3 bg-muted rounded-xl" />
          </div>
        ) : savedPostsData.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground font-medium">Nothing to see here yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Posts you save will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedPostsData.map((post, index) => (
              <Link
                to={`/post/${post._id}`}
                key={index}
                className="group block"
              >
                <Card className="overflow-hidden p-0 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {post.image_urls?.[0] ? (
                      <img
                        src={post.image_urls[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                      <Wheat className="w-10 h-10 text-muted-foreground" />
                    </div>
                    )}
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {post.title}
                    </h2>

                    <div className="mb-4 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <Star className="w-3 h-3" /> {post.rating ? post.rating.toFixed(1) : "New"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
