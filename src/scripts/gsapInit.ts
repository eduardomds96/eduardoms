import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./reducedMotion";

let pluginRegistered = false;

function registerScrollTrigger(): void {
  if (pluginRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  pluginRegistered = true;
}

function initHeroTimeline(): void {
  const headline = document.querySelector<HTMLElement>("[data-hero-headline]");
  const subheadline = document.querySelector<HTMLElement>("[data-hero-subheadline]");
  const ctas = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-cta]"));

  if (!headline || prefersReducedMotion()) return;

  const targets = [headline, subheadline, ...ctas].filter(Boolean) as HTMLElement[];
  gsap.set(targets, { autoAlpha: 0, y: 20 });

  const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });
  tl.to(headline, { autoAlpha: 1, y: 0 });
  if (subheadline) tl.to(subheadline, { autoAlpha: 1, y: 0 }, 0.1);
  if (ctas.length) tl.to(ctas, { autoAlpha: 1, y: 0, stagger: 0.06 }, 0.2);
}

function initSubheadlineTypewriter(): void {
  const el = document.querySelector<HTMLElement>("[data-hero-subheadline]");
  if (!el || prefersReducedMotion()) return;

  const fullText = el.textContent?.trim();
  if (!fullText) return;

  el.textContent = "";
  el.classList.add("typewriter-active");

  const proxy = { chars: 0 };
  gsap.to(proxy, {
    chars: fullText.length,
    duration: fullText.length * 0.022,
    delay: 0.6,
    ease: "none",
    onUpdate: () => {
      el.textContent = fullText.slice(0, Math.round(proxy.chars));
    },
    onComplete: () => {
      el.textContent = fullText;
      el.classList.remove("typewriter-active");
    },
  });
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#0123456789";

function scrambleReveal(el: HTMLElement, finalText: string, duration = 500): void {
  const steps = Math.max(8, Math.round(duration / 30));
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const revealed = Math.floor((step / steps) * finalText.length);
    let output = finalText.slice(0, revealed);
    for (let i = revealed; i < finalText.length; i++) {
      output += finalText[i] === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = output;

    if (step >= steps) {
      el.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
}

function initAvailabilityScramble(): void {
  const el = document.querySelector<HTMLElement>("[data-i18n='availabilityBadge']");
  if (!el || prefersReducedMotion()) return;

  const finalText = el.textContent?.trim();
  if (!finalText) return;

  scrambleReveal(el, finalText, 500);
}

function initHeroSvgDraw(): void {
  const svg = document.querySelector<SVGSVGElement>("[data-hero-visual] svg");
  if (!svg || prefersReducedMotion()) return;

  const shapes = Array.from(svg.querySelectorAll<SVGGeometryElement>("[stroke]"));
  if (!shapes.length) return;

  // Read every length first (one forced layout at most), then write styles —
  // avoids a read/write/read/write chain across shapes.
  const lengths = shapes.map((shape) => shape.getTotalLength());
  shapes.forEach((shape, i) => {
    const length = lengths[i];
    if (!shape.hasAttribute("stroke-dasharray")) {
      shape.style.strokeDasharray = `${length}`;
    }
    shape.style.strokeDashoffset = `${length}`;
  });

  const dot = svg.querySelector<SVGCircleElement>('circle[fill="#e8c547"]');
  if (dot) gsap.set(dot, { scale: 0, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({ delay: 0.4 });
  tl.to(shapes, {
    strokeDashoffset: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.1,
  });
  if (dot) tl.to(dot, { scale: 1, duration: 0.3, ease: "back.out(3)" }, "-=0.2");
}

function initScrollReveals(): void {
  if (prefersReducedMotion()) return;
  registerScrollTrigger();

  const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-group]"));
  const groupTargets = groups.map((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
    return items.length ? items : [group];
  });

  // Write every group's starting styles first...
  groupTargets.forEach((targets) => gsap.set(targets, { autoAlpha: 0, y: 20 }));

  // ...then create all the ScrollTriggers (each reads the trigger's layout
  // position) in a separate pass, so the browser flushes layout once instead
  // of once per group.
  groups.forEach((group, i) => {
    const targets = groupTargets[i];
    ScrollTrigger.create({
      trigger: group,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        });
      },
    });
  });
}

function initBackgroundParallax(): void {
  if (prefersReducedMotion()) return;
  registerScrollTrigger();

  const layer = document.querySelector<HTMLElement>("[data-bg-layer]");
  if (!layer) return;

  gsap.to(layer, {
    y: 60,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
    },
  });
}

function initHeroVisualParallax(): void {
  if (prefersReducedMotion()) return;
  registerScrollTrigger();

  const wrap = document.querySelector<HTMLElement>("[data-hero-visual-wrap]");
  if (!wrap) return;

  gsap.to(wrap, {
    y: 40,
    rotateZ: 3,
    ease: "none",
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });
}

export function initAnimations(): void {
  // Undo any leftover ScrollTriggers from a previous astro:page-load cycle.
  if (pluginRegistered) ScrollTrigger.getAll().forEach((st) => st.kill());

  initHeroTimeline();
  initSubheadlineTypewriter();
  initAvailabilityScramble();
  initHeroSvgDraw();
  initScrollReveals();
  initBackgroundParallax();
  initHeroVisualParallax();
}
