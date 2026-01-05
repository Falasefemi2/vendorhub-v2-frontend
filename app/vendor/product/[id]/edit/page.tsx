"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useGetProduct, useUpdateProduct } from "@/utils/api/store/product";
import { toast } from "sonner";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading: isFetching } = useGetProduct(productId);
    const { mutate: updateProduct, isPending } = useUpdateProduct();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update form when product data is fetched
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
            });
        }
    }, [product]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }
        if (!formData.price || Number.parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        updateProduct(
            {
                id: productId,
                data: {
                    name: formData.name,
                    description: formData.description,
                    price: Number.parseFloat(formData.price),
                },
            },
            {
                onSuccess: () => {
                    toast.success("Product updated successfully");
                    router.push("/vendor/product");
                },
                onError: () => {
                    toast.error("Failed to update product");
                },
            },
        );
    };

    if (isFetching) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Loading product details...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/vendor/dashboard">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-bold text-foreground">Edit Product</h1>
                    <p className="text-muted-foreground">
                        Update your product information
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <Card className="lg:col-span-2 p-6 space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">
                                Product Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">
                                Description
                            </label>
                            <Textarea
                                name="description"
                                placeholder="Describe your product..."
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                className={`resize-none ${errors.description ? "border-destructive" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">
                                Price (₦)
                            </label>
                            <Input
                                type="number"
                                name="price"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className={errors.price ? "border-destructive" : ""}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive mt-1">{errors.price}</p>
                            )}
                        </div>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-foreground mb-4">Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Status:</span>
                                    <span
                                        className={`font-semibold ${product?.is_active ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {product?.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Price:</span>
                                    <span className="text-foreground font-semibold">
                                        ₦
                                        {parseFloat(formData.price || "0").toLocaleString("en-NG", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                {product?.created_at && (
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Created:</span>
                                        <span className="text-xs">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" disabled={isPending || isFetching}>
                                {isPending ? "Updating..." : "Update Product"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-transparent"
                                asChild
                            >
                                <Link href="/vendor/product">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
