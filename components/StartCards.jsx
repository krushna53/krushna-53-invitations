import { REEL_KINDS, REEL_TEMPLATES } from "@/lib/reels";
import { CARD_TEMPLATES } from "@/lib/templates";

/** The three ways to start, shown in a navy band just above the footer. */
export default function StartCards() {
    return (<section className="start-band" aria-labelledby="start-title">
      <div className="start-inner">
        <h2 id="start-title">Ready to make <em>your own?</em></h2>
        <div className="choice-grid start-grid">
          <a className="choice-card" href="/create">
            <span className="choice-heading"><span className="choice-icon">✎</span><b>Create my own</b></span>
            <p>Start with a ceremony scene, pick your colours and frame, then choose an animated or a simple card.</p>
            <span className="choice-cta">Start designing →</span>
          </a>
          <a className="choice-card" href="/templates">
            <span className="choice-heading"><span className="choice-icon">▤</span><b>Pick a card template</b></span>
            <p>{CARD_TEMPLATES.length} illustrated designs for every ceremony, with premium artwork and colour options.</p>
            <span className="choice-cta">Browse templates →</span>
          </a>
          <a className="choice-card" href="/reels">
            <span className="choice-heading"><span className="choice-icon">▶</span><b>Make a video reel</b></span>
            <p>{REEL_TEMPLATES.length} reel templates in {Object.keys(REEL_KINDS).length} animation styles. We build it from your details.</p>
            <span className="choice-cta">See reels →</span>
          </a>
        </div>
      </div>
    </section>);
}
