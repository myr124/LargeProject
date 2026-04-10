

import { useState, useEffect, useMemo } from "react";
import { apiGet} from "../utils/api";
import useFetchUser from "../components/FetchUserHook";
import Navbar from "../components/ui/Navbar";

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

console.log("Extracted userId:", userId);

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



const exampleImage = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-stone-50">


        {/* Everything inside the same container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          {/* Profile Header - avatar overlaps banner */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="h-32 w-32 rounded-full border-4 border-white ring-2 ring-stone-200 overflow-hidden shadow-md flex-shrink-0">
                <img src={user?.profilePictureUrl || exampleImage} alt="Profile" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-semibold text-stone-800">
                      {user ? `${user.firstName} ${user.lastName}` : ""}
                    </h1>
                    <p className="text-stone-500 text-sm">
                        @{user ? `${user.username}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 text-sm border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 transition">
                      Edit Profile
                    </button>
                    {user?._id !== userId && (
                    <button className="px-4 py-1.5 text-sm bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition">
                      Follow
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-2 space-y-3">
            <p className="text-stone-700">
                Breadbox is awesome.
            </p>

          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-4 pt-4 border-t border-stone-200">
            <div className="text-center">
              <div className="font-semibold text-stone-800">{user ? user.postCount : 0}</div>
              <div className="text-sm text-stone-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-stone-800">{user ? user.followerCount : 0}</div>
              <div className="text-sm text-stone-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-stone-800">{user ? user.followingCount : 0}</div>
              <div className="text-sm text-stone-500">Following</div>
            </div>
          </div>

        </div>
        {/* User's posts */}
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Creations</h2>
        {posts.length === 0 ? (
        <p className="text-sm text-stone-500">Nothing to see here.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {posts.map((post, index) => (
                <div key={index} className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="aspect-video overflow-hidden bg-stone-100">
                        <img 
                            src={post.image_urls[0]} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>

                    <div className="p-5">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-stone-900 mb-3 leading-tight">
                            {post.title}
                        </h2>

                        {/* Description */}
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Description</span>
                            <p className="text-sm text-stone-600 mt-1 line-clamp-3 leading-relaxed">
                                {post.description}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-stone-100 w-full my-4" />
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Ingredients</span>
                            <p className="text-sm text-stone-700 mt-1 italic italic">
                                {post.ingredients}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        )}
        
        {/* <div className="mt-8">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Creations</h2>
            {posts.length === 0 ? (
             <p className="text-sm text-stone-500">Nothing to see here.</p>
             ) : (
            <div className="grid grid-cols-3 gap-4">
                {posts.map((post, index) => (
                <div key={index} className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-lg font-semibold text-stone-800">
                            {post.title}
                        </h1>
                    </div>
                    <div className="text-sm text-stone-600 mb-2 whitespace-pre-wrap break-all">
                        <h1 className="font-semibold">Description:</h1>
                        {post.description}
                    </div>
                    <div className = "aspect-video overflow-hidden bg-stone-100">
                        <img src={post.image_urls[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                        <h1 className="font-semibold">Ingredients:</h1>
                        {post.ingredients}
                    </div>
                </div>
            ))}
            </div>
            )}
        </div> */}
        
      </div>
    </>
  );

}

