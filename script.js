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
let currentProject = null;
const aboutAudio = new Audio("sound/about.mp3");
aboutAudio.loop = true;

const categoryTapSounds = {
  1: "sound/category tap 01.mp3",
  2: "sound/category tap 02.mp3",
  3: "sound/category tap 03.mp3",
  4: "sound/category tap 04.mp3",
  5: "sound/category tap 05.mp3",
};

const cardFlipSounds = {
  1: "sound/card flip 01.mp3",
  2: "sound/card flip 02.mp3",
  3: "sound/card flip 03.wav",
  4: "sound/card flip 04.mp3",
  5: "sound/card flip 05.mp3",
};

const aboutContent = {
  name: "한지인",
  email: "giinhan@gmail.com",
  body: "나는 한지인이다",
};

const cardTextById = {
  "1-01": "일일",
  "2-01": "이일",
  "3-01": "삼일",
  "4-01": "사일",
  "5-01": "오일",
};

const imageRows = [
  { category: "1", path: "img/1 create/1-01.png" },
  { category: "1", path: "img/1 create/1-02.png" },
  { category: "1", path: "img/1 create/1-03.png" },
  { category: "2", path: "img/2 operate/2-01.JPG" },
  { category: "2", path: "img/2 operate/2-02.jpg" },
  { category: "3", path: "img/3 talk/3-01.png" },
  { category: "3", path: "img/3 talk/3-02.jpg" },
  { category: "4", path: "img/4 write/4-01.png" },
  { category: "4", path: "img/4 write/4-02.jpeg" },
  { category: "4", path: "img/4 write/4-03.jpeg" },
  { category: "5", path: "img/5 consult/5-01.png" },
];

const projects = imageRows.map((row, index) => {
  const fileName = row.path.split("/").pop();
  const id = fileName.replace(/\.[^.]+$/, "");
  return {
    id,
    category: row.category,
    title: id,
    tilt: `${[-4, 3, -2, 5, -5][index % 5]}deg`,
    image: row.path,
    thumbA: row.path,
    thumbB: row.path,
    copy: cardTextById[id] || "아카이브 카드 설명을 준비 중입니다.",
  };
});

function render(category = "all") {
  grid.innerHTML = "";
  const filtered =
    category === "all" ? projects : projects.filter((project) => project.category === category);
  shuffle(filtered).forEach((project) => {
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

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function openDetail(project) {
  currentProject = project;
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
}

function playSound(src) {
  if (!src) {
    return;
  }

  const audio = new Audio(src);
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playAboutAudio() {
  aboutAudio.currentTime = 0;
  aboutAudio.play().catch(() => {});
}

function stopAboutAudio() {
  aboutAudio.pause();
  aboutAudio.currentTime = 0;
}

function renderAbout() {
  aboutName.textContent = aboutContent.name;
  aboutBody.textContent = aboutContent.body;
  aboutEmail.textContent = aboutContent.email;
  aboutEmail.href = `mailto:${aboutContent.email}`;
}

function closeDetail() {
  currentProject = null;
  detail.classList.remove("is-open", "is-flipped");
  detail.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
  detailInner.querySelector(".back-scroll").scrollTop = 0;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    playSound(categoryTapSounds[tab.dataset.category]);
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    render(tab.dataset.category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelector("[data-flip]").addEventListener("click", () => {
  playSound(cardFlipSounds[currentProject?.category]);
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
  playAboutAudio();
});

document.querySelectorAll("[data-about-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.remove("about-open");
    aboutPanel.classList.remove("is-open");
    aboutPanel.setAttribute("aria-hidden", "true");
    stopAboutAudio();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDetail();
    document.body.classList.remove("about-open");
    aboutPanel.classList.remove("is-open");
    aboutPanel.setAttribute("aria-hidden", "true");
    stopAboutAudio();
  }
});

renderAbout();
render("all");
