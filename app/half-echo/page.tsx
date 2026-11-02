import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EchoShell from "./EchoShell";
import styles from "./echo.module.css";

export const metadata: Metadata = {
  title: { absolute: "Half Echo | Electronic Music" },
  description: "Explore Half Echo, the HAMTRON music project: dark melodic techno and cyberpunk soundscapes.",
  alternates: { canonical: "/half-echo" },
  openGraph: { title: "Half Echo", description: "Dark melodic techno. Cyberpunk soundscapes.", url: "/half-echo", type: "website", images: [{ url: "/half-echo/artist.png" }] },
};

export default function HalfEchoPage() {
  return <EchoShell active="music">
    <div className={styles.musicBanner} aria-label="Half Echo — dark melodic techno and cyberpunk soundscapes"><span className={styles.bannerLine} aria-hidden="true" /><strong>HALF<span>ECHO</span></strong><p>DARK MELODIC TECHNO / CYBERPUNK SOUNDSCAPES</p></div>
    <section className={styles.hero} aria-labelledby="music-title">
      <div><p className={styles.kicker}>Half Echo / Electronic music</p>
        <h1 className={styles.title} id="music-title">A world<br />between<br /><em>the signals.</em></h1>
        <p className={styles.lead}>Dark melodic techno and cyberpunk soundscapes. Step into Half Echo’s music, videos, and cinematic visual world.</p>
        <div className={styles.actions}><a className={styles.button} href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Listen on YouTube ↗</a><a className={styles.secondary} href="#explore-music">Explore the music ↓</a></div>
      </div>
      <figure className={styles.portrait}><Image src="/half-echo/artist.png" alt="Half Echo artist portrait with dark hair, black gothic lace clothing and violet-blue lighting" width={600} height={596} sizes="(max-width: 760px) 100vw, 50vw" priority /><figcaption>HALF ECHO / MUSIC PROJECT</figcaption></figure>
    </section>
    <section className={styles.section} id="explore-music" aria-labelledby="explore-title">
      <p className={styles.kicker}>Enter the world</p><h2 className={styles.heading} id="explore-title">Find your next frequency.</h2>
      <div className={styles.grid}>
        <article className={styles.card}><h3>The Half Echo channel</h3><p>Explore the music, videos, and visual world on the official YouTube channel.</p><a href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Visit the official channel ↗</a></article>
        <article className={styles.card}><h3>Press play</h3><p>Open the video shared for this project on YouTube. Playback stays under your control.</p><a href="https://www.youtube.com/watch?v=0ymKxVIhTgY" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></article>
      </div>
    </section>
    <section className={styles.section} aria-labelledby="anna-intro-title">
      <p className={styles.kicker}>Also from HAMTRON</p><h2 className={styles.heading} id="anna-intro-title">Discover Anna Bot.</h2><p>Anna Bot is a separate AI companion product in development under the same HAMTRON umbrella. Half Echo is the music project; Anna Bot is the place for friendly, platonic conversation.</p><div className={styles.actions}><Link className={styles.secondary} href="/anna">Meet Anna Bot →</Link></div>
    </section>
  </EchoShell>;
}
