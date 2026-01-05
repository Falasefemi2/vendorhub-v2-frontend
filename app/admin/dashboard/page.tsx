"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Store, Loader2, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
    useApprovedVendors,
    useApproveVendor,
    usePendingVendors,
} from "@/utils/api/store/admin";
import { Vendor } from "@/utils/api/store/admin/types";

export default function AdminDashboard() {
    const { data: pendingVendorsData, isLoading: pendingLoading } =
        usePendingVendors();
    const { data: approvedVendorsData, isLoading: approvedLoading } =
        useApprovedVendors();
    const approveVendorMutation = useApproveVendor();
    const [activeTab, setActiveTab] = useState("pending");

    const pendingVendors = (pendingVendorsData || []).filter(
        (vendor: Vendor) => !vendor.is_active,
    );
    const approvedVendors = (approvedVendorsData || []).filter(
        (vendor: Vendor) => vendor.is_active,
    );

    const stats = [
        {
            label: "Total Vendors",
            value: (pendingVendors.length + approvedVendors.length).toString(),
            change: "+12",
            icon: Users,
        },
        {
            label: "Pending Approval",
            value: pendingVendors.length.toString(),
            change: "⚠️",
            icon: Clock,
        },
        {
            label: "Approved Vendors",
            value: approvedVendors.length.toString(),
            change: "✓",
            icon: CheckCircle,
        },
    ];

    const handleApprove = async (vendorId: string) => {
        await approveVendorMutation.mutateAsync(vendorId);
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Manage vendors and platform overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-blue-600">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium mb-1">
                                {stat.label}
                            </h3>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </Card>
                    );
                })}
            </div>

            {/* Vendors Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending">
                        Pending Vendors ({pendingVendors.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved Vendors ({approvedVendors.length})
                    </TabsTrigger>
                </TabsList>

                {/* Pending Vendors Tab */}
                <TabsContent value="pending">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Pending Vendor Approvals</h2>
                        </div>

                        {pendingLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : pendingVendors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="w-12 h-12 text-muted-foreground/40 mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    No Pending Vendors
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    All vendor applications have been reviewed
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Vendor Name
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Store
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Applied
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingVendors.map((vendor: Vendor) => (
                                            <tr
                                                key={vendor.id}
                                                className="border-b border-border hover:bg-muted/50 transition"
                                            >
                                                <td className="py-3 px-4 font-medium text-foreground">
                                                    {vendor.name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {vendor.store_name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {vendor.email}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {new Date(vendor.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline">
                                                            Review
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove(vendor.id)}
                                                            disabled={approveVendorMutation.isPending}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            {approveVendorMutation.isPending ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                                    Approving...
                                                                </>
                                                            ) : (
                                                                "Approve"
                                                            )}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-destructive hover:bg-destructive/90"
                                                            disabled={approveVendorMutation.isPending}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* Approved Vendors Tab */}
                <TabsContent value="approved">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Approved Vendors</h2>
                        </div>

                        {approvedLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : approvedVendors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CheckCircle className="w-12 h-12 text-muted-foreground/40 mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    No Approved Vendors
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Approved vendors will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Vendor Name
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Store
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Approved Date
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {approvedVendors.map((vendor: Vendor) => (
                                            <tr
                                                key={vendor.id}
                                                className="border-b border-border hover:bg-muted/50 transition"
                                            >
                                                <td className="py-3 px-4 font-medium text-foreground">
                                                    {vendor.name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {vendor.store_name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {vendor.email}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {new Date(vendor.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Button size="sm" variant="outline">
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
