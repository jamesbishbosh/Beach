# Beach Events — Holding Page

Marketing / holding page for [beach-events.co.uk](https://beach-events.co.uk).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (contacts table)
- Resend (email notifications)
- Vercel (hosting)

## Getting Started

```bash
cp .env.local.example .env.local
# Fill in the env vars
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | Resend API key |
| `NOTIFICATION_EMAILS` | Comma-separated list of notification recipients |
| `NEXT_PUBLIC_APP_URL` | URL for the main app (login link) |

## Supabase Setup

Run this SQL in the Supabase SQL editor:

```sql
create table contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text,
  project_type text,
  budget text,
  message text,
  source text default 'holding-page'
);

-- Enable RLS
alter table contacts enable row level security;

-- Insert-only policy for anon role
create policy "Allow anonymous inserts" on contacts
  for insert
  to anon
  with check (true);
```

## DNS Configuration (123-reg)

When ready to go live, update DNS on 123-reg to point `beach-events.co.uk` at Vercel:

1. Log in to [123-reg.co.uk](https://www.123-reg.co.uk)
2. Go to **Control Panel > Domain Names > beach-events.co.uk > Manage DNS**
3. Remove any existing A records for `@`
4. Add the following A record:
   - **Host**: `@`
   - **Type**: `A`
   - **Value**: `76.76.21.21` (Vercel's IP)
5. Add a CNAME for `www`:
   - **Host**: `www`
   - **Type**: `CNAME`
   - **Value**: `cname.vercel-dns.com`
6. In **Vercel > Project Settings > Domains**, add:
   - `beach-events.co.uk`
   - `www.beach-events.co.uk` (redirect to apex)
7. Wait for DNS propagation (up to 48 hours, usually minutes)
8. Vercel will auto-provision SSL once DNS resolves

**Note:** `app.beach-events.co.uk` is a separate codebase/deployment — do not configure it here.
