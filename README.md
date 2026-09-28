# Akiba AI

Akiba AI is a mobile-first financial education and personal planning app for people in Kenya. It helps people organise savings goals and learn at their own pace. It is not a bank, broker, payment service, or personalised investment adviser. It does not move money or execute investments.

## Requirements

- Node.js 20.9 or later
- npm
- A Supabase project for accounts and private, persistent planning data

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set the project URL and publishable key from your Supabase project. Do not use a service-role key in this app or expose one in a `NEXT_PUBLIC_` variable.

3. Apply the database migration to the Supabase project using the Supabase CLI:

   ```bash
   supabase link --project-ref your-project-id
   supabase db push
   ```

   The migration creates profiles, goals, manually recorded goal contributions, an account profile trigger, and owner-only Row Level Security policies.

4. In Supabase Authentication settings, set the site URL to your local app origin (normally `http://localhost:3000`) and add the local origin to the allowed redirect URLs.

5. Start the app:

   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000). The login page supports email/password sign-in and account creation. If email confirmation is enabled, new accounts must confirm their email before signing in.

## Dashboard modes

- In development, when Supabase is not configured, the dashboard shows a clearly labelled illustrative sample preview. Its figures are not real user balances or financial advice.
- In a production build without Supabase configuration, the app shows setup instructions rather than sample or fabricated personal data.
- With Supabase configured, users must sign in to see their own profile, goals, and manually noted goal contributions. Row Level Security enforces ownership at the database boundary.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```
