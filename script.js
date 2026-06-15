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
  ".proof-grid article, .two-column, .concern-grid span, .treatment-list article, .treatment-note, .process-steps article, .doctor-grid, .location-grid article, .faq-list details, .final-grid, .lead-form"
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

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const area = digits.slice(0, 2);
  const firstPart = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const secondPart = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (digits.length <= 2) return area ? `(${area}` : "";
  if (!secondPart) return `(${area}) ${firstPart}`;
  return `(${area}) ${firstPart}-${secondPart}`;
}

function syncPhoneValidity(input) {
  const digits = input.value.replace(/\D/g, "");
  input.setCustomValidity(digits.length === 10 || digits.length === 11 ? "" : "Digite um telefone com DDD.");
}

document.querySelectorAll("[data-mask='phone']").forEach((input) => {
  input.addEventListener("input", () => {
    input.value = formatPhone(input.value);
    syncPhoneValidity(input);
  });

  input.addEventListener("blur", () => {
    syncPhoneValidity(input);
  });
});

document.querySelectorAll(".lead-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.querySelectorAll("[data-mask='phone']").forEach(syncPhoneValidity);
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const nome = String(data.get("nome") || "").trim();
    const telefone = String(data.get("telefone") || "").trim();
    const doctor = form.dataset.doctor || "Dra. Lara Andrade";
    const phone = form.dataset.phone || "5500000000000";
    const message = encodeURIComponent(`Olá, gostaria de agendar uma avaliação com ${doctor}.\n\nNome: ${nome}\nTelefone: ${telefone}`);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_form_submit", form_name: "cta_agendamento_lara" });

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener");
    form.reset();
  });
});
