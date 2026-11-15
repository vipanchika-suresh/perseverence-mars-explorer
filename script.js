// NASA describes these instruments and systems on the official Perseverance
// science page. Each note has a child-friendly summary and a deeper explanation.
const roverTools = {
  mastcam: {
    name: "Mastcam-Z",
    kid: "Think of Mastcam-Z as the rover’s pair of zoom cameras. They help Perseverance take colorful pictures and look closely at places it has not reached yet.",
    science: "Mastcam-Z is a mast-mounted camera system with zoom. It takes panoramic, stereoscopic (3D), and video images that help scientists study terrain and choose targets.",
    source: "https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/"
  },
  supercam: {
    name: "SuperCam",
    kid: "SuperCam can study rocks from a distance. It uses a laser and cameras to help the science team decide which rocks deserve a closer look.",
    science: "Mounted on the remote-sensing mast, SuperCam uses laser-induced breakdown spectroscopy, a remote micro-imager, and other spectrometers to investigate the chemistry and mineralogy of rocks and soil. It also includes a microphone.",
    source: "https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/"
  },
  pixl: {
    name: "PIXL",
    kid: "PIXL is a close-up rock detective. It uses X-rays to help map the tiny ingredients in a rock, almost like making a super-detailed recipe.",
    science: "PIXL (Planetary Instrument for X-ray Lithochemistry) is mounted on the arm’s turret. Its X-ray spectrometer measures elemental composition at fine scales, while its imager records rock textures.",
    source: "https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/"
  },
  sherloc: {
    name: "SHERLOC",
    kid: "SHERLOC shines ultraviolet light on rocks and looks for minerals and carbon-based molecules. It helps scientists investigate places where life might have been able to exist long ago.",
    science: "SHERLOC (Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals) uses ultraviolet Raman and fluorescence spectroscopy, plus imaging, to map minerals and organic molecules. WATSON provides close-up color images.",
    source: "https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/"
  },
  arm: {
    name: "Robotic arm",
    kid: "The rover’s arm reaches out like a careful hand. It can place science tools against a rock and help prepare rock samples for collection.",
    science: "The approximately 2.1-meter (7-foot) arm positions instruments such as PIXL and SHERLOC at rock surfaces. Its turret also carries tools for abrading rock and acquiring cores for the sampling system.",
    source: "https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/quick_facts/"
  }
};

// Set coordinates after the supplied rover photo is in place. Values are
// percentages measured from the photo's top-left corner, for example { x: 50, y: 28 }.
const roverHotspotPositions = {
  mastcam: { x: 30, y: 19 },
  supercam: { x: 31, y: 28 },
  arm: { x: 56, y: 41 },
  pixl: { x: 75, y: 49 },
  sherloc:  { x: 75, y: 59 }
};

const roverPhotoArea = document.querySelector(".rover-photo-area");
const roverPhoto = roverPhotoArea?.querySelector(".rover-photo");
const photoPlaceholder = roverPhotoArea?.querySelector(".photo-placeholder");
const roverHotspots = [...document.querySelectorAll(".rover-hotspot")];
const roverLegend = roverPhotoArea?.querySelector(".diagram-legend");

function placeRoverHotspots() {
  const photoReady = roverPhoto?.naturalWidth > 0;
  const frame = roverPhotoArea?.getBoundingClientRect();
  const scale = photoReady && frame?.width && frame?.height
    ? Math.min(frame.width / roverPhoto.naturalWidth, frame.height / roverPhoto.naturalHeight)
    : 0;
  const photoWidth = photoReady ? roverPhoto.naturalWidth * scale : 0;
  const photoHeight = photoReady ? roverPhoto.naturalHeight * scale : 0;
  const photoLeft = frame ? (frame.width - photoWidth) / 2 : 0;
  const photoTop = frame ? (frame.height - photoHeight) / 2 : 0;
  let hasPosition = false;
  roverHotspots.forEach((button) => {
    const position = roverHotspotPositions[button.dataset.tool];
    const configured = photoReady && position && Number.isFinite(position.x) && Number.isFinite(position.y);
    button.hidden = !configured;
    if (configured) {
      button.style.left = `${photoLeft + position.x / 100 * photoWidth - button.offsetWidth / 2}px`;
      button.style.top = `${photoTop + position.y / 100 * photoHeight - button.offsetHeight / 2}px`;
      hasPosition = true;
    }
  });
  if (roverPhotoArea) roverPhotoArea.classList.toggle("has-photo", photoReady);
  if (roverPhotoArea) roverPhotoArea.classList.toggle("has-hotspots", hasPosition);
  if (roverLegend) roverLegend.hidden = !hasPosition;
  if (photoPlaceholder) photoPlaceholder.hidden = photoReady;
}

