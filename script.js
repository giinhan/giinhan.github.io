const grid = document.querySelector("[data-grid]");
const detail = document.querySelector("[data-detail]");
const detailInner = document.querySelector("[data-detail-inner]");
const detailImage = document.querySelector("[data-detail-image]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailCopy = document.querySelector("[data-detail-copy]");
const detailThumbA = document.querySelector("[data-detail-thumb-a]");
const detailThumbB = document.querySelector("[data-detail-thumb-b]");
const tabs = document.querySelectorAll("[data-category]");
const aboutPanel = document.querySelector("[data-about-panel]");
const aboutName = document.querySelector("[data-about-name]");
const aboutBody = document.querySelector("[data-about-body]");
const aboutEmail = document.querySelector("[data-about-email]");
let rustleTimer = null;

const aboutContent = {
  name: "한지인",
  email: "giinhan@gmail.com",
  body: "나는 한지인이다",
};

const cardRows = [
  { category: "1", card: "1", txt: "일일" },
  { category: "2", card: "1", txt: "이일" },
  { category: "3", card: "1", txt: "삼일" },
  { category: "4", card: "1", txt: "사일" },
  { category: "5", card: "1", txt: "오일" },
];

const projects = cardRows.map((row, index) => {
  const image = `img/${row.category}-${row.card}.png`;
  return {
    id: `${row.category}-${row.card}`,
    category: row.category,
    title: `${row.category}-${row.card}`,
    tilt: `${[-4, 3, -2, 5, -5][index % 5]}deg`,
    image,
    thumbA: image,
    thumbB: image,
    copy: row.txt,
  };
});

function render(category = "all") {
  grid.innerHTML = "";
  const filtered =
    category === "all" ? projects : projects.filter((project) => project.category === category);
  filtered.forEach((project) => {
    const card = document.createElement("button");
    card.className = "project-card";
    card.type = "button";
    card.style.setProperty("--tilt", project.tilt);
    card.setAttribute("aria-label", `${project.title} 크게 보기`);
    card.innerHTML = `<img src="${project.image}" alt="${project.title}" />`;
    card.addEventListener("click", () => openDetail(project));
    grid.appendChild(card);
  });
}

function openDetail(project) {
  detail.classList.remove("is-flipped");
  detailImage.src = project.image;
  detailImage.alt = project.title;
  detailTitle.textContent = project.title;
  detailCopy.textContent = project.copy;
  detailThumbA.src = project.thumbA;
  detailThumbB.src = project.thumbB;
  detailThumbA.alt = `${project.title} detail image A`;
  detailThumbB.alt = `${project.title} detail image B`;
  detail.setAttribute("aria-hidden", "false");
  detail.classList.add("is-open");
  document.body.classList.add("detail-open");
  window.clearTimeout(rustleTimer);
  rustleTimer = window.setTimeout(() => {
    if (detail.classList.contains("is-open")) {
      playPaperRustle();
    }
  }, 940);
}

function playPaperRustle() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }

  const context = new AudioContext();
  const duration = 0.42;
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    const t = i / data.length;
    const burst = Math.sin(t * Math.PI) * (1 - t * 0.35);
    const grain = Math.random() * 2 - 1;
    const scratch = Math.sin(i * 0.21) * (Math.random() * 0.35);
    data[i] = (grain * 0.55 + scratch) * burst;
  }

  const source = context.createBufferSource();
  const highpass = context.createBiquadFilter();
  const lowpass = context.createBiquadFilter();
  const gain = context.createGain();

  highpass.type = "highpass";
  highpass.frequency.value = 750;
  lowpass.type = "lowpass";
  lowpass.frequency.value = 5200;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.24, context.currentTime + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.018, context.currentTime + duration);

  source.buffer = buffer;
  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(context.destination);
  source.start();
  source.stop(context.currentTime + duration);
}

function renderAbout() {
  aboutName.textContent = aboutContent.name;
  aboutBody.textContent = aboutContent.body;
  aboutEmail.textContent = aboutContent.email;
  aboutEmail.href = `mailto:${aboutContent.email}`;
}

function closeDetail() {
  window.clearTimeout(rustleTimer);
  detail.classList.remove("is-open", "is-flipped");
  detail.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
  detailInner.querySelector(".back-scroll").scrollTop = 0;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    render(tab.dataset.category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelector("[data-flip]").addEventListener("click", () => {
  detail.classList.toggle("is-flipped");
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", closeDetail);
});

document.querySelector("[data-reset]").addEventListener("click", () => {
  tabs[0].click();
});

document.querySelector("[data-about-open]").addEventListener("click", () => {
  document.body.classList.add("about-open");
  aboutPanel.classList.add("is-open");
  aboutPanel.setAttribute("aria-hidden", "false");
});

document.querySelectorAll("[data-about-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.remove("about-open");
    aboutPanel.classList.remove("is-open");
    aboutPanel.setAttribute("aria-hidden", "true");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDetail();
    document.body.classList.remove("about-open");
    aboutPanel.classList.remove("is-open");
  }
});

renderAbout();
render("all");
