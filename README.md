# MD Salman Professional Portfolio

React + Vite portfolio with a Supabase-backed CMS, real Lucky FX Studio client feature, accessible project case studies, resume management, Formspree email delivery and a private admin inbox.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and add the values listed below.
3. Run `npm install`, then `npm run dev`.
4. Open the local URL shown by Vite. Admin is at `/admin/login`.

## Environment variables

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/mrevnnae
```

`VITE_FORMSPREE_FORM_ID` may be used instead of the full endpoint. Never add a service-role key or Formspree API token to this frontend.

## Database

For a new Supabase project, run `supabase/schema.sql`, then `supabase/migrations/20260930_final_portfolio_upgrade.sql`. For an existing project that already used this portfolio, run only the migration. It is additive and preserves existing content.

See `ADMIN_GUIDE.md` and `DEPLOY_NETLIFY.md` for the complete handoff.
