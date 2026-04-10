import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import BreadBoxd from "./pages/BreadBoxd";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import Creation from "./pages/Creation";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BreadBoxd />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/post" element={<Creation />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;