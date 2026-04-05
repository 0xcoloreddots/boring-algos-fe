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
