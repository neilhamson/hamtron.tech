"use client";

import { useState } from "react";
import styles from "./echo.module.css";

export default function AudioPreview({ available }: { available: boolean }) {
  const [failed, setFailed] = useState(false);
  return <article className={styles.card} aria-labelledby="no-respawn-title">
    <p className={styles.kicker}>Half Echo / Audio</p>
    <h3 id="no-respawn-title">No Respawn</h3>
    <p>4:22 · Music track</p>
    {available ? <>
      <audio controls preload="none" aria-label="Play No Respawn by Half Echo" onError={() => setFailed(true)} className={styles.audioPlayer}>
        <source src="/api/half-echo/preview/no-respawn" type="audio/mpeg" />
        Your browser does not support audio playback.
      </audio>
      {failed && <p role="alert">The audio could not load. Please try again later.</p>}
    </> : <p>On-page playback is being prepared. Explore Half Echo’s music on the official YouTube channel in the meantime.</p>}
  </article>;
}
