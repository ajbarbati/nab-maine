const scrollButtons = document.querySelectorAll("[data-scroll]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSelector = button.getAttribute("data-scroll");
    if (!targetSelector) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

function buildMailtoBody(fields) {
  return fields
    .map(({ label, value }) => `${label}: ${value}`)
    .join("\n");
}

function openMailto({ subject, body }) {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  window.location.href = `mailto:maria@nabmaine.com?cc=mike@nabmaine.com&${params.toString()}`;
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const business = String(data.get("business") || "").trim();
    const email = String(data.get("email") || "").trim();
    const body = buildMailtoBody([
      { label: "Name", value: name },
      { label: "Business", value: business },
      { label: "Email", value: email },
    ]);
    openMailto({
      subject: "Contact from nabmaine.com",
      body,
    });
  });
}

const leadModal = document.getElementById("lead-modal");
const leadForm = document.getElementById("lead-modal-form");
let lastFocus = null;

function setModalOpen(isOpen) {
  if (!leadModal) return;
  leadModal.hidden = !isOpen;
  document.body.classList.toggle("modal-open", isOpen);
  if (isOpen) {
    const focusTarget = leadModal.querySelector("input, button");
    if (focusTarget) {
      focusTarget.focus();
    }
  } else if (lastFocus) {
    lastFocus.focus();
    lastFocus = null;
  }
}

document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const id = trigger.getAttribute("data-open-modal");
    if (id === "lead-modal" && leadModal) {
      lastFocus = trigger;
      setModalOpen(true);
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => setModalOpen(false));
});

if (leadModal) {
  leadModal.addEventListener("click", (event) => {
    if (event.target === leadModal) {
      setModalOpen(false);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && leadModal && !leadModal.hidden) {
    setModalOpen(false);
  }
});

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(leadForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const business = String(data.get("business") || "").trim();
    const body = buildMailtoBody([
      { label: "Name", value: name },
      { label: "Email", value: email },
      { label: "Business name", value: business },
    ]);
    openMailto({
      subject: "Lead from nabmaine.com (Get Started)",
      body,
    });
    setModalOpen(false);
  });
}
