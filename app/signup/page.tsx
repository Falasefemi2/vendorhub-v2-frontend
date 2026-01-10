"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/public/navbar";
import Footer from "@/components/public/footer";
import { z } from "zod";
import { useSignUp } from "@/utils/api/store/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/public/phone-input";

export const signupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  whatsappNumber: z
    .string()
    .min(10, "WhatsApp number must be at least 10 digits"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  storename: z.string().min(2, "Store name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be at most 160 characters"),
});

export default function SignupPage() {
  const { mutate: signup, isPending, isError } = useSignUp();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      whatsappNumber: "",
      password: "",
      storename: "",
      bio: "",
    },
  });

  function onSubmit(data: z.infer<typeof signupFormSchema>) {
    const payload = {
      ...data,
      store_name: data.storename,
      whatsapp_number: data.whatsappNumber,
    } as any;

    // remove the original keys so backend receives only snake_case versions
    delete payload.storename;
    delete payload.whatsappNumber;

    signup(payload, {
      onSuccess: (response) => {
        const storeName = response?.user?.storename || data.storename;
        toast.success(
          `Welcome aboard, ${response.user.name}! Your store "${storeName}" has been created successfully.`,
          {
            description:
              "Your store will be reviewed before going live. This typically takes 24-48 hours.",
          },
        );
        form.reset();
      },
      onError: (error) => {
        toast.error("Signup failed", {
          description: error?.message || "Please check your details and try again.",
        });
      },
    });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Create Your Vendor Account
            </h1>
            <p className="text-muted-foreground">
              Join VendorHub and start selling
            </p>
          </div>
          <Card className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe123"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public store username
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter your phone number"
                          defaultCountry="NG"
                          value={field.value}
                          onChange={field.onChange}
                          international
                        />
                      </FormControl>
                      <FormDescription>
                        Buyers will use this to reach you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormDescription>At least 6 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My Awesome Store"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell customers about your store..."
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormDescription>5-500 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gap--2"
                >
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have a vendor account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
