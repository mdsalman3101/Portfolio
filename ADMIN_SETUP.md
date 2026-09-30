# Admin setup

Follow these steps once. No admin password belongs in source code.

## 1. Create Supabase project

Create a project at Supabase, save your database password privately, and wait for provisioning to finish.

## 2. Install the database schema

Open **SQL Editor → New query**, paste all of `supabase/schema.sql`, and click **Run**. This creates the CMS tables, row-level-security rules, admin check, and Storage policies.

If the `portfolio-media` bucket was not created automatically, open **Storage → New bucket**, name it exactly `portfolio-media`, and make it public. Do not create a service key for the website.

## 3. Create the Auth user

Open **Authentication → Users → Add user**. Enter the email and a strong password, and create the user. This password remains in Supabase Auth only.

Copy the user's UUID from the Users table. In SQL Editor, run:

```sql
insert into public.admin_users(user_id)
values ('PASTE-THE-AUTH-USER-UUID-HERE');
```

## 4. Add frontend variables

Open **Project Settings → API**. Copy the Project URL and public anon key. Copy `.env.example` to `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

The anon key is intended for browser use and is protected by RLS. Never paste the service-role key here.

## 5. Add starter data (optional)

Run `supabase/seed.sql` in SQL Editor. You can instead create all content from the dashboard. Existing local certificates remain available as a fallback until database records are published.

## 6. Sign in

Restart the development server, visit `http://localhost:5173/admin/login`, and use the Auth email/password. The dashboard verifies membership in `admin_users` after authentication.

## 7. Deploy later

Add the same two environment variables to Netlify or Vercel. Never upload `.env.local` or commit it to GitHub.
