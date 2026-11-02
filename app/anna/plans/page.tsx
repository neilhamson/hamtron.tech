import type { Metadata } from "next";
import Link from "next/link";
import EchoShell from "../../half-echo/EchoShell";
import styles from "../../half-echo/echo.module.css";

export const metadata: Metadata = {
  title: { absolute: "Anna Bot Plans | Companion & Half Echo Package" },
  description: "Explore the planned Anna Bot subscription and the complete Anna Bot plus Half Echo music package.",
  alternates: { canonical: "/anna/plans" },
};

export default function AnnaPlansPage() {
  return <EchoShell active="plans">
    <section className={styles.section} aria-labelledby="plans-title">
      <p className={styles.kicker}>Anna Bot / Subscription plans</p>
      <h1 className={styles.title} id="plans-title">Your companion.<br /><em>Your choice.</em></h1>
      <p className={styles.lead}>Choose Anna Bot on her own, or add the Half Echo music package. Companionship stays at the heart of both options.</p>
      <span className={styles.status}>Planned packages · Subscriptions not yet available</span>
      <div className={styles.actions}><Link className={styles.secondary} href="/anna">Meet Anna Bot →</Link><Link className={styles.secondary} href="/anna/half-echo">Explore Half Echo →</Link></div>
    </section>
    <section className={styles.section} aria-labelledby="compare-title">
      <h2 className={styles.heading} id="compare-title">Two ways to join Anna.</h2>
      <div className={styles.grid}>
        <article className={styles.card}><p className={styles.kicker}>The companion</p><h3>Anna Bot</h3><p>A standalone subscription for friendly, platonic companionship and thoughtful relationship conversations. The Half Echo music package is optional.</p></article>
        <article className={styles.card}><p className={styles.kicker}>The complete package</p><h3>Anna Bot + Half Echo</h3><p>The Anna Bot companion subscription together with the Half Echo music package, for listeners who want both experiences.</p></article>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.planTable}>
          <caption>Planned subscription inclusions</caption>
          <thead><tr><th scope="col">Experience</th><th scope="col">Anna Bot</th><th scope="col">Anna Bot + Half Echo</th></tr></thead>
          <tbody>
            <tr><th scope="row">Companion chat</th><td>Included</td><td>Included</td></tr>
            <tr><th scope="row">Platonic relationship conversation</th><td>Included</td><td>Included</td></tr>
            <tr><th scope="row">Anna’s knowledge of Half Echo</th><td>Included</td><td>Included</td></tr>
            <tr><th scope="row">Half Echo music subscription package</th><td>Not included</td><td>Included</td></tr>
          </tbody>
        </table>
      </div>
      <p>Knowing about Half Echo’s music is part of Anna’s repertoire. Access to the music subscription package is a separate choice. Public YouTube listening remains available through the official channel.</p>
      <p>Prices, music access details, subscription terms, and availability will be confirmed before subscriptions open. No payment or registration is taken on this page.</p>
    </section>
  </EchoShell>;
}
