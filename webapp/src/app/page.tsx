import { db, testConnection } from "@/lib/database";

export default async function HomePage() {
  let userCount = 0;
  let connectionStatus = { success: false, message: "Not tested" };

  try {
    // Test database connection
    connectionStatus = await testConnection();

    if (connectionStatus.success) {
      const result = await db
        .selectFrom("users")
        .select((db) => db.fn.count("id").as("count"))
        .executeTakeFirst();
      userCount = Number(result?.count) || 0;
    }
  } catch (error) {
    connectionStatus = {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  const dbHost = process.env.POSTGRES_HOST || "localhost";
  const isVmDatabase = dbHost === "192.168.56.10";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Database Connection</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={`font-bold ${connectionStatus.success ? "text-green-600" : "text-red-600"}`}
                >
                  {connectionStatus.success ? "✅ Connected" : "❌ Failed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Host:</span>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {dbHost}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    isVmDatabase
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {isVmDatabase ? "🚀 VM Database" : "🏠 Local Database"}
                </span>
              </div>
              {!connectionStatus.success && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                  {connectionStatus.message}
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Database Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total users:</span>
                <span className="font-bold text-primary text-2xl">
                  {connectionStatus.success ? userCount : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database:</span>
                <span className="font-mono text-sm">webapp</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Port:</span>
                <span className="font-mono text-sm">5432</span>
              </div>
            </div>
          </div>
        </div>

        {isVmDatabase && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-lg">ℹ️</span>
              <h3 className="font-semibold text-blue-900">
                VM Database Active
              </h3>
            </div>
            <p className="text-blue-800 text-sm">
              This application is connected to a PostgreSQL database running on
              Vagrant VM (192.168.56.10). Perfect for development with isolated
              database environment!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Next.js 15</h3>
            <p className="text-muted-foreground">
              Latest version with App Router and server components
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">PostgreSQL + VM</h3>
            <p className="text-muted-foreground">
              {isVmDatabase
                ? "Database running on isolated Vagrant VM environment"
                : "Robust database with Kysely query builder"}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">shadcn/ui</h3>
            <p className="text-muted-foreground">
              Beautiful components built with Radix UI and Tailwind
            </p>
          </div>
        </div>

        {!connectionStatus.success && (
          <div className="mt-16 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">
              🚨 Database Connection Issues
            </h3>
            <div className="text-left space-y-2 text-sm text-red-800">
              <p>
                <strong>If using VM database:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Make sure Vagrant VM is running:{" "}
                  <code className="bg-red-100 px-1 rounded">make vm-up</code>
                </li>
                <li>
                  Check VM services status:{" "}
                  <code className="bg-red-100 px-1 rounded">
                    make vm-status
                  </code>
                </li>
                <li>
                  Verify database is accessible:{" "}
                  <code className="bg-red-100 px-1 rounded">
                    make vm-health
                  </code>
                </li>
              </ul>
              <p className="mt-3">
                <strong>Alternative:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Switch to local database:{" "}
                  <code className="bg-red-100 px-1 rounded">
                    make env-local && make up
                  </code>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
