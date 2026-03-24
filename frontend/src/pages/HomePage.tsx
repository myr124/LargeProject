import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Dashboard" },
    { label: "Projects" },
    { label: "Team" },
    { label: "Settings" },
];

const features = [
    { title: "Fast", description: "Optimized for speed at every layer." },
    { title: "Secure", description: "Built-in auth and end-to-end encryption." },
    { title: "Scalable", description: "Grows with your team from day one." },
];

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Nav */}
            <header className="border-b">
                <div className="px-6 h-16 flex items-center justify-between">
                    <span className="text-lg font-bold">Acme</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Log in</Button>
                        <Button size="sm">Sign up</Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-56 border-r flex flex-col px-3 py-4 gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className="text-sm text-left px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col">
                    {/* Hero */}
                    <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
                        <h1 className="text-5xl font-bold tracking-tight max-w-xl">
                            Build faster. Ship with confidence.
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md">
                            The platform modern teams use to collaborate, automate, and deploy.
                        </p>
                        <div className="flex gap-3">
                            <Button size="lg">Get started</Button>
                            <Button size="lg" variant="outline">Learn more</Button>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="border-t py-16 px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((f) => (
                                <div key={f.title} className="space-y-2">
                                    <h3 className="font-semibold">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
