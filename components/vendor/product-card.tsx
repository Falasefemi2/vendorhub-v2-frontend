"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useDeleteProduct } from "@/utils/api/store/product";
import { ProductResponse } from "@/utils/api/store/product/types";

interface ProductCardProps {
  product: ProductResponse;
  onEdit: () => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(product.id);
    setShowDeleteAlert(false);
  };

  const images = (product?.images ?? []).map((img: any) => img?.imageUrl || img?.image_url || img?.imageURL).filter(Boolean) as string[];
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (imgIndex >= images.length) setImgIndex(0);
  }, [images.length, imgIndex]);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Header with image and status */}
        <div className="relative">
          {images.length > 0 ? (
            <div className="h-40 w-full bg-muted/10 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[imgIndex]} alt={`${product.name}-${imgIndex}`} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-40 w-full bg-muted/10 flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <div className="p-6 pb-4 border-b border-border">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground flex-1 line-clamp-2">
                {product.name}
              </h3>
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              ₦
              {product.price.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 pb-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Footer with actions */}
        <div className="p-6 pt-4 border-t border-border flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-transparent"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent" asChild>
            <Link href={`/vendor/product/${product.id}/images`}>Upload Image</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
            onClick={() => setShowDeleteAlert(true)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{product.name}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
