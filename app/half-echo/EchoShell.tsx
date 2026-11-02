import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./echo.module.css";

export default function EchoShell({ active, children }: { active: "music" | "anna" | "plans"; children: ReactNode }) {
  return <div className={styles.world}>
    <a className={styles.skip} href="#echo-content">Skip to content</a>
    <header className={styles.nav}>
      <Link className={styles.wordmark} href="/anna" aria-label="Anna Bot home">ANNA BOT</Link>
      <nav className={styles.navLinks} aria-label="Anna Bot navigation">
        <Link href="/anna" className={active === "anna" ? styles.active : undefined} aria-current={active === "anna" ? "page" : undefined}>Meet Anna</Link>
        <Link href="/anna#features">Features</Link>
        <Link href="/anna/half-echo" className={active === "music" ? styles.active : undefined} aria-current={active === "music" ? "page" : undefined}>Half Echo</Link>
        <Link href="/anna/plans" className={active === "plans" ? styles.active : undefined} aria-current={active === "plans" ? "page" : undefined}>Plans</Link>
      </nav>
    </header>
    <main id="echo-content">{children}</main>
    <footer className={styles.footer}><span>Anna Bot · Companion software by HamTron</span><Link href="/">HamTron home ↗</Link><Link href="/anna/half-echo">Half Echo music</Link><Link href="/anna#development">Development</Link></footer>
  </div>;
}
