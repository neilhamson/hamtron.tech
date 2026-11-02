import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EchoShell from "../half-echo/EchoShell";
import styles from "../half-echo/echo.module.css";
import AnnaChat from "./AnnaChat";
import { annaChatConfigured } from "../../lib/anna/access.server";

export const metadata: Metadata = {
  title: { absolute: "Anna Bot | AI Companion in Development" },
  description: "Meet Anna Bot: a friendly, platonic AI companion being developed around music, creativity, gaming, and everyday conversation.",
  alternates: { canonical: "/anna" },
  openGraph: { title: "Anna Bot", description: "A friendly AI companion. In development.", url: "/anna", type: "website", images: [{ url: "/half-echo/anna-approved.png" }] },
};

export default function AnnaPage() {
  const chatAvailable = annaChatConfigured();
  return <EchoShell active="anna">
    <section className={`${styles.hero} ${styles.annaHero}`} aria-labelledby="anna-title">
      <div className={styles.heroCopy}><p className={styles.kicker}>Anna Bot / Your AI companion</p><h1 className={styles.title} id="anna-title">Meet Anna.<br />Find your<br /><em>frequency.</em></h1>
        <p className={styles.lead}>Music. Ideas. The everyday things. A friendly, platonic AI companion being developed by HAMTRON.</p>
        <span className={styles.status}>{chatAvailable ? "Development chat preview" : "In development · Chat not yet available"}</span>
        <div className={styles.actions}><a className={styles.button} href={chatAvailable ? "#anna-chat" : "#character-title"}>{chatAvailable ? "Talk with Anna →" : "Get to know Anna ↓"}</a><Link className={styles.secondary} href="/half-echo">Discover Half Echo ↗</Link></div>
      </div>
      <figure className={styles.portrait}><Image src="/half-echo/anna-approved.png" alt="Anna Bot in her purple knit sweater and black trousers, with blue-violet hair highlights" width={1254} height={1254} sizes="(max-width: 760px) 100vw, 50vw" priority /><figcaption>ANNA BOT / HAMTRON</figcaption></figure>
    </section>
    <aside className={styles.frequencyStrip} aria-label="Anna’s world"><span>ANNA BOT / A HAMTRON PROJECT</span><span>Music &amp; creativity</span><span>Everyday conversation</span><span>Always platonic</span></aside>
    <AnnaChat available={chatAvailable} />
    <section className={styles.section} aria-labelledby="character-title"><p className={styles.kicker}>Her character</p><h2 className={styles.heading} id="character-title">A personality.<br />A shared love of music.<br /><em>A little room to be yourself.</em></h2>
      <div className={`${styles.grid} ${styles.threeColumns}`}>
        <article className={styles.card}><h3>A friend to talk things through</h3><p>The planned experience includes interests, creative ideas, everyday conversation, and a thoughtful sounding board for relationships. Anna will be clearly identified as AI, with a consistently platonic role.</p></article>
        <article className={styles.card}><h3>Music is part of her world</h3><p>Anna Bot can introduce music from Half Echo, a separate music project under the same HAMTRON umbrella. Her music knowledge will come from a maintained catalogue of approved information.</p></article>
        <article className={styles.card}><h3>Clear about who she is</h3><p>Anna is an AI companion with a friendly, platonic role. The development preview has no permanent personal memory. You can start a new conversation whenever you want.</p></article>
      </div>
    </section>
    <section className={styles.section} id="development" aria-labelledby="development-title"><p className={styles.kicker}>The development journey</p><h2 className={styles.heading} id="development-title">Meet the world now.<br />Meet the companion as she develops.</h2>
      <p>This is Anna’s introduction page. There is no live Anna chat, account registration, or subscription checkout here yet.</p>
      <ol className={styles.steps}><li><strong>Introduction:</strong> establish Anna Bot’s character and introduce Half Echo as a separate HAMTRON music project.</li><li><strong>Private testing:</strong> develop conversation, memory controls, and consistent platonic boundaries.</li><li><strong>Release preparation:</strong> verify reliability, privacy controls, and operating costs before offering subscriptions.</li></ol>
      <div className={styles.actions}><a className={styles.button} href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Explore Half Echo on YouTube ↗</a></div>
    </section>
  </EchoShell>;
}
