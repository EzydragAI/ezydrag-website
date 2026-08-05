"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Manifesto", id: "manifesto" },
  { label: "Services", id: "services" },
  { label: "Products", id: "products" },
  { label: "Contact", id: "contact" },
];

function scrollToSection(
  scrollEl: HTMLDivElement | null | undefined,
  id: string | null
) {
  if (!scrollEl) return;
  if (!id) {
    scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const section = document.getElementById(id);
  if (!section) return;
  const sections = Array.from(
    scrollEl.querySelectorAll(".interface > .section")
  ) as HTMLElement[];
  const index = sections.indexOf(section as HTMLElement);
  if (index < 0) return;
  let target = 0;
  for (let i = 0; i < index; i++) {
    target += sections[i].offsetHeight;
  }
  scrollEl.scrollTo({ top: target, behavior: "smooth" });
}

export function Navbar({
  scrollRef,
}: {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const go = (id: string | null) => {
    scrollToSection(scrollRef?.current, id);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="header">
        <button type="button" className="logo" onClick={() => go(null)} aria-label="EZYDRAG home">
          <img src="/images/logo1.png" alt="" aria-hidden="true" className="logo__mark" />
          EZYDRAG<span className="logo__reg">®</span>
        </button>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="nav-burger"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {mobileOpen && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" className="mobile-nav__close" onClick={() => setMobileOpen(false)} aria-label="Close" autoFocus>
            <X size={24} />
          </button>
          {NAV.map((n) => (
            <button key={n.id} type="button" className="mobile-nav__link" onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>EZYDRAG® 2026</span>
      <span>India — Worldwide</span>
    </footer>
  );
}

export { scrollToSection };
