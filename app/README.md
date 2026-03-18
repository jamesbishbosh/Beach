# Beach Events — Internal App

Internal dashboard for the Beach Events team at [app.beach-events.co.uk](https://app.beach-events.co.uk).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth + database, shared project with marketing site)
- Railway (hosting)

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
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this app |

## Supabase Setup

Run the migration to create the `allowed_users` table:

```bash
supabase db push
```

Or run the SQL manually from `supabase/migrations/20260318190000_create_allowed_users.sql`.

### OTP Email Template

Configure the OTP email template in Supabase Dashboard:
**Auth > Email Templates > Magic Link / OTP**

## Railway Deployment

1. Connect the repo to Railway
2. Set all env vars in Railway dashboard
3. Set custom domain to `app.beach-events.co.uk`

### DNS Setup (123-reg)

Add a CNAME record for `app.beach-events.co.uk`:

1. Log in to [123-reg.co.uk](https://www.123-reg.co.uk)
2. Go to **Control Panel > Domain Names > beach-events.co.uk > Manage DNS**
3. Add a CNAME record:
   - **Host**: `app`
   - **Type**: `CNAME`
   - **Value**: your Railway-provided domain (e.g. `your-app.up.railway.app`)
4. In Railway, add `app.beach-events.co.uk` as a custom domain
5. Wait for DNS propagation and SSL provisioning

## Notes

- Internal tool only — no public signup
- Auth is OTP-only via Supabase email
- Only users in the `allowed_users` table can access the dashboard
- `contacts` table (from marketing site) will be wired into Enquiries in a future sprint
