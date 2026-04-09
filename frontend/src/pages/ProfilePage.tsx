

import { useState, useEffect, useMemo } from "react";
import { apiGet} from "../utils/api";
import Navbar from "../components/ui/Navbar";
interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    profilePictureUrl: string | null;

}

export default function ProfilePage() {
const [userData, setUserData] = useState<UserData | null>(null);


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

console.log("Extracted userId:", userId);

useEffect(() => {
  if (!userId) {          
    window.location.href = "/login";
    return;
  }

  const fetchUserData = async () => {
    try {
      const res = await apiGet(`getUserInfo/${userId}`);
      if (res.error) {
        console.error(res.error);
      } else {
        setUserData(res);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  fetchUserData();
}, [userId]);

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
                <img src={userData?.profilePictureUrl || exampleImage} alt="Profile" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-semibold text-stone-800">
                      {userData ? `${userData.firstName} ${userData.lastName}` : "Jane Doe"}
                    </h1>
                    <p className="text-stone-500 text-sm">
                        @{userData ? `${userData.username}` : "janedoe"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 text-sm border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 transition">
                      Edit Profile
                    </button>
                    {userData?._id !== userId && (
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
              <div className="font-semibold text-stone-800">{userData ? userData.postCount : 0}</div>
              <div className="text-sm text-stone-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-stone-800">{userData ? userData.followerCount : 0}</div>
              <div className="text-sm text-stone-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-stone-800">{userData ? userData.followingCount : 0}</div>
              <div className="text-sm text-stone-500">Following</div>
            </div>
          </div>

        </div>

        <div className="mt-8">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Creations</h2>
            {posts.length === 0 ? (
             <p className="text-sm text-stone-500">Nothing to see here.</p>
             ) : (
            <div className="grid grid-cols-3 gap-4">
                {posts.map((post, index) => (
                <div key={index} className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
                    <pre className="text-xs text-stone-600 whitespace-pre-wrap break-all">
                    {JSON.stringify(post, null, 2)}
                    </pre>
                </div>
            ))}
            </div>
            )}
        </div>
        
      </div>
    </>
  );

}

