import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">ZenTask</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          AI-powered Kanban project management for teams
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
