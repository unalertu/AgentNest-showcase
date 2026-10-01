const RELEASE_MANIFEST = "release.json";
const PREFERENCE_KEY = "agentnest:update-preference";
const INSTALLED_VERSION_KEY = "agentnest:downloaded-version";
const DISMISSED_VERSION_KEY = "agentnest:dismissed-update";

const fallbackRelease = {
  version: "1.4.1",
  downloadUrl:
    "https://github.com/unalertu/AgentNest-showcase/releases/download/v1.4.1/AgentNest-1.4.1-intel.dmg",
};

let currentRelease = fallbackRelease;

const dialog = document.querySelector("[data-download-dialog]");
const downloadForm = document.querySelector("[data-download-form]");
const downloadTriggers = document.querySelectorAll(".download-trigger");
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const updateBanner = document.querySelector("[data-update-banner]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const heroWindow = document.querySelector(".app-window");
const productShot = document.querySelector(".shot-frame");
const ambientOne = document.querySelector(".ambient-one");
const ambientTwo = document.querySelector(".ambient-two");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollFrame;

function compareVersions(a, b) {
  const aParts = String(a).split(".").map(Number);
  const bParts = String(b).split(".").map(Number);
  const length = Math.max(aParts.length, bParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (aParts[index] || 0) - (bParts[index] || 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

async function loadRelease() {
  try {
    const response = await fetch(RELEASE_MANIFEST, { cache: "no-store" });
    if (!response.ok) throw new Error("Release manifest unavailable");
    currentRelease = { ...fallbackRelease, ...(await response.json()) };
  } catch {
    currentRelease = fallbackRelease;
  }

  const preference = localStorage.getItem(PREFERENCE_KEY);
  const downloadedVersion = localStorage.getItem(INSTALLED_VERSION_KEY);
  const dismissedVersion = localStorage.getItem(DISMISSED_VERSION_KEY);

  if (
    preference === "automatic" &&
    downloadedVersion &&
    compareVersions(currentRelease.version, downloadedVersion) > 0 &&
    dismissedVersion !== currentRelease.version
  ) {
    const versionLabel = updateBanner.querySelector("[data-update-version]");
    versionLabel.textContent = `AgentNest ${currentRelease.version} hazır.`;
    updateBanner.hidden = false;
  }
}

function openDownloadDialog() {
  const savedPreference = localStorage.getItem(PREFERENCE_KEY);
  if (savedPreference) {
    const option = dialog.querySelector(`input[value="${savedPreference}"]`);
    if (option) option.checked = true;
  }
  dialog.showModal();
}

downloadTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openDownloadDialog);
});

downloadForm.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (!submitter || submitter.value !== "download") return;

  event.preventDefault();
  const preference = new FormData(downloadForm).get("updates") || "manual";
  localStorage.setItem(PREFERENCE_KEY, preference);
  localStorage.setItem(INSTALLED_VERSION_KEY, currentRelease.version);
  localStorage.removeItem(DISMISSED_VERSION_KEY);
  dialog.close();
  window.location.assign(currentRelease.downloadUrl);
});

document.querySelector("[data-dismiss-update]").addEventListener("click", () => {
  localStorage.setItem(DISMISSED_VERSION_KEY, currentRelease.version);
  updateBanner.hidden = true;
});

function updateScrollEffects() {
  scrollFrame = undefined;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
  header.classList.toggle("is-scrolled", window.scrollY > 16);

  if (reducedMotion.matches) return;

  const heroShift = Math.min(window.scrollY * 0.055, 34);
  heroWindow.style.setProperty("--hero-shift", `${heroShift}px`);

  const shotRect = productShot.getBoundingClientRect();
  const shotProgress = Math.max(-1, Math.min(1, (shotRect.top - window.innerHeight / 2) / window.innerHeight));
  productShot.style.setProperty("--shot-shift", `${shotProgress * -18}px`);
}

function queueScrollEffects() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollEffects);
}

window.addEventListener("scroll", queueScrollEffects, { passive: true });
window.addEventListener("resize", queueScrollEffects);

window.addEventListener(
  "pointermove",
  (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 14;
    ambientOne.style.setProperty("--ambient-x", `${x}px`);
    ambientOne.style.setProperty("--ambient-y", `${y}px`);
    ambientTwo.style.setProperty("--ambient-x", `${x * -0.7}px`);
    ambientTwo.style.setProperty("--ambient-y", `${y * -0.7}px`);
  },
  { passive: true },
);

document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateY = ((x / bounds.width) - 0.5) * 5;
    const rotateX = ((y / bounds.height) - 0.5) * -5;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
    card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
  });

  card.addEventListener("pointerenter", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    card.classList.add("is-hovering");
    card.style.setProperty("--card-lift", "-6px");
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-hovering");
    card.style.setProperty("--card-lift", "0px");
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-active");
    });
  },
  { threshold: 0.55 },
);

document.querySelectorAll(".steps li").forEach((step) => stepObserver.observe(step));
updateScrollEffects();
loadRelease();
