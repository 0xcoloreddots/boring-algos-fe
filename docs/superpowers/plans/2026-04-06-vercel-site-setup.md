# BoringAlgos Vercel Site Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up a Next.js project on Vercel serving the existing propfolio.html and new community signup pages.

**Architecture:** Next.js App Router with the existing propfolio.html served as a static file via rewrite. Community pages are React server components with a shared light-theme layout. Mailchimp integration via embedded HTML form (no API).

**Tech Stack:** Next.js 15, TypeScript, React 19, Vercel, Mailchimp embedded forms

---

### File Structure

```
boring-algos-fe/
├── public/
│   └── propfolio.html
├── src/
│   └── app/
│       ├── layout.tsx              # root layout — loads fonts, minimal global styles
│       ├── globals.css             # CSS reset + shared CSS variables
│       ├── page.tsx                # "/" — redirect to /propfolio
│       └── community/
│           ├── layout.tsx          # light-theme community layout (nav, centered container)
│           ├── community.module.css # styles for community layout and pages
│           ├── join/
│           │   └── page.tsx        # Mailchimp signup form
│           └── success/
│               └── page.tsx        # confirmation page
├── next.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Move: `propfolio.html` → `public/propfolio.html`

- [ ] **Step 1: Initialize Next.js with create-next-app**

```bash
cd /home/omelettes/code/boring-algos-fe
npx create-next-app@latest . --typescript --app --no-tailwind --no-eslint --no-src-dir --import-alias "@/*" --use-npm
```

Note: Since the directory already exists and has files, if create-next-app refuses, initialize manually:

```bash
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node
```

- [ ] **Step 2: Move propfolio.html to public/**

```bash
mv /home/omelettes/code/boring-algos-fe/propfolio.html /home/omelettes/code/boring-algos-fe/public/propfolio.html
```

- [ ] **Step 3: Write next.config.ts with propfolio rewrite**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/propfolio",
        destination: "/propfolio.html",
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Write root layout with font loading**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Montserrat } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BoringAlgos",
  description: "Boring trading. Verified results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Write globals.css**

```css
/* src/app/globals.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans), "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 6: Write root page with redirect**

```tsx
// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/propfolio");
}
```

- [ ] **Step 7: Write tsconfig.json**

If not auto-generated, create:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 8: Verify dev server starts and propfolio loads**

```bash
npm run dev
```

Visit `http://localhost:3000` — should redirect to `/propfolio`.
Visit `http://localhost:3000/propfolio` — should render the propfolio sales page.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts .gitignore src/ public/
git commit -m "feat: initialize Next.js project, serve propfolio.html via rewrite"
```

---

### Task 2: Community Layout (Light Theme)

**Files:**
- Create: `src/app/community/layout.tsx`, `src/app/community/community.module.css`

- [ ] **Step 1: Write community CSS module**

```css
/* src/app/community/community.module.css */
.layout {
  min-height: 100vh;
  background: #fafaf8;
  color: #1a1a18;
  display: flex;
  flex-direction: column;
}

