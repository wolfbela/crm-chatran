import { db } from "@/lib/database";

export default async function HomePage() {
  let userCount = 0;

  try {
    const result = await db
      .selectFrom("users")
      .select((db) => db.fn.count("id").as("count"))
      .executeTakeFirst();
    userCount = Number(result?.count) || 0;
  } catch (error) {
    console.error("Database connection error:", error);
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Welcome to WebApp
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Modern web application built with Next.js 15, TypeScript, Tailwind
          CSS, and PostgreSQL
        </p>

        <div className="bg-card rounded-lg border p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Database Status</h2>
          <p className="text-muted-foreground">
            Total users in database:{" "}
            <span className="font-bold text-primary">{userCount}</span>
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Next.js 15</h3>
            <p className="text-muted-foreground">
              Latest version with App Router and server components
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">PostgreSQL</h3>
            <p className="text-muted-foreground">
              Robust database with Kysely query builder
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">shadcn/ui</h3>
            <p className="text-muted-foreground">
              Beautiful components built with Radix UI and Tailwind
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
