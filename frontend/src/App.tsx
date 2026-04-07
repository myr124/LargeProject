import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import BreadBoxd from "./pages/BreadBoxd";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BreadBoxd />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
