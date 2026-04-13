import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiReq } from "../utils/api";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function EditProfile() {
  const navigate = useNavigate();

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    apiGet(`getUserInfo/${userId}`).then((res) => {
      if (!res.error) {
        setFirstName(res.firstName ?? "");
        setLastName(res.lastName ?? "");
        setUsername(res.username ?? "");
        setProfilePictureUrl(res.profilePictureUrl ?? "");
      }
      setLoading(false);
    });
  }, [userId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setError("First name, last name, and username are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await apiReq("updateUser", {
        userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        profilePictureUrl: profilePictureUrl.trim() || undefined,
      });
      if (res.error) {
        setError(res.error);
      } else {
        navigate("/profile");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const exampleImage = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
  const avatarSrc = profilePictureUrl.trim() || exampleImage;

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center p-20 text-muted-foreground animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h1>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Avatar preview */}
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 rounded-full border-4 border-border overflow-hidden bg-muted">
                  <img
                    src={avatarSrc}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = exampleImage; }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                <Input
                  id="profilePictureUrl"
                  placeholder="https://..."
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g. pasta_enjoyer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
                  Cancel
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
