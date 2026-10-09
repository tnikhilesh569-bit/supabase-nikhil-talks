# Nikhil Talks — Supabase edition

This version keeps the existing React/Vite design and components while replacing the old Firebase adapter with a clearly named Supabase adapter at `src/lib/supabase.ts`, using Supabase Auth and Postgres. It also loads shared posts, marketplace listings, and site settings from Supabase on startup and keeps a local cache for a smoother/offline fallback.

## Setup (beginner friendly)

1. Open the project folder in your editor.
2. Copy `.env.example` to a new file named `.env`.
3. In `.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Project URL and publishable/anon key from Supabase Dashboard → Project Settings → API Keys. Set `VITE_ADMIN_EMAIL` to the email you will use for admin login.
4. In Supabase Dashboard → SQL Editor, open `supabase-schema.sql`, paste the whole file, and run it.
5. In Supabase Dashboard → Authentication → Users, create your admin user with the same email and password you intend to use on the website.
6. In Authentication → Users, open that user and set the user's **app_metadata** to include `{ "role": "admin" }`. This must be app metadata, not user-editable user metadata. If the dashboard does not expose app metadata editing, use a trusted server/admin workflow; never put a service-role key in the frontend.
7. Install dependencies with `npm install`, then run `npm run dev`.
8. For deployment, add the same three `VITE_...` environment variables in your hosting provider and redeploy.

## File naming and Firebase cleanup

The backend adapter is now `src/lib/supabase.ts`. All application imports point to that file, and the source no longer imports Firebase SDK packages.

## Important migration notes

- This is a schema migration, not an automatic import of your old Firebase data. Existing Firebase posts/listings/settings must be exported and imported into the matching Supabase tables if you want to retain remote Firebase records.
- The existing sample/default content is retained as local fallback content. Local browser cache is not shared between visitors. Editing imported/default records requires the corresponding records to exist in Supabase first; export and import your real Firebase data before production use.
- Never put a Supabase `service_role` secret in `.env` variables beginning with `VITE_` or in browser code. Only use the publishable/anon key in the frontend.
- Admin access is deliberately no longer granted by hard-coded demo passwords or local-only sessions. Supabase Auth plus the `app_metadata.role = admin` RLS policies protect admin writes. Keep your admin email/password private.
- Public marketplace visitors can submit pending listings; only approved listings are visible publicly.
- Database row-level security policies are in `supabase-schema.sql`.

### Grant admin role with SQL (if needed)

After creating the admin account in Supabase Authentication → Users, run this in SQL Editor, replacing the email with your own:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where lower(email) = lower('your-admin-email@example.com');
```

Sign out and sign back in after changing the role so the refreshed access token contains the role claim.
