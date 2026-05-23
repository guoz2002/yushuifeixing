This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Sentry

Sentry has been configured with `@sentry/nextjs`.

1. Optional: override DSN with environment variable:

```bash
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
```

2. Optional: configure source map upload token in CI:

```bash
SENTRY_AUTH_TOKEN=your_token_here
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=your_project_slug
```

3. Run development server:

```bash
npm run dev
```

4. Verify in browser at [http://localhost:3000/sentry-example-page](http://localhost:3000/sentry-example-page) and click `Trigger Test Error`.
5. Or trigger a server-side test error by visiting [http://localhost:3000/api/sentry-test](http://localhost:3000/api/sentry-test).

If you see `403` with `event submission rejected with_reason: ProjectId`, your DSN ingest region is likely wrong. Use the project DSN from Sentry settings and ensure the host region matches (for this project it is `ingest.us.sentry.io`).
