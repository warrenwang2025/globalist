import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4">
      <div className="text-center space-y-6 p-4 md:p-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
          Welcome to Globalist Media Suite
        </h1>
        <p className="mx-auto max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl">
          Globalist Media Suite is our flagship modular software platform for
          storytellers, media teams, and syndication partners.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}