import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">VendorHub</h3>
                        <p className="text-sm text-muted-foreground">
                            The trusted marketplace connecting vendors with customers
                            worldwide.
                        </p>
                    </div>

                    {/* Customer */}
                    <div>
                        <h4 className="font-semibold mb-4">For Customers</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/stores"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Browse Stores
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Sellers */}
                    <div>
                        <h4 className="font-semibold mb-4">For Sellers</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/signup"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Open a Store
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Seller Resources
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Fee Structure
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2026 VendorHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
