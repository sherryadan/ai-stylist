This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Local style profile

Use Node.js 24 or later and install dependencies with `npm ci`. Start the local
prototype from PowerShell:

```powershell
$env:STYLIST_LOCAL_ACCOUNT = "1"
npm run dev -- --hostname 127.0.0.1
```

Open `http://127.0.0.1:3000/profile` and select **Open local test account**.
The shared test profile and session records are stored in the ignored
`.stylist-local.sqlite` file. Use sample information. This sign-in path requires
the opt-in environment setting and is available only in development mode.

To validate and import a demonstration CSV, set `STYLIST_LOCAL_ADMIN_TOKEN` to a
private value of at least 24 characters before starting the development server.
Sign in locally and open `/catalog-admin` to see the template. Imports update by
SKU. Use an empty stock size list to remove an imported item from matching.
Imported items are displayed as samples and have no external purchase URLs.

### Styling blueprint adapter

Curated templates rank outfits by default. To try a model service you run on
your own computer, set `STYLIST_BLUEPRINT_PORT` to its loopback HTTP port in
development. The service must accept `POST /blueprint` with JSON fields
`occasion`, `category`, and `dressCode`. Return an object such as
`{"preferredColors":["ivory","navy"]}` with up to four supported palette
colors. The supported values are ivory, olive, charcoal, cream, tan, black,
blue, white, sand, navy, and brown.

The adapter makes at most one attempt per stored request, times out after two
seconds, and reads up to 2 KiB. Invalid or unavailable responses fall back to
the curated template. The blueprint only affects ranking and has no authority
over catalog items, prices, budget, size or exclusions. The prototype does
not provide or activate a model service.

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
