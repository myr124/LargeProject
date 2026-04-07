import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground transition-colors duration-300">
            
            <div className="flex flex-col items-center space-y-8 text-center">
                
                {/* The Main Title */}
                <h1 className="text-6xl font-extrabold tracking-tighter sm:text-8xl md:text-9xl text-primary drop-shadow-md">
                    Breadboxd
                </h1>

                {/* Minimal Subtitle */}
                <p className="mx-auto max-w-[600px] text-lg text-muted-foreground sm:text-xl">
                    Log, rate, and track your recipes. 
                </p>

                {/* Action Buttons */}
                <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row pt-4">
                    <Link 
                        to="/login" 
                        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Login
                    </Link>
                    <Link 
                        to="/register" 
                        className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Create Account
                    </Link>
                </div>
                
            </div>
            
        </div>
    );
};

export default HomePage;