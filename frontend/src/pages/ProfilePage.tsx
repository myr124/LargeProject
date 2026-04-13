import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiGet, apiReq } from "../utils/api";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeUp, slideInLeft, staggerContainer, staggerItem } from "../utils/motion";

const PLACEHOLDER = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

export default function ProfilePage() {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const currentUserId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId ?? null;
    } catch { return null; }
  }, []);

  // View the param user, or fall back to the logged-in user
  const viewedId = paramUserId ?? currentUserId;
  const isOwnProfile = viewedId === currentUserId;

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [followPending, setFollowPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!viewedId) { setLoading(false); return; }

    const fetchData = async () => {
      const [userRes, postsRes] = await Promise.all([
        apiGet(`getUserInfo/${viewedId}`),
        apiGet(`getPostsByUser/${viewedId}`),
      ]);
      if (!userRes.error) setUser(userRes);
      if (!postsRes.error && Array.isArray(postsRes)) setPosts(postsRes);

      if (currentUserId && !isOwnProfile) {
        const followingRes = await apiGet(`getFollowing/${currentUserId}`);
        if (Array.isArray(followingRes)) setIsFollowing(followingRes.includes(viewedId));
      }
      setLoading(false);
    };

    fetchData();
  }, [viewedId, currentUserId, isOwnProfile]);

  const handleFollow = async () => {
    if (!currentUserId || followPending) return;
    setFollowPending(true);

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setUser((u: any) => u ? { ...u, followerCount: u.followerCount + (wasFollowing ? -1 : 1) } : u);

    try {
      await apiReq(wasFollowing ? "unfollow" : "follow", {
        follower_id: currentUserId,
        following_id: viewedId,
      });
    } catch {
      setIsFollowing(wasFollowing);
      setUser((u: any) => u ? { ...u, followerCount: u.followerCount + (wasFollowing ? 1 : -1) } : u);
    } finally {
      setFollowPending(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post? This can't be undone.")) return;
    setDeletingId(postId);
    try {
      const res = await apiReq("deletePost", { postId, userId: currentUserId });
      if (!res.error) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        setUser((u: any) => u ? { ...u, postCount: Math.max(0, (u.postCount ?? 1) - 1) } : u);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center p-20 text-muted-foreground animate-pulse">Loading...</div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center p-20 text-foreground">User not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header */}
        <motion.div
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-end gap-4"
          variants={slideInLeft}
          initial="hidden"
          animate="show"
        >
          <div className="h-32 w-32 rounded-full border-4 border-card ring-2 ring-border overflow-hidden shadow-md flex-shrink-0">
            <img
              src={user.profilePictureUrl || PLACEHOLDER}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
            />
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={() => navigate("/edit-profile")}>
                    Edit Profile
                  </Button>
                ) : currentUserId ? (
                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    disabled={followPending}
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex gap-8 pt-4 border-t border-border"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="text-center">
            <div className="font-semibold text-foreground">{user.postCount ?? 0}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{user.followerCount ?? 0}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{user.followingCount ?? 0}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Creations</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing to see here.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {posts.map((post) => (
                <motion.div key={post._id} className="group relative" variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Link to={`/post/${post._id}`} className="block">
                    <Card className="overflow-hidden p-0 h-full hover:shadow-md transition-shadow">
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={post.image_urls?.[0]}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5">
                        <h2 className="text-base font-bold text-foreground mb-2 leading-tight">{post.title}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.description}</p>
                        {post.rating > 0 && (
                          <p className="text-xs text-yellow-500 mt-2">{"★".repeat(Math.round(post.rating))}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                  {isOwnProfile && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={deletingId === post._id}
                      onClick={() => handleDelete(post._id)}
                      aria-label="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
