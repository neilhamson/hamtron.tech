import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EchoShell from "./EchoShell";
import styles from "./echo.module.css";

export const metadata: Metadata = {
  title: { absolute: "Half Echo | Music & Anna" },
  description: "Explore Half Echo: dark melodic techno, cyberpunk soundscapes, and Anna, an AI companion in development.",
  alternates: { canonical: "/half-echo" },
  openGraph: { title: "Half Echo", description: "Dark melodic techno. Cyberpunk soundscapes. Meet Anna.", url: "/half-echo", type: "website", images: [{ url: "/half-echo/the-frequency.webp" }] },
};

export default function HalfEchoPage() {
  return <EchoShell active="music">
    <section className={styles.hero} aria-labelledby="music-title">
      <div><p className={styles.kicker}>Half Echo / Electronic music</p>
        <h1 className={styles.title} id="music-title">A world<br />between<br /><em>the signals.</em></h1>
        <p className={styles.lead}>Dark melodic techno and cyberpunk soundscapes. Step into the music and discover Anna, the AI companion taking shape alongside Half Echo.</p>
        <div className={styles.actions}><a className={styles.button} href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Listen on YouTube ↗</a><Link className={styles.secondary} href="/anna">Meet Anna →</Link></div>
      </div>
      <figure className={styles.art}><Image src="/half-echo/the-frequency.webp" alt="Half Echo — The Frequency artwork, with a musician at a console overlooking a neon city" width={807} height={772} sizes="(max-width: 760px) 100vw, 50vw" priority /><figcaption>THE FREQUENCY / HALF ECHO</figcaption></figure>
    </section>
    <section className={styles.section} aria-labelledby="explore-title">
      <p className={styles.kicker}>Enter the world</p><h2 className={styles.heading} id="explore-title">Music first. A connection beyond it.</h2>
      <div className={styles.grid}>
        <article className={styles.card}><h3>The Half Echo channel</h3><p>Explore the music, videos, and visual world on the official YouTube channel.</p><a href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Visit the official channel ↗</a></article>
        <article className={styles.card}><h3>Press play</h3><p>Open the video shared for this project on YouTube. Playback stays under your control.</p><a href="https://www.youtube.com/watch?v=0ymKxVIhTgY" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></article>
      </div>
    </section>
    <section className={styles.hero} aria-labelledby="anna-intro-title">
      <figure className={styles.art}><Image src="/half-echo/doors-were-never-locked.webp" alt="Half Echo — The Doors Were Never Locked artwork, with a gothic musician and orchestra in a neon cathedral" width={797} height={782} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>THE DOORS WERE NEVER LOCKED / HALF ECHO</figcaption></figure>
      <div><span className={styles.status}>Anna / In development</span><h2 className={styles.heading} id="anna-intro-title">Meet Anna<br />by Half Echo.</h2><p className={styles.lead}>A friendly AI companion for conversations about music, gaming, creativity, and everyday life. Warm, curious, and always platonic.</p><div className={styles.actions}><Link className={styles.secondary} href="/anna">Explore Anna →</Link></div></div>
    </section>
  </EchoShell>;
}
