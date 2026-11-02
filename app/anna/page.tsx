import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EchoShell from "../half-echo/EchoShell";
import styles from "../half-echo/echo.module.css";

export const metadata: Metadata = {
  title: { absolute: "Anna by Half Echo | AI Companion in Development" },
  description: "Meet Anna by Half Echo: a friendly, platonic AI companion being developed around music, creativity, gaming, and everyday conversation.",
  alternates: { canonical: "/anna" },
  openGraph: { title: "Anna by Half Echo", description: "A friendly AI companion. In development.", url: "/anna", type: "website", images: [{ url: "/half-echo/anna-logo.png" }] },
};

export default function AnnaPage() {
  return <EchoShell active="anna">
    <section className={styles.hero} aria-labelledby="anna-title">
      <div><p className={styles.kicker}>Anna by Half Echo / AI companion</p><h1 className={styles.title} id="anna-title">Good company.<br /><em>Shared frequencies.</em></h1>
        <p className={styles.lead}>A companion to talk music with. A friendly voice for everyday life. Anna is being developed for thoughtful, open conversation with a personality rooted in the world of Half Echo.</p>
        <span className={styles.status}>In development · Chat not yet available</span>
        <div className={styles.actions}><a className={styles.button} href="#development">Follow the development ↓</a><Link className={styles.secondary} href="/half-echo">Explore the music →</Link></div>
      </div>
      <figure className={styles.portrait}><Image src="/half-echo/anna-logo.png" alt="Anna of Half Echo, with dark hair, gothic styling, and violet and blue lighting" width={600} height={596} sizes="(max-width: 760px) 100vw, 50vw" priority /><figcaption>ANNA / HALF ECHO</figcaption></figure>
    </section>
    <section className={styles.section} aria-labelledby="character-title"><p className={styles.kicker}>Her character</p><h2 className={styles.heading} id="character-title">Warm. Curious. Her own personality.</h2>
      <div className={styles.grid}>
        <article className={styles.card}><h3>A friend to talk things through</h3><p>The planned experience includes interests, creative ideas, everyday conversation, and a thoughtful sounding board for relationships. Anna will be clearly identified as AI, with a consistently platonic role.</p></article>
        <article className={styles.card}><h3>Music is part of her world</h3><p>Anna is being designed to discuss approved Half Echo releases and point listeners to official music and social channels, using a maintained catalogue.</p></article>
      </div>
    </section>
    <section className={styles.section} id="development" aria-labelledby="development-title"><p className={styles.kicker}>The development journey</p><h2 className={styles.heading} id="development-title">Meet the world now.<br />Meet the companion as she develops.</h2>
      <p>This is Anna’s introduction page. There is no live Anna chat, account registration, or subscription checkout here yet.</p>
      <ol className={styles.steps}><li><strong>Introduction:</strong> establish Anna’s character and connect her to Half Echo’s music.</li><li><strong>Private testing:</strong> develop conversation, memory controls, and consistent platonic boundaries.</li><li><strong>Release preparation:</strong> verify reliability, privacy controls, and operating costs before offering subscriptions.</li></ol>
      <div className={styles.actions}><a className={styles.button} href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Explore Half Echo on YouTube ↗</a></div>
    </section>
  </EchoShell>;
}
