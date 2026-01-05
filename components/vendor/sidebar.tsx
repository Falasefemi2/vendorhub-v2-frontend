"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function VendorSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/vendor/product", label: "Products", icon: Package },
        { href: "/vendor/settings", label: "Settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg hover:bg-muted transition bg-card border border-border"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 transition-transform duration-300 z-30 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-foreground">VendorHub</h2>
                    <p className="text-xs text-muted-foreground">Vendor Dashboard</p>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                            >
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className="w-full justify-start gap-3"
                                    asChild
                                >
                                    <span className="cursor-pointer">
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 bg-transparent"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                />
            )}
        </>
    );
}
