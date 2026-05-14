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
let projects = [];
let detailRotation = 0;
const aboutAudio = new Audio("sound/about.mp3");
aboutAudio.loop = true;

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

const fallbackCardContentById = {
  "1-01": {
    backHeading: '파타고니아 코리아 환경 캠페인 "지천구곡: 우리를 살게하는 강"',
    backBody: `파타고니아 코리아가 힘을 실어주는 댐 건설 반대 캠페인을 함께 제작했습니다. 지천은 너무나 아름다운 것들이 풍성하게 담겨있는 충청남도 청양의 소중한 물입니다. 흐르는 구석구석마다 사람과 동물, 식물- 모든 생명에게 살아갈 힘과 재료를 아낌없이 주는 지천을 지키기 위해 오랫동안 이어온 이야기에 파타고니아 코리아, 그리고 여러 동료들과 함께 힘을 실어 바이럴을 만들고 서명을 모아 전달했습니다.

캠페인 사이트
https://www.patagonia.co.kr/activismHub/JiRiver

제작 항목 | 캠페인 숏츠/릴스 5편, 웹사이트 이미지, 포스터, 리플렛
기획 | 오늘의풍경 신인아, 한지인, 팀도밍고 김도형
인터뷰&버벌브랜딩 | 한지인
영상 | 팀도밍고 김도형, 김하연, 오수민, 심현빈
사진 | 임효진
디자인 | 신인아, 김영인
레터링 | 박부미
협조 | 마을문화연구소 김명숙, 위로책방 이민주, 청양전통시장상인회장 심준보, 푸드카빙 정길순, 농부 김진환`,
  },
};

const imageRows = [
  { category: "1", path: "img/1 create/1-01.png" },
  { category: "1", path: "img/1 create/1-02.png" },
  { category: "1", path: "img/1 create/1-03.png" },
  { category: "2", path: "img/2 operate/2-01.jpg" },
  { category: "2", path: "img/2 operate/2-02.jpg" },
  { category: "3", path: "img/3 write/3-01.png" },
  { category: "3", path: "img/3 write/3-02.jpeg" },
  { category: "3", path: "img/3 write/3-03.jpeg" },
  { category: "4", path: "img/4 talk/4-01.png" },
  { category: "4", path: "img/4 talk/4-02.jpg" },
  { category: "5", path: "img/5 consult/5-01.png" },
];

const categoryNumberByName = {
  create: "1",
  operate: "2",
  write: "3",
  talk: "4",
  consult: "5",
};

function normalizeCardNumber(value) {
  return String(value ?? "")
    .trim()
    .padStart(2, "0");
}

function getCardId(category, card) {
  const categoryNumber = categoryNumberByName[String(category).trim().toLowerCase()] || String(category).trim();
  const cardNumber = normalizeCardNumber(card);
  return categoryNumber && cardNumber ? `${categoryNumber}-${cardNumber}` : "";
}

async function loadCardContent() {
  if (!window.XLSX) {
    return fallbackCardContentById;
  }

  try {
    const response = await fetch("txt/Book1.xlsx", { cache: "no-store" });
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets.Cards || workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    const contentById = { ...fallbackCardContentById };
    let currentCategory = "";

    rows.forEach((row) => {
      const rowCategory = String(row.category || "").trim();
      if (rowCategory) {
        currentCategory = rowCategory;
      }

      const id = getCardId(currentCategory, row.card);
      if (!id) {
        return;
      }

      contentById[id] = {
        backHeading: row["back heading"] || contentById[id]?.backHeading || id,
        backBody: row["back  body"] || row["back body"] || contentById[id]?.backBody || "",
      };
    });

    return contentById;
  } catch (error) {
    console.warn("Book1.xlsx could not be loaded.", error);
    return fallbackCardContentById;
  }
}

function createProjects(cardContentById) {
  return imageRows.map((row, index) => {
    const fileName = row.path.split("/").pop();
    const id = fileName.replace(/\.[^.]+$/, "");
    const content = cardContentById[id] || {};

    return {
      id,
      category: row.category,
      title: content.backHeading || id,
      tilt: `${[-4, 3, -2, 5, -5][index % 5]}deg`,
      image: row.path,
      thumbA: row.path,
      thumbB: row.path,
      copy: content.backBody || "아카이브 카드 설명을 준비 중입니다.",
    };
  });
}

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
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.title;

    card.append(image);
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
  detailRotation = 0;
  detail.classList.remove("is-flipped");
  detailInner.style.transform = "rotateY(0deg)";
  detailImage.src = project.image;
  detailImage.alt = project.title;
  detailTitle.textContent = project.title;
  renderLinkedText(detailCopy, project.copy);
  detailThumbA.src = project.thumbA;
  detailThumbB.src = project.thumbB;
  detailThumbA.alt = `${project.title} detail image A`;
  detailThumbB.alt = `${project.title} detail image B`;
  detail.setAttribute("aria-hidden", "false");
  detail.classList.add("is-open");
  document.body.classList.add("detail-open");
}

function renderLinkedText(element, text) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urlOnlyPattern = /^https?:\/\/[^\s]+$/;
  element.textContent = "";

  String(text).split(urlPattern).forEach((part) => {
    if (urlOnlyPattern.test(part)) {
      const link = document.createElement("a");
      link.href = part;
      link.textContent = part;
      link.target = "_blank";
      link.rel = "noreferrer";
      element.appendChild(link);
      return;
    }

    element.appendChild(document.createTextNode(part));
  });
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
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    render(tab.dataset.category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelector("[data-flip]").addEventListener("click", () => {
  playSound(cardFlipSounds[currentProject?.category]);
  detailRotation += 180;
  detailInner.style.transform = `rotateY(${detailRotation}deg)`;
  detail.classList.toggle("is-flipped");
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentProject && button.closest("[data-detail]")) {
      playSound(cardFlipSounds[currentProject.category]);
    }

    closeDetail();
  });
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

async function init() {
  const cardContentById = await loadCardContent();
  projects = createProjects(cardContentById);
  renderAbout();
  render("all");
}

init();
