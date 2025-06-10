import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to Globalist Media Suite
        </h1>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
          Globalist Media Suite is our flagship modular software platform for
          storytellers, media teams, and syndication partners.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
