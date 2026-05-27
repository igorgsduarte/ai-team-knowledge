import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          The Workspace for Multi-Disciplinary Teams
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          TeamKnowledge is a shared workspace where engineers, designers, data scientists, and PMs document what they know and what they're learning. Fast, confident, and precise.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/sign-up" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Get started
          </Link>
          <Link href="/sign-in" className="text-sm font-semibold leading-6 text-foreground">
            Sign in <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
