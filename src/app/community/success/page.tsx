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
