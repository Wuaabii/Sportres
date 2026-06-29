
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Storage

Image uploads use Supabase Storage from the server. Set these environment variables on local, Render, and Vercel:

- `SUPABASE_URL`, for example `https://your-project-ref.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`, copied from Supabase Project Settings > API. Keep this server-side only; do not prefix it with `VITE_`.
- `SUPABASE_STORAGE_BUCKET` optional, defaults to `media`

Create a public Supabase Storage bucket named `media`. The server uploads images into folders inside that bucket, such as `avatars`, `owner-covers`, and `courts`, and stores only the public image URL in PostgreSQL. If `SUPABASE_URL` is omitted, the backend tries to infer it from a Supabase `DATABASE_URL`, but `SUPABASE_SERVICE_ROLE_KEY` must be provided explicitly.
