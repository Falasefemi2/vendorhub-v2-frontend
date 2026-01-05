"use client"

import { useParams } from "next/navigation"
import { Loader2, Mail, MessageCircle, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetStoreBySlug } from "@/utils/api/store/store"
import { ProductResponse } from "@/utils/api/store/product/types"

export default function StorePage() {
    const params = useParams()
    const slug = params.slug as string
    const { data, isLoading, error } = useGetStoreBySlug(slug)

    const store = data && "store" in data ? data.store : data
    const products: ProductResponse[] = data && "products" in data ? data.products : []

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading store...</p>
                </div>
            </main>
        )
    }

    if (error || !store) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-destructive font-medium mb-2">Store not found</p>
                    <p className="text-muted-foreground">The store you're looking for doesn't exist or has been removed.</p>
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Store Header */}
                <Card className="overflow-hidden mb-8">
                    <div className="h-48 bg-linear-to-br from-primary/20 to-secondary/20" />
                    <div className="p-8 relative -mt-16">
                        <div className="flex gap-6 mb-6">
                            <div className="w-32 h-32 rounded-lg bg-white border-4 border-background shadow-lg flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">{(store?.name || "").charAt(0)}</div>
                                </div>
                            </div>
                            <div className="flex-1 pt-8">
                                <h1 className="text-4xl font-bold text-foreground mb-2">{store?.name}</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                                        ))}
                                    </div>
                                    <span className="text-muted-foreground">4.9 (240 reviews)</span>
                                </div>
                                <Badge className="mb-4">{store?.username}</Badge>
                            </div>
                        </div>

                        {/* Store Info */}
                        <div className="space-y-4 mb-6">
                            {store?.bio && (
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">About</h3>
                                    <p className="text-muted-foreground">{store.bio}</p>
                                </div>
                            )}
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-3 flex-wrap">
                            {store?.email && (
                                <Button variant="outline" className="gap-2 bg-transparent" asChild>
                                    <a href={`mailto:${store.email}`}>
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </a>
                                </Button>
                            )}
                            {store?.whatsapp_number && (
                                <Button variant="outline" className="gap-2 bg-transparent" asChild>
                                    <a href={`https://wa.me/${store.whatsapp_number}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Products Section */}
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Products</h2>
                    {products.length === 0 ? (
                        <p className="text-muted-foreground">No products available for this store.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((p) => (
                                <div key={p.id} className="border border-border rounded-md p-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{p.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                                    <p className="text-primary font-bold">₦{p.price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </main>
    )
}
