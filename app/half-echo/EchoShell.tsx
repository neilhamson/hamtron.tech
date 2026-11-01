import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./echo.module.css";

export default function EchoShell({ active, children }: { active: "music" | "anna"; children: ReactNode }) {
  return <div className={styles.world}>
    <a className={styles.skip} href="#echo-content">Skip to content</a>
    <header className={styles.nav}>
      <Link className={styles.wordmark} href="/half-echo" aria-label="Half Echo home">HALF ECHO</Link>
      <nav className={styles.navLinks} aria-label="Half Echo navigation">
        <Link href="/half-echo" className={active === "music" ? styles.active : undefined} aria-current={active === "music" ? "page" : undefined}>Music</Link>
        <Link href="/anna" className={active === "anna" ? styles.active : undefined} aria-current={active === "anna" ? "page" : undefined}>Meet Anna</Link>
        <a href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
      </nav>
    </header>
    <main id="echo-content">{children}</main>
    <footer className={styles.footer}><span>Half Echo · Music &amp; companionship</span><Link href="/">HAMTRON home ↗</Link><Link href="/anna#development">Anna development</Link></footer>
  </div>;
}
