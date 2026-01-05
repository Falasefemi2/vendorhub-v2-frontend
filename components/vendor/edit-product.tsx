import type React from "react";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, Copy, Check } from "lucide-react";
import { UpdateProductRequest } from "@/utils/api/store/product/types";
import { useGetProduct, useUpdateProduct } from "@/utils/api/store/product";

interface EditProductModalProps {
    productId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function EditProductModal({
    productId,
    isOpen,
    onClose,
}: EditProductModalProps) {
    // Fetch the product data
    const {
        data: product,
        isLoading: isLoadingProduct,
        error: fetchError,
    } = useGetProduct(productId);
    const {
        mutate: updateProduct,
        isPending: isUpdating,
        error: updateError,
    } = useUpdateProduct();

    // Form state
    const [formData, setFormData] = useState<UpdateProductRequest>({
        name: "",
        description: "",
        price: 0,
        is_active: true,
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [copied, setCopied] = useState(false);

    // Populate form when product data is loaded
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                is_active: product.is_active,
            });
            setHasChanges(false);
        }
    }, [product]);

    const handleInputChange = (field: keyof UpdateProductRequest, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setHasChanges(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name?.trim()) {
            return;
        }

        updateProduct(
            { id: productId, data: formData },
            {
                onSuccess: () => {
                    setHasChanges(false);
                    onClose();
                },
            },
        );
    };

    const handleCancel = () => {
        if (hasChanges) {
            const confirmed = window.confirm(
                "You have unsaved changes. Are you sure you want to close?",
            );
            if (!confirmed) return;
        }
        onClose();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Update your product information below
                    </DialogDescription>
                </DialogHeader>

                {/* Loading state - show spinner while fetching product */}
                {isLoadingProduct ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                            Loading product details...
                        </p>
                    </div>
                ) : fetchError ? (
                    /* Error state - show error message */
                    <div className="flex flex-col gap-3 py-8 px-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium text-destructive">
                                    Failed to load product
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {fetchError instanceof Error
                                        ? fetchError.message
                                        : "Unable to fetch product details"}
                                </p>
                            </div>
                        </div>
                        <Button onClick={onClose} variant="outline" className="w-full">
                            Close
                        </Button>
                    </div>
                ) : (
                    /* Form content - only show when product is loaded */
                    <div className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name || ""}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Enter product name"
                                    required
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description || ""}
                                    onChange={(e) =>
                                        handleInputChange("description", e.target.value)
                                    }
                                    placeholder="Enter product description"
                                    rows={4}
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₦) *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                        ₦
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price || 0}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "price",
                                                Number.parseFloat(e.target.value) || 0,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="pl-7"
                                        required
                                        disabled={isUpdating}
                                    />
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                <Label htmlFor="active" className="cursor-pointer">
                                    Active Status
                                </Label>
                                <Switch
                                    id="active"
                                    checked={formData.is_active ?? true}
                                    onCheckedChange={(checked) =>
                                        handleInputChange("is_active", checked)
                                    }
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Update Error */}
                            {updateError && (
                                <div className="flex gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm text-destructive">
                                            Update failed
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {updateError instanceof Error
                                                ? updateError.message
                                                : "Failed to update product"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleCancel}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isUpdating || !hasChanges || !formData.name?.trim()}
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

