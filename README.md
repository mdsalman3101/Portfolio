# MD Salman — Portfolio & CMS

A production-ready React + Vite portfolio for MD Salman. The public experience uses the approved dark-chocolate, orange and transparent-glass visual system, responsive layouts, accessible interactions, a cinematic WeatherGPT reveal, and intentionally restrained motion. A protected Supabase dashboard manages published projects, project images/videos, certificates and selected site copy.

## Stack

- React 19, Vite and React Router
- Supabase Auth, PostgreSQL and Storage
- Framer Motion and React Icons
- Hand-authored responsive CSS

## Local installation

Install Node.js 20 or newer, then open a terminal in this folder:

```bash
npm install
npm run dev
```

Vite prints the local address. Open it in a browser. Useful commands:

- `npm run dev` — local development server
- `npm run build` — production build in `dist/`
- `npm run preview` — preview the built site
- `npm run lint` — code-quality check

The portfolio works immediately with verified local starter content. Without Supabase variables, `/admin/login` displays setup guidance instead of crashing.

## Connect Supabase

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Optionally run `supabase/seed.sql` for starter site copy and projects.
4. Confirm Storage contains the public `portfolio-media` bucket (the schema attempts to create it).
5. Copy `.env.example` to `.env.local`, then replace both example values:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never use a service-role key in this frontend. See `ADMIN_SETUP.md` for account setup.

## Using the admin dashboard

Visit `/admin/login`, sign in, and use these areas:

- **Projects:** create, edit, delete, publish/unpublish, feature and reorder projects.
- **Certificates:** create, edit, delete, publish/unpublish and reorder certificates.
- **Media:** upload a project cover, multiple screenshots, one or more videos, certificate PDFs and thumbnails; delete existing project media.
- **Site content:** update selected public content as JSON (`hero`, `about`, `contact`).

To add a project, create its text record first, then open Media and choose that project before uploading files. Published records appear publicly without rebuilding. To change the resume later, upload it to the bucket and add its URL to your preferred site-content record; the current site uses an availability CTA because no resume was supplied.

## Production build

```bash
npm install
npm run build
```

Upload the generated `dist/` folder only if your host uses manual deployment. Normally, connect the repository and let the host run the build.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
git push -u origin main
```

Do not commit `.env.local`; it is ignored.

## Netlify deployment from GitHub

1. Choose **Add new site → Import an existing project** and select the repository.
2. Build command: `npm run build`; publish directory: `dist`.
3. Add both `VITE_SUPABASE_*` variables under Site configuration → Environment variables.
4. Deploy. `public/_redirects` provides the SPA route fallback.

## Vercel deployment from GitHub

1. Import the repository and keep Framework Preset as Vite.
2. Build command: `npm run build`; output directory: `dist`.
3. Add both `VITE_SUPABASE_*` variables in Project Settings → Environment Variables.
4. Deploy. `vercel.json` provides the SPA route fallback.

## Troubleshooting

- **Admin says Supabase is not configured:** restart `npm run dev` after creating `.env.local`.
- **Valid user receives “not authorized”:** insert that Auth user's UUID into `public.admin_users`.
- **Upload fails:** verify the bucket name is exactly `portfolio-media`, the user is an admin, and schema policies were created.
- **Public data is missing:** confirm `published` is enabled and RLS policies exist.
- **A route returns 404 after deployment:** verify the host uses the included SPA rewrite configuration.
- **Build behavior differs locally:** use Node.js 20+ and run a clean `npm install`.

All supplied profile photographs and certificate PDFs are under `public/assets`. No credentials, service key or password is included.
