const header = document.querySelector("[data-elevate]");
const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
const navItems = navLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter((item) => item.section);

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-elevated", window.scrollY > 8);
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

function syncActiveNav() {
  if (!navItems.length) return;

  const firstSectionTop = navItems[0].section.offsetTop - 220;
  const current = window.scrollY < firstSectionTop
    ? null
    : navItems.reduce((active, item) => {
        const top = item.section.getBoundingClientRect().top;
        if (top <= 160) return item;
        return active;
      }, null);

  navItems.forEach((item) => {
    item.link.classList.toggle("is-active", current?.link === item.link);
  });
}

window.addEventListener("scroll", syncActiveNav, { passive: true });
window.addEventListener("resize", syncActiveNav);
syncActiveNav();

if (window.lucide) {
  window.lucide.createIcons();
}

const animatedItems = document.querySelectorAll(
  ".proof-grid article, .two-column, .concern-grid span, .treatment-media, .treatment-list article, .treatment-note, .process-steps article, .doctor-grid, .location-grid article, .faq-list details, .final-grid"
);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  animatedItems.forEach((item, index) => {
    item.classList.add("reveal-on-scroll");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  animatedItems.forEach((item) => revealObserver.observe(item));
}
