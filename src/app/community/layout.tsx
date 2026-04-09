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
