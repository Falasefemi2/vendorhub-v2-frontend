"use client"

import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, Eye, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/vendor/product-card"
import { useGetMyProducts } from "@/utils/api/store/product"
import { EditProductModal } from "@/components/vendor/edit-product"
import { StoreSlugCopy } from "@/components/vendor/store-slug-copy"
import { useState } from "react"

function DashboardContent() {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
    const { data: products = [], isLoading, error } = useGetMyProducts()

    const stats = [
        {
            label: "Total Products",
            value: products.length,
            change: "+2",
            icon: Package,
            trend: "up",
        },
        {
            label: "Active Products",
            value: products.filter((p) => p.is_active).length,
            change: "+1",
            icon: Eye,
            trend: "up",
        },
        {
            label: "Average Price",
            value: `₦${(products.reduce((sum, p) => sum + p.price, 0) / (products.length || 1)).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "0%",
            icon: DollarSign,
            trend: "neutral",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Manage your products and store performance</p>
            </div>

            <StoreSlugCopy />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <Card key={idx} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-sm text-green-600 font-semibold">{stat.change}</span>
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </Card>
                    )
                })}
            </div>

            {/* Products Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Your Products</h2>
                        <p className="text-muted-foreground mt-1">
                            {products.length} product{products.length !== 1 ? "s" : ""} in your store
                        </p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/vendor/product/new">
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <Card className="p-12 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Loading products...</p>
                        </div>
                    </Card>
                ) : error ? (
                    <Card className="p-6 border-destructive/50 bg-destructive/5">
                        <p className="text-destructive font-medium">Failed to load products</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {error instanceof Error ? error.message : "An error occurred"}
                        </p>
                    </Card>
                ) : products.length === 0 ? (
                    <Card className="p-12 text-center space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-muted rounded-full">
                                <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                        </div>
                        <p className="text-muted-foreground text-lg font-medium">No products yet</p>
                        <p className="text-muted-foreground text-sm mb-4">Start by creating your first product to get started</p>
                        <Button asChild>
                            <Link href="/vendor/product/new">Create First Product</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} onEdit={() => setSelectedProductId(product.id)} />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal - Only render when a product is selected */}
            {selectedProductId && (
                <EditProductModal
                    productId={selectedProductId}
                    isOpen={!!selectedProductId}
                    onClose={() => setSelectedProductId(null)}
                />
            )}
        </div>
    )
}

export default function VendorDashboard() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
