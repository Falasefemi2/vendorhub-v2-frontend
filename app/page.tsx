import Link from "next/link";
import Navbar from "@/components/public/navbar";
import Footer from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, ShieldCheck, TrendingUp } from "lucide-react";
import { AllStoresSection } from "@/components/public/all-stores-sections";
import { FeaturedStores } from "@/components/public/featured-stores";

export default function Home() {
    return (
        <>
            <Navbar />

            <main>
                <section className="bg-linear-to-b from-primary/10 to-transparent py-20 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                                Discover Quality Products from Trusted Vendors
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Browse thousands of products from verified sellers. Shop with confidence and support independent
                                businesses.
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Button size="lg" asChild>
                                    <Link href="/stores">
                                        Explore Stores <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="#categories">View Categories</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Stores</h2>
                            <p className="text-muted-foreground">Handpicked sellers with excellent ratings</p>
                        </div>
                        <Link href="/stores" className="text-primary hover:text-primary/80 flex items-center gap-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <FeaturedStores />
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-muted/30 rounded-lg">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-2">All Stores</h2>
                        <p className="text-muted-foreground">Browse all available stores and discover products</p>
                    </div>

                    <AllStoresSection />
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose VendorHub?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Verified Vendors",
                                description: "All sellers are verified and reviewed by our community.",
                            },
                            {
                                icon: TrendingUp,
                                title: "Growing Marketplace",
                                description: "Discover new products and sellers every day.",
                            },
                            {
                                icon: Star,
                                title: "Top Rated",
                                description: "Shop from the most trusted sellers with proven ratings.",
                            },
                        ].map((feature, idx) => {
                            const Icon = feature.icon
                            return (
                                <Card key={idx} className="p-6">
                                    <Icon className="w-10 h-10 text-primary mb-4" />
                                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </Card>
                            )
                        })}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