.nav {
  padding: 20px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.logo {
  font-family: var(--font-serif), "DM Serif Display", serif;
  font-size: 18px;
  color: #1a1a18;
  text-decoration: none;
  letter-spacing: 0.02em;
}

.logoAccent {
  color: #c9a84c;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.container {
  width: 100%;
  max-width: 440px;
}

.heading {
  font-family: var(--font-serif), "DM Serif Display", serif;
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: #1a1a18;
  margin-bottom: 12px;
}

.subheading {
  font-size: 15px;
  color: #6b6b64;
  line-height: 1.7;
  margin-bottom: 32px;
}

.input {
  display: block;
  width: 100%;
  padding: 14px 16px;
  font-family: var(--font-sans), "Montserrat", sans-serif;
  font-size: 14px;
  color: #1a1a18;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #c9a84c;
}

.input::placeholder {
  color: #a0a098;
}

.inputGroup {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.button {
  display: block;
  width: 100%;
  padding: 14px 24px;
  font-family: var(--font-sans), "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: #c9a84c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  text-align: center;
  text-decoration: none;
}

.button:hover {
  opacity: 0.88;
}

.checkmark {
  width: 64px;
  height: 64px;
  background: rgba(201, 168, 76, 0.1);
  border: 2px solid #c9a84c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 24px;
}

.successText {
  font-size: 14px;
  color: #6b6b64;
  line-height: 1.75;
}
```

- [ ] **Step 2: Write community layout**

```tsx
// src/app/community/layout.tsx
import Link from "next/link";
import styles from "./community.module.css";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <Link href="/propfolio" className={styles.logo}>
          Boring<span className={styles.logoAccent}>Algos</span>
        </Link>
      </nav>
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/community/layout.tsx src/app/community/community.module.css
git commit -m "feat: add community layout with light theme"
```

---

### Task 3: Community Join Page

**Files:**
- Create: `src/app/community/join/page.tsx`

- [ ] **Step 1: Write the join page with Mailchimp form**

```tsx
// src/app/community/join/page.tsx
import type { Metadata } from "next";
import styles from "../community.module.css";

export const metadata: Metadata = {
  title: "Join the Community — BoringAlgos",
  description: "Join the BoringAlgos community.",
};

export default function JoinPage() {
  return (
    <>
      <h1 className={styles.heading}>Join the BoringAlgos Community</h1>
      <p className={styles.subheading}>
        Get updates, strategy insights, and early access to new tools.
      </p>

      {/*
        MAILCHIMP SETUP:
        1. Replace the `action` URL below with your Mailchimp form action URL.
           Find it in Mailchimp → Audience → Signup forms → Embedded forms.
           It looks like: https://XXXXX.us1.list-manage.com/subscribe/post?u=XXXXX&id=XXXXX
        2. The hidden input name for redirect is typically not needed if you
           configure the success URL in Mailchimp's form settings.
        3. Field names (FNAME, EMAIL) are Mailchimp merge tag defaults.
           Adjust if your audience uses different merge tags.
      */}
      <form
        action="MAILCHIMP_FORM_ACTION_URL"
        method="POST"
        noValidate
      >
        {/* Redirect to success page after submission */}
        <input type="hidden" name="REDIRECT" value="/community/success" />

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="FNAME"
            className={styles.input}
            placeholder="First name"
            required
          />
          <input
            type="email"
            name="EMAIL"
            className={styles.input}
            placeholder="Email address"
            required
          />
        </div>

        {/* Bot signup prevention */}
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input type="text" name="b_MAILCHIMP_U_VALUE_MAILCHIMP_ID_VALUE" tabIndex={-1} defaultValue="" />
        </div>

        <button type="submit" className={styles.button}>
          Join the Community
        </button>
      </form>
    </>
  );
}
```

- [ ] **Step 2: Verify join page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/community/join` — should show light-themed form with name and email fields.

- [ ] **Step 3: Commit**

```bash
git add src/app/community/join/page.tsx
git commit -m "feat: add community join page with Mailchimp form"
```

---

### Task 4: Community Success Page

**Files:**
- Create: `src/app/community/success/page.tsx`

- [ ] **Step 1: Write the success page**

```tsx
// src/app/community/success/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import styles from "../community.module.css";

export const metadata: Metadata = {
  title: "You're in — BoringAlgos",
  description: "Welcome to the BoringAlgos community.",
};

export default function SuccessPage() {
  return (
    <>
      <div className={styles.checkmark}>✓</div>
      <h1 className={styles.heading}>You're in.</h1>
      <p className={styles.successText}>
        Welcome to the BoringAlgos community. Check your inbox for a confirmation email.
      </p>
      <div style={{ marginTop: "32px" }}>
        <Link href="/propfolio" className={styles.button}>
          Learn About Propfolio →
        </Link>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify success page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/community/success` — should show checkmark, heading, and link.

- [ ] **Step 3: Commit**

```bash
git add src/app/community/success/page.tsx
git commit -m "feat: add community success page"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Build the project**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Test all routes**

```bash
npm run start
```

| Route | Expected |
|---|---|
| `http://localhost:3000` | Redirects to `/propfolio` |
| `http://localhost:3000/propfolio` | Renders propfolio sales page |
| `http://localhost:3000/community/join` | Light-themed signup form |
| `http://localhost:3000/community/success` | Confirmation page with checkmark |

- [ ] **Step 3: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix: address build issues"
```
