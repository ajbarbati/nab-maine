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

const GOOGLE_FORM = {
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSc4gvr49wFNpvwdC459reEeryTBppB96zhk3F1aUbJSQ1ktvg/formResponse",
  entries: {
    name: "entry.1260104118",
    email: "entry.459590106",
    business: "entry.1133418237",
    billboard: "entry.487646327",
    source: "entry.925397380",
  },
};

async function submitToGoogleForm({ name, email, business, billboard, source }) {
  const body = new URLSearchParams();
  body.set(GOOGLE_FORM.entries.name, name);
  body.set(GOOGLE_FORM.entries.email, email);
  body.set(GOOGLE_FORM.entries.business, business);
  if (billboard) {
    body.set(GOOGLE_FORM.entries.billboard, billboard);
  }
  body.set(GOOGLE_FORM.entries.source, source);

  await fetch(GOOGLE_FORM.action, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

const SENDING_TO_SENT_MS = 1200;
const SENT_TO_DONE_MS = 800;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function runFormSubmit({ submitBtn, submitFn, onDone }) {
  const originalLabel = submitBtn ? submitBtn.textContent : "";

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
  }

  let submitFailed = false;
  submitFn().catch(() => {
    submitFailed = true;
  });

  await wait(SENDING_TO_SENT_MS);

  if (submitFailed) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
    return;
  }

  if (submitBtn) {
    submitBtn.textContent = "Sent";
  }

  await wait(SENT_TO_DONE_MS);
  onDone();
}

let lastFocus = null;
let activeModal = null;

function openModal(modalId, trigger) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  lastFocus = trigger || document.activeElement;
  activeModal = modal;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  const focusTarget = modal.querySelector("input, textarea, button");
  if (focusTarget) {
    focusTarget.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  if (activeModal === modal) {
    activeModal = null;
  }

  if (!document.querySelector(".modal-backdrop:not([hidden])")) {
    document.body.classList.remove("modal-open");
  }

  if (lastFocus && typeof lastFocus.focus === "function") {
    lastFocus.focus();
    lastFocus = null;
  }
}

function closeActiveModal() {
  if (!activeModal) return;
  const modalId = activeModal.id;
  if (modalId === "kmbf-modal") {
    sessionStorage.setItem("kmbf-dismissed", "1");
  }
  closeModal(modalId);
}

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal-backdrop");
    if (modal) {
      if (modal.id === "kmbf-modal") {
        sessionStorage.setItem("kmbf-dismissed", "1");
      }
      closeModal(modal.id);
    }
  });
});

document.querySelectorAll(".modal-backdrop").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      if (modal.id === "kmbf-modal") {
        sessionStorage.setItem("kmbf-dismissed", "1");
      }
      closeModal(modal.id);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeModal) {
    if (activeModal.id === "kmbf-modal") {
      sessionStorage.setItem("kmbf-dismissed", "1");
    }
    closeModal(activeModal.id);
  }
});

const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-form-success");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const business = String(data.get("business") || "").trim();
    const email = String(data.get("email") || "").trim();
    const billboard = String(data.get("billboard") || "").trim();

    runFormSubmit({
      submitBtn,
      submitFn: () =>
        submitToGoogleForm({
          name,
          email,
          business,
          billboard,
          source: "Contact",
        }),
      onDone: () => {
        contactForm.querySelectorAll(".field, button").forEach((el) => {
          el.hidden = true;
        });
        if (contactSuccess) {
          contactSuccess.hidden = false;
        }
      },
    });
  });
}

const kmbfModal = document.getElementById("kmbf-modal");
const kmbfForm = document.getElementById("kmbf-modal-form");

if (kmbfForm) {
  kmbfForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitBtn = kmbfForm.querySelector('button[type="submit"]');

    const data = new FormData(kmbfForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const business = String(data.get("business") || "").trim();
    const billboard = String(data.get("billboard") || "").trim();

    runFormSubmit({
      submitBtn,
      submitFn: () =>
        submitToGoogleForm({
          name,
          email,
          business,
          billboard,
          source: "KMBF",
        }),
      onDone: () => {
        sessionStorage.setItem("kmbf-dismissed", "1");
        closeModal("kmbf-modal");
        kmbfForm.reset();
      },
    });
  });
}

if (kmbfModal && !sessionStorage.getItem("kmbf-dismissed")) {
  window.setTimeout(() => {
    if (!sessionStorage.getItem("kmbf-dismissed")) {
      openModal("kmbf-modal");
    }
  }, 2500);
}
