// Preloaded (via `tsx --require`) before any script that opens Payload against
// a real database — `pnpm seed`, `pnpm export:content`.
//
// In a non-production NODE_ENV the Postgres adapter auto-pushes schema diffs to
// the DB on init, which would silently mutate the schema and bypass the
// migration record. Forcing production mode here disables that push so
// migrations remain the single source of schema truth; these scripts only ever
// read/write rows.
//
// tsx resolves the tsconfig `paths` aliases (`@/*`, `@payload-config`) natively,
// so no module-resolution shim is required here.
process.env.NODE_ENV = "production";
