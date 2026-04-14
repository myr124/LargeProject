import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import BreadBoxd from "./pages/BreadBoxd";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import Creation from "./pages/Creation";
import SavedPosts from "./pages/SavedPosts";
import NewPost from "./pages/NewPost";
import EditProfile from "./pages/EditProfile";
import Community from "./pages/Community";
import Lists from "./pages/Lists";
import Discover from "./pages/Discover";
import EmailVerified from "./pages/EmailVerified";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BreadBoxd />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/post/:id" element={<Creation />} />
                <Route path="/saved" element={<SavedPosts />} />
                <Route path="/new-post" element={<NewPost />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/verify/:token" element={<EmailVerified />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;