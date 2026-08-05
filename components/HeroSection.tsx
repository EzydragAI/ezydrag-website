"use client";

type HeroSectionProps = {
  onCta?: () => void;
};

export function HeroSection({ onCta }: HeroSectionProps) {
  return (
    <section className="section section--center section--hero">
      <p className="tagline">AI Automation Agency · India → Worldwide</p>

      <h1 className="hero-title">
        We automate
        <br />
        your <em>business</em>.
      </h1>

      <p className="hero-sub">
        Intelligent AI agents — built, deployed and managed,
        from concept to autopilot.
      </p>

      <button type="button" className="cta" onClick={onCta}>
        Start the journey ↓
      </button>

      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint__line" />
        <span className="scroll-hint__label">scroll</span>
      </div>
    </section>
  );
}
