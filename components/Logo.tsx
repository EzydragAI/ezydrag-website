// EzydragLogo — uses the actual brand assets (transparent-background PNGs)
// Both files are 8-bit RGBA so they render perfectly on dark backgrounds with no white bleed.

import Image from 'next/image';

interface LogoIconProps {
  /** Height in px; width scales proportionally from the 564×442 source */
  height?: number;
  className?: string;
}

/** The "ed" icon mark — pixel-perfect PNG, transparent background */
export function LogoIcon({ height = 36, className = '' }: LogoIconProps) {
  // Source aspect: 564 × 442  → width = height × (564/442)
  const width = Math.round(height * (564 / 442));
  return (
    <Image
      src="/images/ezydrag-icon.png"
      alt="Ezydrag logo mark"
      width={width}
      height={height}
      priority
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

interface LogoFullProps {
  /** Height in px; width scales proportionally */
  height?: number;
  /** Show "ezydrag AI" text next to the icon (for nav/footer) */
  showText?: boolean;
  /** Show "Everything is achievable." tagline (for footer) */
  showTagline?: boolean;
  className?: string;
}

/**
 * Full logo — icon mark + optional wordmark text.
 * Uses the transparent PNG for the mark; "ezydrag AI" is rendered as text
 * so it always matches the site's type style.
 */
export function LogoFull({
  height = 36,
  showText = true,
  showTagline = false,
  className = '',
}: LogoFullProps) {
  const textSize = Math.round(height * 0.72);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon height={height} />
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-extrabold tracking-tight text-white"
            style={{ fontSize: textSize, letterSpacing: '-0.02em' }}
          >
            ezydrag
            <span
              className="ml-1 text-blue-400 font-bold"
              style={{ fontSize: Math.round(textSize * 0.62) }}
            >
              AI
            </span>
          </span>
          {showTagline && (
            <span
              className="text-slate-500 font-medium mt-0.5"
              style={{ fontSize: Math.round(textSize * 0.42) }}
            >
              Everything is achievable.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default LogoFull;
