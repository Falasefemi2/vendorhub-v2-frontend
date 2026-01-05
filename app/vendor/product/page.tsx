"use client";

import { Suspense, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeleteProduct, useGetMyProducts } from "@/utils/api/store/product";

function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedProductName, setSelectedProductName] = useState("");
  const { data: products = [], isLoading } = useGetMyProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteClick = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId);
      setShowDeleteAlert(false);
      setSelectedProductId(null);
      setSelectedProductName("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your store's inventory</p>
        </div>
        <Button asChild>
          <Link href="/vendor/product/new" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No products found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-muted-foreground">
                    Product Name
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-muted-foreground">
                    Description
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-foreground">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="py-4 px-6 font-semibold text-primary">
                      ₦
                      {product.price.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          product.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2"
                          asChild
                        >
                          <Link href={`/vendor/product/${product.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() =>
                            handleDeleteClick(product.id, product.name)
                          }
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {!isLoading && filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button asChild>
            <Link href="/vendor/product/new">Create your first product</Link>
          </Button>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{selectedProductName}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

