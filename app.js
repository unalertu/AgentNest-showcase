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

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
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
loadRelease();
