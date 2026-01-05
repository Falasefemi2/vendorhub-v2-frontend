"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/utils/store/authstore"
import { useGetStoreById } from "@/utils/api/store/store"

export function StoreSlugCopy() {
    const [copied, setCopied] = useState(false)
    const { user } = useAuthStore() // Get current user
    const { data: store } = useGetStoreById(user?.id || "")

    const storeUrl = store ? `${typeof window !== "undefined" ? window.location.origin : ""}/store/${store.slug}` : ""

    const handleCopy = async () => {
        if (storeUrl) {
            await navigator.clipboard.writeText(storeUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (!store) return null

    return (
        <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-4">Share Your Store</h3>
            <div className="flex gap-2">
                <Input readOnly value={storeUrl} className="bg-background" />
                <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2 bg-transparent">
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Share this link with customers to view your store</p>
        </Card>
    )
}
