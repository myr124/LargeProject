import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, ChevronDown, ChevronUp, ListIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet, apiReq } from "../utils/api";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp, staggerContainer, staggerItem } from "../utils/motion";

interface ListItem {
  _id: string;
  name: string;
  posts: any[];
  created_at: string;
}

export default function Lists() {
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  const [lists, setLists] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadedPosts, setLoadedPosts] = useState<Record<string, any[]>>({});
  const [loadingPosts, setLoadingPosts] = useState<string | null>(null);
  const [deletingListId, setDeletingListId] = useState<string | null>(null);
  const [removingPost, setRemovingPost] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    apiGet(`getLists/${userId}`)
      .then(res => { if (Array.isArray(res)) setLists(res); })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !userId) return;
    setCreating(true);
    try {
      const res = await apiReq("createList", { userId, name: newListName.trim() });
      if (!res.error) {
        setLists(prev => [{ ...res, posts: [] }, ...prev]);
        setNewListName("");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleExpand = async (listId: string) => {
    if (expandedId === listId) { setExpandedId(null); return; }
    setExpandedId(listId);
    if (loadedPosts[listId]) return;
    setLoadingPosts(listId);
    try {
      const res = await apiGet(`getListById/${listId}`);
      if (!res.error) setLoadedPosts(prev => ({ ...prev, [listId]: res.posts ?? [] }));
    } finally {
      setLoadingPosts(null);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm("Delete this list?")) return;
    setDeletingListId(listId);
    try {
      const res = await apiReq("deleteList", { listId, userId });
      if (!res.error) setLists(prev => prev.filter(l => l._id !== listId));
    } finally {
      setDeletingListId(null);
    }
  };

  const handleRemovePost = async (listId: string, postId: string) => {
    setRemovingPost(postId);
    try {
      const res = await apiReq("removeFromList", { listId, postId });
      if (!res.error) {
        setLoadedPosts(prev => ({
          ...prev,
          [listId]: (prev[listId] ?? []).filter(p => p._id !== postId),
        }));
        setLists(prev => prev.map(l =>
          l._id === listId ? { ...l, posts: l.posts.filter(id => id !== postId) } : l
        ));
      }
    } finally {
      setRemovingPost(null);
    }
  };

  if (!userId) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center p-20 text-muted-foreground">
        <a href="/login" className="text-orange-700 dark:text-orange-400 hover:underline">Log in</a>&nbsp;to manage your lists.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main className="max-w-2xl mx-auto px-4 py-10" variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ListIcon className="w-5 h-5" /> My Lists
          </h1>
          <span className="text-sm text-muted-foreground">{lists.length} list{lists.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Create new list */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-8">
          <Input
            placeholder="New list name..."
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
          />
          <Button type="submit" disabled={creating || !newListName.trim()}>
            <Plus className="w-4 h-4 mr-1" /> Create
          </Button>
        </form>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            No lists yet. Create one above to get started.
          </div>
        ) : (
          <motion.div className="flex flex-col gap-3" variants={staggerContainer} initial="hidden" animate="show">
            {lists.map(list => {
              const isExpanded = expandedId === list._id;
              const posts = loadedPosts[list._id] ?? [];
              const postCount = isExpanded ? posts.length : list.posts.length;

              return (
                <motion.div key={list._id} variants={staggerItem} className="border border-border rounded-xl overflow-hidden bg-card">
                  {/* List header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      className="flex-1 flex items-center justify-between text-left"
                      onClick={() => handleExpand(list._id)}
                    >
                      <div>
                        <p className="font-semibold text-foreground">{list.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {postCount} post{postCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      disabled={deletingListId === list._id}
                      onClick={() => handleDeleteList(list._id)}
                      aria-label="Delete list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Expanded posts */}
                  <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="border-t border-border px-4 py-3 flex flex-col gap-3"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      {loadingPosts === list._id ? (
                        <div className="flex flex-col gap-2 animate-pulse">
                          {[1, 2].map(n => <div key={n} className="h-16 bg-muted rounded-lg" />)}
                        </div>
                      ) : posts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No posts in this list yet. Add some from{" "}
                          <Link to="/saved" className="text-orange-700 dark:text-orange-400 hover:underline">My Recipes</Link>.
                        </p>
                      ) : (
                        posts.map(post => (
                          <div key={post._id} className="flex items-center gap-3 group">
                            <Link to={`/post/${post._id}`} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                {post.image_urls?.[0]
                                  ? <img src={post.image_urls[0]} alt={post.title} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">🍞</div>
                                }
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{post.description}</p>
                              </div>
                            </Link>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                              disabled={removingPost === post._id}
                              onClick={() => handleRemovePost(list._id, post._id)}
                              aria-label="Remove from list"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
