import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">G</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        Global Student
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/learn" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Learn
                            </Link>
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{user.username}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Admin
                            </Link>
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg">
                                    Dashboard
                                </Link>
                                <Link to="/learn" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg">
                                    Learn
                                </Link>
                                <button onClick={logout} className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg text-left text-destructive">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/admin/login" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg">
                                    Admin Portal
                                </Link>
                                <Link to="/login" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg">
                                    Log In
                                </Link>
                                <Link to="/register" className="text-sm font-medium p-2 hover:bg-white/5 rounded-lg text-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
