"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Bell, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useGetMyStore, useUpdateMyStore } from "@/utils/api/store/store";

const storeFormSchema = z.object({
  store_name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  email: z.string().email("Please enter a valid email address"),
  whatsapp_number: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(val),
      "Please enter a valid phone number"
    ),
  bio: z
    .string()
    .max(500, "Store description must be less than 500 characters")
    .optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

export default function SettingsPage() {
  const { data: responseData, isLoading: isStoreLoading } = useGetMyStore();
  const updateStoreMutation = useUpdateMyStore();

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      store_name: "",
      username: "",
      email: "",
      whatsapp_number: "",
      bio: "",
    },
  });


  useEffect(() => {
    if (responseData) {
      // Handle both direct StoreResponse and nested { store: StoreResponse } format
      const storeData = (responseData as any).store || responseData;

      form.reset({
        store_name: storeData.name || "",
        username: storeData.username || "",
        email: storeData.email || "",
        whatsapp_number: storeData.whatsapp_number || "",
        bio: storeData.bio || "",
      });
    }
  }, [responseData, form]);

  const onSubmit = async (values: StoreFormValues) => {
    try {
      await updateStoreMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to update store:", error);
    }
  };

  if (isStoreLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store and account settings
          </p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Loading your settings...</p>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store and account settings
        </p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Store Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card className="p-6 space-y-6">
            {/* Success Message */}
            {updateStoreMutation.isSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800 font-medium">
                  Store settings updated successfully!
                </p>
              </div>
            )}

            {/* Error Message */}
            {updateStoreMutation.isError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800 font-medium">
                  {updateStoreMutation.error instanceof Error
                    ? updateStoreMutation.error.message
                    : "Failed to update store settings"}
                </p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Store Name */}
                  <FormField
                    control={form.control}
                    name="store_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., TechGear Pro"
                            disabled={updateStoreMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., techgear_pro"
                            disabled={updateStoreMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="e.g., seller@techgear.com"
                            disabled={updateStoreMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* WhatsApp Number */}
                  <FormField
                    control={form.control}
                    name="whatsapp_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            disabled={updateStoreMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional. Include country code for international numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Store Description */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell customers about your store, what you offer, and why they should shop with you..."
                          className="resize-none"
                          rows={6}
                          disabled={updateStoreMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={updateStoreMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {updateStoreMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Change Password</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Current Password
                  </label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    New Password
                  </label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Confirm Password
                  </label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="w-full sm:w-auto">Update Password</Button>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-bold mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Notification Preferences</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "New Orders", enabled: true },
                  { label: "Order Status Updates", enabled: true },
                  { label: "Product Inquiries", enabled: true },
                  { label: "Store Reviews", enabled: false },
                  { label: "Marketing Emails", enabled: false },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.enabled}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
              <Button className="w-full sm:w-auto mt-4">
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
