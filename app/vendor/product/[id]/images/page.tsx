"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProduct, useUploadProductImage } from "@/utils/api/store/product";
import { toast } from "sonner";

export default function ProductImagesPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading } = useGetProduct(productId);
    const { mutate: uploadImage, isPending } = useUploadProductImage();

    const [position, setPosition] = useState<number | string>(0);

    useEffect(() => {
        if (product && product.images) {
            setPosition(product.images.length);
        }
    }, [product]);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return toast.error("Please select an image to upload");

        uploadImage(
            { productId, image: file, position },
            {
                onSuccess: () => {
                    toast.success("Image uploaded");
                    setFile(null);
                    // After upload, go back to dashboard where the new image will show
                    router.push("/vendor/dashboard");
                },
                onError: () => {
                    toast.error("Failed to upload image");
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Product Images</h1>
                <Button variant="ghost" onClick={() => router.push("/vendor/product")}>Back</Button>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Product: {product?.name}</p>

                    <form onSubmit={handleUpload} className="flex items-center gap-4">
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-muted-foreground">Position</label>
                            <Input
                                type="number"
                                min={0}
                                value={position}
                                onChange={(e) => setPosition(parseInt(e.target.value, 10) || 0)}
                                className="w-24"
                            />
                        </div>
                        <Button type="submit" disabled={isPending || !file}>
                            {isPending ? "Uploading..." : "Upload Image"}
                        </Button>
                    </form>

                    {preview && (
                        <div className="pt-4">
                            <p className="text-sm text-muted-foreground">Preview</p>
                            <img src={preview} alt="preview" className="max-w-xs mt-2 rounded" />
                        </div>
                    )}

                    <div className="pt-6">
                        <h3 className="font-semibold">Existing Images</h3>
                        <div className="flex gap-4 mt-3 flex-wrap">
                            {product?.images?.length ? (
                                product.images.map((img: any) => (
                                    <div key={img.id} className="relative w-40 h-40 bg-muted/10 rounded overflow-hidden">
                                        <Image
                                            src={img.image_url || img.imageUrl}
                                            alt={`image-${img.id}`}
                                            fill
                                            sizes="(max-width: 768px) 100px, 160px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No images yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
