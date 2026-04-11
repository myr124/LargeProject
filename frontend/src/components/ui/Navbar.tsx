
import { useState, useEffect } from "react";

export default function Navbar() {
    
    const [isLoggedIn] = useState(() => {
        return !!localStorage.getItem('token');
    });

    
    return (
        <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-medium text-stone-800" onClick={() => window.location.href = "/"} 
            style = {{cursor: "pointer"}}>
            <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center text-sm">
            🍞
            </div>
            BreadBoxd
        </div>
        {/* "Discover", "My Recipes", "Lists", "Community" */}
        <div className="hidden md:flex items-center gap-6 text-sm text-stone-500">
            <button className ="" onClick={() => window.location.href = "/"}> Discover </button>
            <button className ="" onClick={() => window.location.href = "/saved"}> My Recipes </button>
            <button className ="" onClick={() => window.location.href = "/lists"}> Lists </button>
            <button className ="" onClick={() => window.location.href = "/community"}> Community </button>
        </div>

        <div className="flex items-center gap-2">
            {isLoggedIn ? (
                <>
                <button className="text-sm px-4 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-900 transition-colors">
                    Post
                </button>
                <button className="text-sm px-4 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-900 transition-colors"
                onClick={() => window.location.href = "/profile"}>
                View Profile
                </button>

                <button className="text-sm px-4 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-900 transition-colors"
                onClick={doLogout}>
                Log Out
                </button>
                </>
            ):(
            <>
            <button className="text-sm px-4 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors" onClick={goToLogin}>
            Log in
            </button>
            <button className="text-sm px-4 py-2 rounded-lg bg-orange-700 text-white hover:bg-orange-800 transition-colors" onClick={goToSignup}>
            Sign up
            </button>
            </>
            )}

        </div>
        </nav>
  );
}

function goToLogin() {
    window.location.href = "/login";
}

function goToSignup() {
    window.location.href = "/signup";
}

function doLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}