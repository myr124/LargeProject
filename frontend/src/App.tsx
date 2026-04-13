import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import BreadBoxd from "./pages/BreadBoxd";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import Creation from "./pages/Creation";
import SavedPosts from "./pages/SavedPosts";
import NewPost from "./pages/NewPost";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BreadBoxd />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/post/:id" element={<Creation />} />
                <Route path="/saved" element={<SavedPosts />} />
                <Route path="/new-post" element={<NewPost />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;