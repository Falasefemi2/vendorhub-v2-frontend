"use client"

import { useParams } from "next/navigation"
import { Loader2, Mail, MessageCircle, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGetStoreBySlug } from "@/utils/api/store/store"
import type { ProductResponse } from "@/utils/api/store/product/types"

function ProductImageCarousel({ images, alt, className }: { images: string[]; alt?: string; className?: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= images.length) setIndex(0)
  }, [images.length, index])

  if (!images || images.length === 0) {
    return (
      <div
        className={`${className ?? "w-20 h-20"} bg-muted/10 rounded overflow-hidden flex items-center justify-center text-muted-foreground text-xs`}
      >
        No image
      </div>
    )
  }

  return (
    <div className={`${className ?? "w-20 h-20"} bg-muted/10 rounded overflow-hidden relative`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index] || "/placeholder.svg"}
        alt={alt ?? "product image"}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="bg-black/40 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="bg-black/40 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const { data, isLoading, error } = useGetStoreBySlug(slug)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const store = data && "store" in data ? data.store : data
  const products: ProductResponse[] = data && "products" in data ? data.products : []

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const generateWhatsAppMessage = () => {
    if (selectedProducts.length === 0) return ""

    const selectedProductsList = products.filter((p) => selectedProducts.includes(p.id))

    let message = "Hello! I'm interested in the following products:\n\n"
    selectedProductsList.forEach((p) => {
      message += `📦 ${p.name}\n💰 ₦${p.price.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}\n`
    })

    const total = selectedProductsList.reduce((sum, p) => sum + p.price, 0)
    message += `\n💵 Total: ₦${total.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}\n\nPlease let me know the details.`

    return encodeURIComponent(message)
  }

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
                <div className="flex items-center gap-2 mb-4"></div>
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={selectedProducts.length === 0}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                    {selectedProducts.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedProducts.length}
                      </Badge>
                    )}
                  </Button>

                  {/* Product Selection Dialog */}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Selected Products</DialogTitle>
                      <DialogDescription>
                        You have selected {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {products
                        .filter((p) => selectedProducts.includes(p.id))
                        .map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{p.name}</h4>
                              <p className="text-sm text-muted-foreground">{p.description}</p>
                              <p className="text-primary font-bold mt-1">
                                ₦
                                {p.price.toLocaleString("en-NG", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleProductSelection(p.id)}
                              className="ml-2"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          </div>
                        ))}
                    </div>

                    {selectedProducts.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Total Amount:</p>
                        <p className="text-xl font-bold text-primary">
                          ₦
                          {products
                            .filter((p) => selectedProducts.includes(p.id))
                            .reduce((sum, p) => sum + p.price, 0)
                            .toLocaleString("en-NG", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </p>
                      </div>
                    )}

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button asChild onClick={() => setIsDialogOpen(false)}>
                        <a
                          href={`https://wa.me/${store?.whatsapp_number}?text=${generateWhatsAppMessage()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Send on WhatsApp
                        </a>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
              {products.map((p) => {
                const isSelected = selectedProducts.includes(p.id)
                return (
                  <div
                    key={p.id}
                    className={`border rounded-md p-4 cursor-pointer transition-all ${isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => toggleProductSelection(p.id)}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 relative">
                        {(() => {
                          const images = (((p as any)?.images ?? []) as any[])
                            .map((img) => img?.imageUrl || img?.image_url || img?.imageURL)
                            .filter(Boolean) as string[]

                          return <ProductImageCarousel images={images} alt={p.name} className="w-32 h-32" />
                        })()}
                        <div className="absolute top-1 right-1 w-6 h-6 rounded border-2 border-primary bg-white flex items-center justify-center">
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{p.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                        <p className="text-primary font-bold">
                          ₦{p.price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
