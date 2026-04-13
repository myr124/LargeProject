import React, { useEffect, useState, useMemo } from "react";
import { apiGet, apiReq } from "../utils/api";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPosts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(0);

  const currentUserId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).userId;
    } catch { return null; }
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPosts = async () => {
      try {
        const res = await apiGet(`getPostsById/${id}`);
        if (!res.error) setPosts(res[0]);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  const userId = post?.author_id;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await apiGet(`getUserInfo/${userId}`);
        if (!res.error) setUser(res);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleRate = async (ratingValue: number) => {
    try {
      const res = await apiReq("rate", {
        user_id: currentUserId,
        post_id: post._id,
        rating: ratingValue,
      });
      if (!res.error) {
        setPosts({ ...post, rating: ratingValue });
      }
    } catch (err) {
      console.error("Rate failed", err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await apiReq("savePost", { userId: currentUserId, postId: post._id });
      if (!res.error) console.log("Saved successfully");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const [commentText, setCommentText] = useState("");

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await apiReq("comment", {
        userId: currentUserId,
        postId: post._id,
        comment: commentText,
      });
      if (!res.error) {
        setCommentText("");
        alert("Comment posted!");
      }
    } catch (err) {
      console.error("Network error during comment", err);
    }
  };

  if (loading) return <div className="flex justify-center p-20 text-muted-foreground animate-pulse">Loading...</div>;
  if (!post) return <div className="flex justify-center p-20 text-foreground">Post not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-16">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </Link>

        <article className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="relative aspect-[16/10] w-full bg-muted">
            <img src={post.image_urls?.[0]} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-8 md:p-12">
            <header className="mb-10 text-center">
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">{post.title}</h1>
              <div className="flex justify-center items-center gap-3 text-muted-foreground">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden border border-border">
                  <img src={user?.profilePictureUrl} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-foreground">{user?.firstName} {user?.lastName}</span>
                <span>•</span>
                <span className="text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </header>

            <section className="space-y-10">
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-4">The Story</h3>
                <p className="text-xl text-foreground leading-relaxed font-serif">{post.description}</p>
              </div>

              <div className="bg-muted rounded-2xl p-8 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(post.ingredients) ? post.ingredients : [post.ingredients]).map((ing: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-background text-foreground text-sm font-medium border border-border">
                      {ing.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Give a Rating</h3>
                  <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHover(star)}
                        className="transition-transform hover:scale-125 focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${(hover || post.rating || 0) >= star ? "text-yellow-400" : "text-muted"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2">
                    <Button onClick={handleSave}>Save to List</Button>
                  </div>

                  <div className="w-full pt-8 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                      Leave a Comment
                    </h3>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        value={commentText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommentText(e.target.value)}
                        placeholder="What did you think of this recipe?"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleComment}
                        disabled={!commentText.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
