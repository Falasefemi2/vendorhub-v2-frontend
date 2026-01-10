"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { Star, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetStores, useSearchStores } from "@/utils/api/store/store"

function StoresContent() {
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState("")

    const { data: stores = [], isLoading: loadingStores } = useGetStores(page, 12)
    const { data: searchResults = [], isLoading: loadingSearch } = useSearchStores(query)

    const isSearching = query.trim().length > 0
    const isLoading = isSearching ? loadingSearch : loadingStores
    const list = isSearching ? searchResults : stores

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">All Stores</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Browse our collection of trusted vendors and discover quality products
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search stores..."
                            className="pl-10"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stores Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden animate-pulse">
                                <div className="h-40 bg-muted" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                    <div className="h-8 bg-muted rounded mt-4" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : list.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-muted-foreground text-lg">No stores found</p>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {list.map((store) => (
                                <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="h-40 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white uppercase text-center px-3 word-break-word">
                                            {store.name}
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="sr-only">{store.name}</h3>
                                        <h4 className="font-medium text-sm mb-2 text-muted-foreground">{store.slug}</h4>
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

                        {/* Pagination */}
                        {!isSearching && (
                            <div className="flex gap-4 justify-center mt-12">
                                <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" onClick={() => setPage(page + 1)} disabled={stores.length < 12}>
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default function StoresPage() {
    return (
        <Suspense fallback={null}>
            <StoresContent />
        </Suspense>
    )
}
