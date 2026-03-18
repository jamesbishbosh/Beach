## Database & Migrations

This project uses Supabase with the Supabase CLI for database management.

**Never use DATABASE_URL or any ORM migration tool (Drizzle, Prisma etc).**

When making schema changes:
1. Create a new migration file in `supabase/migrations/` following the naming pattern `<timestamp>_description.sql` — use the current date and time for the timestamp e.g. `20260318120000_add_user_column.sql`
2. Write the SQL using standard PostgreSQL syntax
3. Use `IF NOT EXISTS` and `IF EXISTS` guards wherever possible to make migrations safe to run multiple times
4. Remind the user to run `supabase db push` when done to apply the migration to the database

Do not push to Git or run any Git commands related to migrations — the user handles all Git workflow including branches and PRs.

## TODO
- When staging database is created, add staging and production refs here
