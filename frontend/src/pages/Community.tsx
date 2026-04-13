import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiReq } from "../utils/api";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictureUrl?: string;
  followerCount: number;
  postCount: number;
}

const PLACEHOLDER = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

export default function Community() {
  const currentUserId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      const [usersRes, followingRes] = await Promise.all([
        apiGet("getAllUsers"),
        currentUserId ? apiGet(`getFollowing/${currentUserId}`) : Promise.resolve([]),
      ]);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(followingRes)) setFollowing(new Set(followingRes));
      setLoading(false);
    };
    fetchAll();
  }, [currentUserId]);

  const handleFollow = async (targetId: string) => {
    if (!currentUserId || pending.has(targetId)) return;
    setPending(p => new Set(p).add(targetId));
    const isFollowing = following.has(targetId);

    // Optimistic update
    setFollowing(prev => {
      const next = new Set(prev);
      isFollowing ? next.delete(targetId) : next.add(targetId);
      return next;
    });
    setUsers(prev => prev.map(u =>
      u._id === targetId
        ? { ...u, followerCount: u.followerCount + (isFollowing ? -1 : 1) }
        : u
    ));

    try {
      await apiReq(isFollowing ? "unfollow" : "follow", {
        follower_id: currentUserId,
        following_id: targetId,
      });
    } catch {
      // Roll back on failure
      setFollowing(prev => {
        const next = new Set(prev);
        isFollowing ? next.add(targetId) : next.delete(targetId);
        return next;
      });
      setUsers(prev => prev.map(u =>
        u._id === targetId
          ? { ...u, followerCount: u.followerCount + (isFollowing ? 1 : -1) }
          : u
      ));
    } finally {
      setPending(p => { const next = new Set(p); next.delete(targetId); return next; });
    }
  };

  const filtered = users.filter(u => {
    if (u._id === currentUserId) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.firstName ?? "").toLowerCase().includes(q) ||
      (u.lastName ?? "").toLowerCase().includes(q) ||
      (u.username ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <span className="text-sm text-muted-foreground">{users.length - (currentUserId ? 1 : 0)} cooks</span>
        </div>

        <input
          type="text"
          placeholder="Search by name or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-6 rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            {search ? "No cooks match your search." : "No other users yet."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(user => (
              <div key={user._id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <Link to={`/profile/${user._id}`} className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                  <img
                    src={user.profilePictureUrl || PLACEHOLDER}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-border"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {user.followerCount} followers · {user.postCount} posts
                    </p>
                  </div>
                </Link>
                {currentUserId && (
                  <Button
                    size="sm"
                    variant={following.has(user._id) ? "outline" : "default"}
                    disabled={pending.has(user._id)}
                    onClick={() => handleFollow(user._id)}
                    className="flex-shrink-0"
                  >
                    {following.has(user._id) ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
