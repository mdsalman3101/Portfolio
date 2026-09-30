# Admin guide

## First-time access

1. Create an email/password user in Supabase Authentication.
2. Copy that user UUID.
3. Run `insert into public.admin_users(user_id) values ('YOUR-USER-UUID');` in the Supabase SQL Editor.
4. Visit `/admin/login` and sign in.

## Modules

- Dashboard: project, unread-message and certificate totals.
- Projects: add/edit/publish/feature project copy and links.
- Project Media: upload covers, screenshots and demo videos.
- Messages / Inbox: read, reply by email, mark read or delete.
- Skills and Journey: publish and reorder honest portfolio content.
- Certificates: manage metadata; upload PDFs/thumbnails in Project Media.
- Resume: upload a new current PDF without code changes.
- Hero, About, Social Links and Site Settings: edit structured JSON content.

Uploads reset only after a successful operation. Failed uploads retain the selected form and display the error.

## Test checklist

Sign in, create a draft project, edit it, publish it, upload one screenshot, confirm it appears publicly, then delete the test record. Upload a resume PDF and confirm both View and Download actions work. Submit the public contact form and confirm the email arrives and the message appears in the inbox.
