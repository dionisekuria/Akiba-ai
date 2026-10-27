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

4. Configure Supabase Authentication URL settings:
   - Keep one Site URL, preferably the production app origin (for example, `https://<production-host>`).
   - Add each environment's callback URL under Redirect URLs: `http://localhost:3000/auth/confirm`, `https://<preview-host>/auth/confirm`, and `https://<production-host>/auth/confirm`. Replace the placeholders with the actual origins you use.
   - Under Authentication → Providers → Email, enable Email authentication and keep email confirmation enabled.

   Sign-up requests send confirmation links to the current app's `/auth/confirm` route. Supabase's built-in confirmation template returns a PKCE code, so that link must be opened in the same browser where sign-up began. If you later configure a verified sending domain and custom SMTP, you can optionally update the Confirm signup template to use the token-hash flow:

   ```text
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/
   ```

   Do not repeatedly resend links while waiting for delivery; the built-in sender may be delayed or rate-limited. Use an internal or staging account when testing, and click only the newest confirmation link.

5. Start the app:

   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000). The login page supports email/password sign-in and account creation. If email confirmation is enabled, new accounts must confirm their email before signing in.

### Authentication verification checklist

For a controlled end-to-end check, use a fresh account in a non-production Supabase project and one allowed app origin:

1. While signed out, open `/` and confirm it sends you to `/login`.
2. Create an account with an email address you control, then wait for the email and open the newest confirmation link in the same browser.
3. Confirm the callback returns to the dashboard with an active session. Sign out and sign in again with the password.
4. Create a goal, open its detail page, add a manually recorded contribution, and verify the amount and progress remain after signing out and back in.
5. Reuse an already-clicked confirmation link and confirm the app returns to `/login` with a safe notice.

Never share passwords, access tokens, service-role keys, or `.env.local` values when reporting a test problem.

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
