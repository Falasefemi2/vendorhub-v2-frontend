import VendorSidebar from "@/components/vendor/sidebar";

export default function VendorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen">
            <VendorSidebar />
            <main className="flex-1 md:ml-64 bg-background">
                <div className="p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
}
