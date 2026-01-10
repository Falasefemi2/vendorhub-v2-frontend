"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetStores } from "@/utils/api/store/store"

export function FeaturedStores() {
    const { data: stores = [], isLoading } = useGetStores(1, 3)

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="h-40 bg-muted" />
                        <div className="p-6 space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.slice(0, 3).map((store) => (
                <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-40 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white uppercase text-center px-4 wrap-break-word">
                            {store.name}
                        </h2>
                    </div>
                    <div className="p-6">
                        <h3 className="sr-only">{store.name}</h3>
                        <h4 className="font-medium text-sm mb-2 text-muted-foreground">{store.slug}</h4>
                        {/* <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">4.9 (240 reviews)</span>
                        </div> */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {store.bio || "Curated collection of handpicked products"}
                        </p>
                        <Button className="w-full" asChild>
                            <Link href={`/store/${store.slug}`}>Visit Store</Link>
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}
