# BoringAlgos Frontend — Vercel Site Setup

## Overview

Set up the BoringAlgos frontend as a Next.js project deployed on Vercel. The existing `propfolio.html` sales page is served as a static file. New community pages (`/community/join` and `/community/success`) are built as React components with a light theme.

## Routes

| Route | Behavior |
|---|---|
| `/` | Server-side redirect to `/propfolio` |
| `/propfolio` | Serves `public/propfolio.html` via Next.js rewrite |
| `/community/join` | Mailchimp signup form (name + email) |
| `/community/success` | Post-submission confirmation page |

## Project Structure

```
boring-algos-fe/
├── public/
│   └── propfolio.html          # existing sales page, served as static HTML
├── src/
│   └── app/
│       ├── layout.tsx           # root layout (fonts, metadata)
│       ├── page.tsx             # "/" redirect to /propfolio
│       # /propfolio is handled by next.config.ts rewrite to public/propfolio.html — no page.tsx needed
│       └── community/
│           ├── layout.tsx       # shared light-theme community layout
│           ├── join/
│           │   └── page.tsx     # Mailchimp signup form
│           └── success/
│               └── page.tsx     # confirmation page
├── next.config.ts
├── vercel.json
├── package.json
└── tsconfig.json
```

## Propfolio Page

- `propfolio.html` moves to `public/propfolio.html`
- `next.config.ts` adds a rewrite: `/propfolio` -> `/propfolio.html`
- No React wrapper, no iframe — served directly as static HTML
- No migration to React at this time

## Community Pages

### Design

- **Theme:** Light background (`#fafaf8` or similar warm white), dark text, gold accent (`#c9a84c`) for CTAs
- **Typography:** DM Serif Display (headings) + Montserrat (body) — same brand fonts as propfolio
- **Layout:** Minimal, vertically centered, max-width ~480px container

### `/community/join`

- BoringAlgos wordmark/logo at top (text-based, matching nav style from propfolio)
- Heading: "Join the BoringAlgos Community"
- Brief subheading copy
- Form fields: First Name (text input), Email (email input)
- Submit button: gold accent background, white text, uppercase
- Form submits directly to Mailchimp embedded form action URL
- Mailchimp redirects to `/community/success` on success
- Placeholders left for Mailchimp form action URL and hidden audience/list fields

### `/community/success`

- Same layout as join page
- Checkmark icon or similar visual confirmation
- Heading: "You're in." or similar
- Brief confirmation copy
- Optional CTA (link to propfolio or social channels)

### Shared Community Layout (`community/layout.tsx`)

- Light background
- Centered content container
- BoringAlgos text logo in a minimal top bar
- Consistent font loading via Next.js `next/font`
- No footer initially (keep it minimal)

## Mailchimp Integration

- Standard Mailchimp embedded form approach: HTML form with `action` pointing to Mailchimp's subscribe endpoint
- Hidden fields for audience ID and other Mailchimp params
- `action` URL and hidden field values left as clearly marked placeholders for the user to fill in
- No API-based integration — keeps it simple and avoids needing server-side secrets

## Vercel Configuration

- `next.config.ts` handles the `/propfolio` rewrite
- No special `vercel.json` needed beyond defaults — Next.js on Vercel works out of the box
- Framework preset: Next.js (auto-detected by Vercel)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- React 19
- Deployed on Vercel
- Mailchimp for CRM/forms (embedded form, not API)
