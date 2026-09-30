# Deploy to Netlify

1. Push this folder to a private or public Git repository.
2. In Netlify, import the repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Add the three variables from `.env.example` under Site configuration → Environment variables.
6. Deploy and test `/`, `/admin/login`, the contact form and a direct route refresh.

`public/_redirects` already contains the SPA fallback required by React Router. No production deployment or database mutation is performed by this delivery.

## Formspree test

Use the existing Formspree endpoint, submit a real test from the deployed contact form, verify the success message, confirm receipt in the destination inbox, and confirm the same entry in Admin → Messages / Inbox.
