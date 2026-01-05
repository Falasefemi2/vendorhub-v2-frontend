"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-border bg-card sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">
                                V
                            </span>
                        </div>
                        <span className="font-bold text-lg text-foreground hidden sm:inline">
                            VendorHub
                        </span>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="flex-1 mx-8 hidden md:flex">
                        <div className="w-full relative">
                            <Input
                                type="text"
                                placeholder="Search products, stores..."
                                className="w-full bg-muted"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Desktop Menu - CHANGE: Removed cart, updated button text */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/stores"
                            className="text-sm text-foreground hover:text-primary transition"
                        >
                            Stores
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm text-foreground hover:text-primary transition"
                        >
                            Vendor Login
                        </Link>
                        <Button size="sm" asChild>
                            <Link href="/signup">Become a Vendor</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu - CHANGE: Removed cart button, updated navigation */}
                {isOpen && (
                    <div className="md:hidden border-t border-border py-4 space-y-4">
                        <Input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-muted"
                        />
                        <Link
                            href="/stores"
                            className="block text-sm text-foreground hover:text-primary py-2"
                        >
                            Stores
                        </Link>
                        <Link
                            href="/login"
                            className="block text-sm text-foreground hover:text-primary py-2"
                        >
                            Vendor Login
                        </Link>
                        <Button className="w-full" size="sm" asChild>
                            <Link href="/signup">Become a Vendor</Link>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
