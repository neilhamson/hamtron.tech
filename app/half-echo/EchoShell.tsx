import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./echo.module.css";

export default function EchoShell({ active, children }: { active: "music" | "anna"; children: ReactNode }) {
  return <div className={styles.world}>
    <a className={styles.skip} href="#echo-content">Skip to content</a>
    <header className={styles.nav}>
      <Link className={styles.wordmark} href={active === "music" ? "/half-echo" : "/anna"} aria-label={active === "music" ? "Half Echo home" : "Anna Bot home"}>{active === "music" ? "HALF ECHO" : "ANNA BOT"}</Link>
      <nav className={styles.navLinks} aria-label="HAMTRON project navigation">
        <Link href="/half-echo" className={active === "music" ? styles.active : undefined} aria-current={active === "music" ? "page" : undefined}>Half Echo</Link>
        <Link href="/anna" className={active === "anna" ? styles.active : undefined} aria-current={active === "anna" ? "page" : undefined}>Anna Bot</Link>
        {active === "music" ? <a href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">YouTube ↗</a> : <a href="/anna#development">Development</a>}
      </nav>
    </header>
    <main id="echo-content">{children}</main>
    <footer className={styles.footer}><span>Half Echo &amp; Anna Bot · Separate HAMTRON projects</span><Link href="/">HAMTRON home ↗</Link><Link href="/anna#development">Anna Bot development</Link></footer>
  </div>;
}
