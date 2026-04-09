"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../community.module.css";
import { subscribe } from "./actions";

export default function JoinPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await subscribe(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push("/community/success");
  }

  return (
    <>
      <h1 className={styles.heading}>Join the BoringAlgos Community</h1>
      <p className={styles.subheading}>
        Get access to our FREE algo trading library, prop firm and trading guides, as well as early access to all our tools.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="FNAME"
            className={styles.input}
            placeholder="Name"
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

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <button type="submit" className={styles.button} disabled={submitting}>
          {submitting ? "Joining..." : "Join the Community"}
        </button>
      </form>
    </>
  );
}
