"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetStores } from "@/utils/api/store/store"

export function AllStoresSection() {
    const [page, setPage] = useState(1)
    const { data: stores = [], isLoading } = useGetStores(page, 12)

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="h-40 bg-muted" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stores.map((store) => (
                    <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="h-40 bg-linear-to-br from-primary/20 to-secondary/20" />
                        <div className="p-4">
                            <h3 className="font-bold text-base mb-2 line-clamp-1">{store.name}</h3>
                            {/* <div className="flex items-center gap-1 mb-3">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">4.9</span>
                            </div> */}
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{store.bio || "Quality products"}</p>
                            <Button size="sm" className="w-full bg-transparent" variant="outline" asChild>
                                <Link href={`/store/${store.slug}`}>View</Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={stores.length < 12}>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