roverPhoto?.addEventListener("load", placeRoverHotspots);
roverPhoto?.addEventListener("error", placeRoverHotspots);
window.addEventListener("resize", placeRoverHotspots);
placeRoverHotspots();

// One section is shown at a time. Hash-based routes keep browser back/forward
// working and let the shared navigation link directly to each experience.
const pageSections = [...document.querySelectorAll("main [data-page]")];
const pageOrder = pageSections.map((section) => section.dataset.page);
const pageTitles = {
  home: "Home",
  meet: "Meet Perseverance",
  rover: "Explore the Rover",
  discoveries: "Discoveries",
  academy: "Space Academy",
  storybook: "Our Storybook"
};

function showPage(pageId, updateHistory = false) {
  const page = pageOrder.includes(pageId) ? pageId : "home";
  pageSections.forEach((section) => {
    const active = section.dataset.page === page;
    section.hidden = !active;
    section.classList.toggle("active-page", active);
    if (active) section.setAttribute("aria-label", `${pageTitles[page]} page`);
    else section.removeAttribute("aria-label");
  });
  document.querySelectorAll(".primary-nav a").forEach((link) => {
    const linkPage = link.hash.slice(1) || "home";
    if (linkPage === page) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (page === "rover") placeRoverHotspots();
  if (updateHistory && location.hash !== `#${page}`) history.pushState({ page }, "", `#${page}`);
}

pageSections.forEach((section, index) => {
  const controls = document.createElement("nav");
  controls.className = "page-controls";
  controls.setAttribute("aria-label", "Page navigation");
  const previous = index > 0
    ? `<a class="page-step" href="#${pageOrder[index - 1]}"><span aria-hidden="true">←</span> Back</a>`
    : '<span class="page-step page-step-muted" aria-hidden="true">Start here</span>';
  const next = index < pageOrder.length - 1
    ? `<a class="page-step page-step-next" href="#${pageOrder[index + 1]}">Next <span aria-hidden="true">→</span></a>`
    : '<span class="page-step page-step-muted" aria-hidden="true">End of adventure</span>';
  controls.innerHTML = `${previous}<span class="page-count">${index + 1} / ${pageOrder.length} · ${pageTitles[pageOrder[index]]}</span>${next}`;
  section.append(controls);
});

function routeFromLocation() {
  const page = location.hash.slice(1) || "home";
  showPage(page);
  window.scrollTo({ top: 0, behavior: "auto" });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const targetPage = link.hash.slice(1);
  if (pageOrder.includes(targetPage) || targetPage === "home") {
    event.preventDefault();
    showPage(targetPage, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    primaryNav?.classList.remove("open");
  }
});

window.addEventListener("popstate", routeFromLocation);
window.addEventListener("hashchange", routeFromLocation);
routeFromLocation();

// The existing mobile navigation is kept from the original homepage.
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("open");
    });
  });
}

// Open a detailed field note when a rover marker is selected.
const toolDialog = document.querySelector("#tool-dialog");
const toolTitle = document.querySelector("#tool-dialog-title");
const toolKid = document.querySelector("#tool-kid");
const toolScience = document.querySelector("#tool-science");
const toolSource = document.querySelector("#tool-source");
const dialogClose = document.querySelector(".dialog-close");

document.querySelectorAll(".rover-hotspot").forEach((button) => {
  button.addEventListener("click", () => {
    const tool = roverTools[button.dataset.tool];
    if (!tool || !toolDialog) return;

    toolTitle.textContent = tool.name;
    toolKid.textContent = tool.kid;
    toolScience.textContent = tool.science;
    toolSource.href = tool.source;
    toolDialog.showModal();
  });
});

dialogClose?.addEventListener("click", () => toolDialog.close());

// Matching game: the short answer labels are defined once and reused as choices.
const matchFunctions = [
  { id: "zoom", label: "Take zoomed pictures of distant places" },
  { id: "laser", label: "Study rock chemistry from a distance" },
  { id: "elements", label: "Map tiny rock ingredients with X-rays" },
  { id: "organics", label: "Look for organics and minerals with UV light" },
  { id: "reach", label: "Place tools against rocks and help collect samples" }
];

