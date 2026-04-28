import Link from "next/link";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Buna ziua!</p>
        <Link href="/dashboard/invite" className={styles.inviteButton}>
          + Invita pacient
        </Link>
      </div>
    </div>
  );
}
