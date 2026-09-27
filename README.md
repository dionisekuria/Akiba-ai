# Akiba-ai

Akiba AI is a Kenyan AI-powered financial education and investment-planning platform for young Kenyans and first-time investors.

It helps people understand money, set saving goals, and plan with a simple, mobile-first experience. It is an educational and planning tool, not a bank, broker, exchange, or personal investment adviser.

## What Akiba AI does

- helps users create and track personal savings goals
- promotes financial literacy and practical planning habits
- keeps user plans private and stored in Supabase
- provides a clean Next.js product foundation for future AI-powered coaching and recommendations

## Project status

This project is a working Next.js + Supabase foundation for an educational financial planning product.

## Tech stack

- Next.js
- TypeScript
- React
- Supabase
- Tailwind CSS

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Copy the example values into a local `.env.local` file and replace them with your real project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not commit real secrets or service-role keys.

## License

MIT