const matchItems = [
  { name: "Mastcam-Z", answer: "zoom" },
  { name: "SuperCam", answer: "laser" },
  { name: "PIXL", answer: "elements" },
  { name: "SHERLOC", answer: "organics" },
  { name: "Robotic arm", answer: "reach" }
];

const matchingForm = document.querySelector("#matching-game");
const matchResult = document.querySelector("#match-result");
const virtualBadge = document.querySelector("#virtual-badge");

if (matchingForm) {
  matchingForm.innerHTML = matchItems.map((item, index) => `
    <div class="match-row">
      <label for="match-${index}">${item.name}</label>
      <select id="match-${index}" name="match-${index}" required>
        <option value="">Choose a job…</option>
        ${matchFunctions.map((fn) => `<option value="${fn.id}">${fn.label}</option>`).join("")}
      </select>
    </div>
  `).join("");

  matchingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const score = matchItems.reduce((total, item, index) => {
      return total + (matchingForm.elements[`match-${index}`]?.value === item.answer ? 1 : 0);
    }, 0);
    matchResult.textContent = `You matched ${score} out of ${matchItems.length}. ${score === 5 ? "Perfect match, rover scientist! Your Explorer badge is unlocked." : "Give it another go and see if you can match all five."}`;
    if (score === 5) virtualBadge.hidden = false;
  });

  matchingForm.addEventListener("reset", () => {
    matchResult.textContent = "";
  });
}

// Five-question quiz. Correct answers are kept with the question data for editing.
const quizQuestions = [
  {
    question: "Where did Perseverance land?",
    options: ["Jezero Crater", "Valles Marineris", "Olympus Mons", "The Moon"],
    answer: 0
  },
  {
    question: "Which tool takes zoomable pictures?",
    options: ["PIXL", "Mastcam-Z", "SHERLOC", "The robotic arm"],
    answer: 1
  },
  {
    question: "What does PIXL use to study tiny rock ingredients?",
    options: ["X-rays", "A shovel", "Radio waves", "A thermometer"],
    answer: 0
  },
  {
    question: "What ancient environment did Jezero Crater once include?",
    options: ["A lake fed by a river", "A forest", "An ocean of lava only", "A glacier-covered sea"],
    answer: 0
  },
  {
    question: "What has Perseverance confirmed about ancient life on Mars?",
    options: ["It found living microbes", "It has not confirmed life; it searches for possible clues", "It proved Mars never had water", "It has stopped exploring"],
    answer: 1
  }
];

const quizForm = document.querySelector("#quiz-game");
const quizResult = document.querySelector("#quiz-result");

if (quizForm) {
  quizForm.innerHTML = quizQuestions.map((item, questionIndex) => `
    <fieldset class="quiz-question">
      <legend>${questionIndex + 1}. ${item.question}</legend>
      <div class="quiz-options">
        ${item.options.map((option, optionIndex) => `
          <label class="quiz-option">
            <input type="radio" name="question-${questionIndex}" value="${optionIndex}" required>
            <span>${option}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const score = quizQuestions.reduce((total, item, questionIndex) => {
      const selected = quizForm.querySelector(`input[name="question-${questionIndex}"]:checked`);
      return total + (Number(selected.value) === item.answer ? 1 : 0);
    }, 0);

    const message = score === 5 ? "Incredible work, mission expert!" : score >= 3 ? "Nice exploring, science thinker!" : "Every explorer learns by asking questions. Try again!";
    quizResult.textContent = `Your score: ${score} out of ${quizQuestions.length}. ${message}`;
    if (score >= 4) virtualBadge.hidden = false;
  });

  quizForm.addEventListener("reset", () => {
    quizResult.textContent = "";
  });
}

// Replace this placeholder with the public Canva link when it is ready.
const storybookUrl = "#";
const storybookLink = document.querySelector("#storybook-link");

if (storybookLink) {
  if (storybookUrl !== "#") {
    storybookLink.href = storybookUrl;
    storybookLink.removeAttribute("aria-label");
    document.querySelector(".storybook-note")?.remove();
  } else {
    storybookLink.addEventListener("click", (event) => event.preventDefault());
  }
}
