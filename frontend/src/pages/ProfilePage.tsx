import { useState, useEffect, useMemo } from "react";
import { apiGet } from "../utils/api";
import useFetchUser from "../components/FetchUserHook";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
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
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    const fetchPosts = async () => {
      try {
        const res = await apiGet(`getPostsByUser/${userId}`);
        if (!res.error) setPosts(res);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, [userId]);

  const exampleImage = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="h-32 w-32 rounded-full border-4 border-card ring-2 ring-border overflow-hidden shadow-md flex-shrink-0">
                <img src={user?.profilePictureUrl || exampleImage} alt="Profile" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                      {user ? `${user.firstName} ${user.lastName}` : ""}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      @{user ? user.username : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit Profile</Button>
                    {user?._id !== userId && (
                      <Button size="sm">Follow</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-3">
            <p className="text-foreground">Breadbox is awesome.</p>
          </div>

          <div className="flex gap-8 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="font-semibold text-foreground">{user ? user.postCount : 0}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">{user ? user.followerCount : 0}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">{user ? user.followingCount : 0}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Creations</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing to see here.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {posts.map((post, index) => (
                <Card key={index} className="group overflow-hidden p-0">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.image_urls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h2 className="text-xl font-bold text-foreground mb-3 leading-tight">{post.title}</h2>
                    <div className="mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</span>
                      <p className="text-sm text-foreground mt-1 line-clamp-3 leading-relaxed">{post.description}</p>
                    </div>
                    <div className="h-px bg-border w-full my-4" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ingredients</span>
                      <p className="text-sm text-foreground mt-1 italic">{post.ingredients}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
