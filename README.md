## Revelation Auto Detailing — Marketing Site + Lead Capture

Mobile-first marketing website built with **Next.js App Router**, **Tailwind CSS**, and **TypeScript**.

### Features (Phase 1)
- **Homepage**: hero + trust bar + packages teaser + gallery + Google Reviews + CTA
- **Packages**: tiered packages + modular booking (Calendly-ready) + lead capture form
- **Gallery**: images sourced from `public/gallery` with lightbox + optional filtering
- **Contact/About**: story + service area + contact info + form
- **Lead capture**: saves to **Supabase**, emails via **Resend**, captures **UTM** params
- **Admin dashboard**: `/admin` (password protected) with status pipeline + inline updates

### Local development
Run:

```bash
./pnpm dev
```

Open `http://localhost:3000`.

### Environment variables
Copy `.env.example` → `.env.local` and fill in values.

### Supabase setup
Create a table named `leads` with this SQL:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'New',

  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,

  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year text not null,
  package_id text not null,
  preferred_date text not null,
  referral_source text not null,
  message text,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  landing_path text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
```

Notes:
- The API uses the **service role key** (server-only) to insert and read leads for `/admin`.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

### Admin auth
- Set `ADMIN_PASSWORD` and a random `ADMIN_TOKEN`.
- Generate a token example:

```bash
openssl rand -hex 32
```

### Google Reviews (optional)
Set:
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

Reviews are cached and revalidated every 24 hours.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
