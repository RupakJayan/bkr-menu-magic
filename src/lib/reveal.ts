/**
 * reveal.js - drop-in scroll reveal for Theme Pack 164.
 *
 * Markup: <div data-reveal="theme" data-reveal-index="0">…</div>
 *   data-reveal        keyframe name, or "theme" to use --tp-reveal
 *   data-reveal-index  stagger position (index x --tp-stagger)
 *   data-reveal-dur    override --tp-dur-slow
 *   data-reveal-root   put on a scroll container to observe inside it
 *
 * Reveals fire once. Nav, tab bars and above-the-fold app chrome must never
 * carry data-reveal.
 */
export function initReveals(scope: ParentNode = document): () => void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return () => {};
  }

  const root = document.documentElement;
  const groups = new Map<Element | null, HTMLElement[]>();

  scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    element.style.animation = "none";
    element.style.opacity = "0";
    const scroller = element.closest("[data-reveal-root]");
    const key = scroller ?? null;
    const bucket = groups.get(key) ?? [];
    bucket.push(element);
    groups.set(key, bucket);
  });

  const observers: IntersectionObserver[] = [];

  groups.forEach((elements, scroller) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          const styles = getComputedStyle(root);
          const animationName =
            element.dataset.reveal === "theme"
              ? styles.getPropertyValue("--tp-reveal").trim() || "tp-up"
              : element.dataset.reveal || "tp-fade";
          const duration =
            element.dataset.revealDur ||
            styles.getPropertyValue("--tp-dur-slow").trim() ||
            "500ms";
          const easing = styles.getPropertyValue("--tp-ease").trim() || "ease";
          const stagger =
            parseFloat(styles.getPropertyValue("--tp-stagger")) || 60;
          const index = Number(element.dataset.revealIndex || 0);

          element.style.opacity = "";
          element.style.animation = `${animationName} ${duration} ${easing} ${
            Math.round(index * stagger)
          }ms both`;
          observer.unobserve(element);
        });
      },
      { root: scroller, threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));
    observers.push(observer);
  });

  return () => observers.forEach((observer) => observer.disconnect());
}
