import { useEffect, useState, useMemo } from "react";
import { Wheat, Star, Trash2, ListPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet, apiReq } from "../utils/api";
import useFetchUser from "../components/FetchUserHook";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ListItem {
  _id: string;
  name: string;
}

export default function SavedPosts() {
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  const user = useFetchUser(userId);
  const [savedPostsData, setSavedPostsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Lists state
  const [lists, setLists] = useState<ListItem[]>([]);
  const [pickerPostId, setPickerPostId] = useState<string | null>(null);
  const [addingToList, setAddingToList] = useState(false);

  useEffect(() => {
    if (!user || !user.savedPosts || user.savedPosts.length === 0) {
      setSavedPostsData([]);
      return;
    }
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          user.savedPosts.map((id: string) => apiGet(`getPostsById/${id}`))
        );
        setSavedPostsData(results.map(r => Array.isArray(r) ? r[0] : r).filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch saved posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    apiGet(`getLists/${userId}`).then(res => {
      if (Array.isArray(res)) setLists(res);
    });
  }, [userId]);

  const handleUnsave = async (postId: string) => {
    if (!userId || !confirm("Remove this from your saved list?")) return;
    setRemovingId(postId);
    try {
      const res = await apiReq("unsavePost", { userId, postId });
      if (!res.error) setSavedPostsData(prev => prev.filter(p => p._id !== postId));
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToList = async (listId: string) => {
    if (!pickerPostId) return;
    setAddingToList(true);
    try {
      await apiReq("addToList", { listId, postId: pickerPostId });
    } finally {
      setAddingToList(false);
      setPickerPostId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background" onClick={() => setPickerPostId(null)}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Saved Creations</h2>
          <Link to="/lists" className="text-sm text-orange-700 dark:text-orange-400 hover:underline">
            Manage lists →
          </Link>
        </div>

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
              <div key={index} className="group relative">
                <Link to={`/post/${post._id}`} className="block">
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

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Add to list */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setPickerPostId(pickerPostId === post._id ? null : post._id)}
                      aria-label="Add to list"
                    >
                      <ListPlus className="w-4 h-4" />
                    </Button>

                    {pickerPostId === post._id && (
                      <div className="absolute right-0 top-10 z-10 bg-card border border-border rounded-lg shadow-lg min-w-40 overflow-hidden">
                        {lists.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-muted-foreground">
                            No lists yet.{" "}
                            <Link to="/lists" className="text-orange-700 dark:text-orange-400 hover:underline">
                              Create one
                            </Link>
                          </div>
                        ) : (
                          lists.map(list => (
                            <button
                              key={list._id}
                              disabled={addingToList}
                              onClick={() => handleAddToList(list._id)}
                              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              {list.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove from saved */}
                  <Button
                    size="icon"
                    variant="destructive"
                    disabled={removingId === post._id}
                    onClick={() => handleUnsave(post._id)}
                    aria-label="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
