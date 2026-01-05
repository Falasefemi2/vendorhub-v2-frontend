"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your store and account settings
                </p>
            </div>

            <Tabs defaultValue="store" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="store">Store Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* Store Settings */}
                <TabsContent value="store" className="space-y-6">
                    <Card className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Store Name
                                </label>
                                <Input type="text" defaultValue="TechGear Pro" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Email
                                </label>
                                <Input type="email" defaultValue="seller@techgear.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">
                                Store Description
                            </label>
                            <Textarea
                                defaultValue="Premium technology products and accessories for tech enthusiasts."
                                rows={6}
                                className="resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Phone
                                </label>
                                <Input type="tel" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Country
                                </label>
                                <select className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground">
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>United Kingdom</option>
                                </select>
                            </div>
                        </div>

                        <Button className="w-full sm:w-auto">Save Changes</Button>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="p-6 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Change Password</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">
                                        Current Password
                                    </label>
                                    <Input type="password" placeholder="Enter current password" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">
                                        New Password
                                    </label>
                                    <Input type="password" placeholder="Enter new password" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">
                                        Confirm Password
                                    </label>
                                    <Input type="password" placeholder="Confirm new password" />
                                </div>
                                <Button className="w-full sm:w-auto">Update Password</Button>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6">
                            <h3 className="font-bold mb-4">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add an extra layer of security to your account
                            </p>
                            <Button variant="outline">Enable 2FA</Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="p-6 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Notification Preferences</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "New Orders", enabled: true },
                                    { label: "Order Status Updates", enabled: true },
                                    { label: "Product Inquiries", enabled: true },
                                    { label: "Store Reviews", enabled: false },
                                    { label: "Marketing Emails", enabled: false },
                                ].map((item, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            defaultChecked={item.enabled}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-foreground">
                                            {item.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <Button className="w-full sm:w-auto mt-4">
                                Save Preferences
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
