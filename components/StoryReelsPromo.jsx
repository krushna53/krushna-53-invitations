import { STORY_PAGE_PATH } from "@/lib/story-videos";
import styles from "./StoryReelsPromo.module.css";

// Link from /reels to the love story library.
export default function StoryReelsPromo() {
  return <section className={styles.promo} aria-label="Love story reels">
    <img src="/videos/stories/story-1.jpg" alt="" className={styles.thumb} />
    <div className={styles.text}>
      <p className="eyebrow">NEW · LOVE STORY REELS</p>
      <b>Your journey as an animated story</b>
      <small>From your first meeting to the wedding day. Watch real examples, then make yours.</small>
    </div>
    <div className={styles.actions}>
      <a className="primary" href={STORY_PAGE_PATH}>Browse story reels</a>
    </div>
  </section>;
}
