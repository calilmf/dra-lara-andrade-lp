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

const scheduleModal = document.querySelector("#schedule-modal");
const scheduleOpeners = Array.from(document.querySelectorAll("[data-schedule-open]"));
const scheduleClosers = Array.from(document.querySelectorAll("[data-schedule-close]"));
let lastScheduleTrigger = null;

function openScheduleModal(event) {
  event?.preventDefault();
  if (!scheduleModal) return;

  lastScheduleTrigger = event?.currentTarget ?? document.activeElement;
  scheduleModal.classList.add("is-open");
  scheduleModal.setAttribute("aria-hidden", "false");
  scheduleModal.removeAttribute("inert");
  document.body.classList.add("modal-open");
  scheduleModal.querySelector(".schedule-options a")?.focus();
}

function closeScheduleModal() {
  if (!scheduleModal) return;

  scheduleModal.classList.remove("is-open");
  scheduleModal.setAttribute("aria-hidden", "true");
  scheduleModal.setAttribute("inert", "");
  document.body.classList.remove("modal-open");

  if (lastScheduleTrigger instanceof HTMLElement) {
    lastScheduleTrigger.focus();
  }
}

scheduleOpeners.forEach((opener) => opener.addEventListener("click", openScheduleModal));
scheduleClosers.forEach((closer) => closer.addEventListener("click", closeScheduleModal));

if (window.location.hash === "#agendar") {
  window.requestAnimationFrame(() => openScheduleModal());
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && scheduleModal?.classList.contains("is-open")) {
    closeScheduleModal();
  }
});

const animatedItems = document.querySelectorAll(
  ".proof-media, .proof-grid article, .two-column, .concern-grid span, .treatment-list article, .treatment-note, .process-steps article, .doctor-grid, .location-grid article, .faq-list details, .final-grid"
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
