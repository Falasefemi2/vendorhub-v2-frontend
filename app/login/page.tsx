"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/public/navbar";
import Footer from "@/components/public/footer";
import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/utils/api/store/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const loginFormSchema = z.object({
    email: z.email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

type loginFormSchemaType = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
    const { mutate: login, isPending } = useLogin();
    const router = useRouter();

    const form = useForm<loginFormSchemaType>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: loginFormSchemaType) {
        login(
            {
                ...data,
            },
            {
                onSuccess: (response) => {
                    toast.success(`Welcome back, ${response.user.name}!`, {
                        description:
                            "You have successfully logged in to your vendor account.",
                    });
                    form.reset();
                    if (response?.user?.role === "vendor") {
                        router.push("/vendor/dashboard");
                    } else {
                        router.push("/admin/dashboard");
                    }
                },
                onError: (error) => {
                    toast.error("Login failed", {
                        description:
                            error?.message || "Please check your details and try again.",
                    });
                },
            },
        );
    }
    const [userType, setUserType] = useState<"vendor" | "admin">("vendor");

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground">
                            Sign in to your vendor or admin account
                        </p>
                    </div>

                    <div className="flex gap-4 mb-8">
                        {(["vendor", "admin"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setUserType(type)}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${userType === type
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {type === "vendor" ? "Vendor" : "Admin"}
                            </button>
                        ))}
                    </div>

                    <Card className="p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="you@example.com"
                                                    type="email"
                                                    disabled={isPending}
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Password</FormLabel>
                                                <a
                                                    href="#"
                                                    className="text-xs text-primary hover:underline font-medium"
                                                >
                                                    Forgot password?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="••••••••"
                                                    type="password"
                                                    disabled={isPending}
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-11 font-semibold"
                                >
                                    {isPending ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </Form>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have a vendor account?{" "}
                        <Link
                            href="/signup"
                            className="text-primary hover:text-primary/80 font-semibold"
                        >
                            Sign up as vendor
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}

