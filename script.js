const grid = document.querySelector("[data-grid]");
const detail = document.querySelector("[data-detail]");
const detailInner = document.querySelector("[data-detail-inner]");
const detailImage = document.querySelector("[data-detail-image]");
const detailTags = document.querySelector("[data-detail-tags]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailCopy = document.querySelector("[data-detail-copy]");
const detailMedia = document.querySelector("[data-detail-media]");
const detailScrollArea = detailInner.querySelector(".back-scroll");
const detailScrollbar = document.querySelector("[data-detail-scrollbar]");
const detailScrollbarThumb = document.querySelector("[data-detail-scrollbar-thumb]");
const tabs = document.querySelectorAll("[data-category]");
const aboutPanel = document.querySelector("[data-about-panel]");
const aboutName = document.querySelector("[data-about-name]");
const aboutBody = document.querySelector("[data-about-body]");
const aboutEmail = document.querySelector("[data-about-email]");
let currentProject = null;
let projects = [];
let detailRotation = 0;
const dominantColorByImage = new Map();
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

function numberedMedia(folder, prefix, numbers, extension) {
  return numbers.map((number) => `${folder}/${prefix}-${number}.${extension}`);
}

const imageRows = [
  {
    category: "1",
    path: "img/1 create/1-01/1-01.png",
    backMedia: numberedMedia("img/1 create/1-01", "1-01", [1, 2], "png"),
  },
  {
    category: "1",
    path: "img/1 create/1-02/1-02.jpg",
    backMedia: numberedMedia("img/1 create/1-02", "1-02", [1, 2, 3, 4, 5, 6, 7, 8, 9], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-03/1-03.jpg",
    backMedia: [
      ...numberedMedia("img/1 create/1-03", "1-03", [1, 2, 3, 4], "png"),
      "img/1 create/1-03/1-03-5.jpg",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-04/1-04.png",
    backMedia: [
      "img/1 create/1-04/1-04-1-small.mov",
      "img/1 create/1-04/1-04-2.png",
      "img/1 create/1-04/1-04-3.JPG",
      "img/1 create/1-04/1-04-4.JPG",
      "img/1 create/1-04/1-04-5.JPG",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-05/1-05.png",
    backMedia: [
      "img/1 create/1-05/1-05-1.png",
      "img/1 create/1-05/1-05-2.png",
      "img/1 create/1-05/1-05-3.png",
      "img/1 create/1-05/1-05-4.JPG",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-06/1-06.jpg",
    backMedia: [
      "img/1 create/1-06/1-06-1.jpg",
      "img/1 create/1-06/1-06-1-2.jpg",
      "img/1 create/1-06/1-06-2.jpg",
      "img/1 create/1-06/1-06-2-2.jpg",
      "img/1 create/1-06/1-06-3.jpg",
      "img/1 create/1-06/1-06-3-2.jpg",
      "img/1 create/1-06/1-06-4.jpg",
      "img/1 create/1-06/1-06-4-2.jpg",
      "img/1 create/1-06/1-06-5.jpg",
      "img/1 create/1-06/1-06-5-2.jpg",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-07/1-07.jpg",
    backMedia: [
      "img/1 create/1-07/1-07-0.jpg",
      "img/1 create/1-07/1-07-1.png",
      ...numberedMedia("img/1 create/1-07", "1-07", [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "jpg"),
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-08/1-08.png",
    backMedia: [
      ...numberedMedia("img/1 create/1-08", "1-08", [1, 2], "jpg"),
      ...numberedMedia("img/1 create/1-08", "1-08", [3, 4, 5, 6], "png"),
      ...numberedMedia("img/1 create/1-08", "1-08", [7, 8, 9, 10, 11, 12, 13, 14], "jpg"),
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-09/1-09.jpg",
    backMedia: [
      ...numberedMedia("img/1 create/1-09", "1-09", [1, 2], "jpg"),
      "img/1 create/1-09/1-09-3.PNG",
      "img/1 create/1-09/1-09-4.PNG",
      "img/1 create/1-09/1-09-5.png",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-10/1-10.jpg",
    backMedia: ["img/1 create/1-10/40-2.png", "img/1 create/1-10/40-3.png"],
  },
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

const layoutProfiles = [
  { tilt: -7, x: 0, y: 0 },
  { tilt: 4, x: -8, y: 24 },
  { tilt: -2, x: 10, y: -14 },
  { tilt: 8, x: -5, y: 36 },
  { tilt: -5, x: 7, y: 8 },
  { tilt: 2, x: -11, y: -24 },
  { tilt: -9, x: 5, y: 18 },
  { tilt: 6, x: -4, y: -8 },
  { tilt: -3, x: 12, y: 30 },
  { tilt: 5, x: -9, y: -18 },
  { tilt: -6, x: 3, y: 12 },
];

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

function getRowTags(row) {
  return Object.keys(row)
    .filter((key) => /^tag(?:\s*\d+)?$/i.test(String(key).trim()))
    .map((key) => String(row[key] || "").trim())
    .filter(Boolean);
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
        tags: getRowTags(row),
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
    const layout = layoutProfiles[index % layoutProfiles.length];

    return {
      id,
      category: row.category,
      title: content.backHeading || id,
      tilt: layout.tilt,
      staggerX: layout.x,
      staggerY: layout.y,
      image: row.path,
      backMedia: row.backMedia || [],
      copy: content.backBody || "아카이브 카드 설명을 준비 중입니다.",
      tags: content.tags || [],
    };
  });
}

function render(category = "all") {
  grid.innerHTML = "";
  const filtered =
    category === "all" ? projects : projects.filter((project) => project.category === category);
  arrangeCards(filtered).forEach((project) => {
    const card = document.createElement("button");
    card.className = "project-card";
    card.type = "button";
    card.style.setProperty("--tilt", `${project.tilt}deg`);
    card.style.setProperty("--stagger-x", `${project.staggerX}px`);
    card.style.setProperty("--stagger-y", `${project.staggerY}px`);
    card.setAttribute("aria-label", `${project.title} 크게 보기`);
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.title;
    image.addEventListener("load", () => applyFrontImageScale(card, image), { once: true });

    card.append(image);
    card.addEventListener("click", () => openDetail(project));
    grid.appendChild(card);
  });
}

function applyFrontImageScale(card, image) {
  const ratio = image.naturalWidth / image.naturalHeight;
  const scale = ratio >= 1.18 ? 1.3 : ratio >= 0.92 ? 1.12 : 1;

  card.style.setProperty("--card-scale", scale);
}

function arrangeCards(items) {
  const remaining = shuffle(items);
  const arranged = [];

  while (remaining.length) {
    let bestIndex = 0;
    let bestScore = -Infinity;

    remaining.forEach((project, index) => {
      const previous = arranged[arranged.length - 1];
      const beforePrevious = arranged[arranged.length - 2];
      const sameDirectionPenalty = previous && Math.sign(project.tilt) === Math.sign(previous.tilt) ? 12 : 0;
      const closeTiltPenalty = previous ? Math.max(0, 7 - Math.abs(project.tilt - previous.tilt)) * 2 : 0;
      const secondNeighborPenalty =
        beforePrevious && Math.sign(project.tilt) === Math.sign(beforePrevious.tilt) ? 5 : 0;
      const offsetReward = previous ? Math.abs(project.staggerY - previous.staggerY) * 0.2 : 0;
      const score = offsetReward - sameDirectionPenalty - closeTiltPenalty - secondNeighborPenalty;

      if (score > bestScore) {
        bestIndex = index;
        bestScore = score;
      }
    });

    arranged.push(remaining.splice(bestIndex, 1)[0]);
  }

  return arranged;
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
  pauseDetailMedia();
  currentProject = project;
  detailRotation = 0;
  detail.classList.remove("is-flipped");
  detailInner.style.transform = "rotateY(0deg)";
  detail.style.setProperty("--scrollbar-color", "#111");
  detailImage.src = project.image;
  detailImage.alt = project.title;
  applyScrollbarColor(project);
  renderTags(detailTags, project.tags);
  renderLinkedText(detailTitle, project.title);
  renderLinkedText(detailCopy, project.copy);
  renderDetailMedia(project);
  detail.setAttribute("aria-hidden", "false");
  detail.classList.add("is-open");
  document.body.classList.add("detail-open");
  requestAnimationFrame(syncDetailScrollbar);
}

function renderDetailMedia(project) {
  detailMedia.innerHTML = "";
  detailMedia.hidden = !project.backMedia.length;

  project.backMedia.forEach((src, index) => {
    const isVideo = /\.(mov|mp4|webm|m4v)$/i.test(src);
    const element = document.createElement(isVideo ? "video" : "img");

    element.src = src;

    if (isVideo) {
      element.controls = true;
      element.muted = true;
      element.playsInline = true;
      element.preload = "metadata";
    } else {
      element.alt = `${project.title} back image ${index + 1}`;
    }

    element.addEventListener("load", syncDetailScrollbar);
    element.addEventListener("loadedmetadata", syncDetailScrollbar);
    detailMedia.appendChild(element);
  });
}

function pauseDetailMedia() {
  detailMedia.querySelectorAll("video, audio").forEach((media) => {
    media.pause();
    media.currentTime = 0;
  });
}

function renderTags(element, tags) {
  element.innerHTML = "";
  element.hidden = !tags.length;

  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.className = "back-tag";
    item.textContent = tag;
    element.appendChild(item);
  });
}

async function applyScrollbarColor(project) {
  const color = await getDominantImageColor(project.image);

  if (currentProject?.id === project.id) {
    detail.style.setProperty("--scrollbar-color", color);
  }
}

function getDominantImageColor(src) {
  if (dominantColorByImage.has(src)) {
    return Promise.resolve(dominantColorByImage.get(src));
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const color = sampleDominantColor(image);
      dominantColorByImage.set(src, color);
      resolve(color);
    };
    image.onerror = () => {
      resolve("#111");
    };
    image.src = src;
  });
}

function sampleDominantColor(image) {
  const size = 72;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const buckets = new Map();

  canvas.width = size;
  canvas.height = size;
  context.drawImage(image, 0, 0, size, size);

  const pixels = context.getImageData(0, 0, size, size).data;

  for (let index = 0; index < pixels.length; index += 16) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const brightness = (red + green + blue) / 3;
    const saturation = max - min;

    if (alpha < 180 || brightness < 35 || brightness > 235 || saturation < 18) {
      continue;
    }

    const key = `${Math.round(red / 24) * 24},${Math.round(green / 24) * 24},${
      Math.round(blue / 24) * 24
    }`;
    buckets.set(key, (buckets.get(key) || 0) + saturation + 24);
  }

  let selected = "";
  let selectedScore = 0;

  buckets.forEach((score, key) => {
    if (score > selectedScore) {
      selected = key;
      selectedScore = score;
    }
  });

  if (!selected) {
    return "#111";
  }

  const [red, green, blue] = selected.split(",").map(Number);
  return `rgb(${red}, ${green}, ${blue})`;
}

function renderLinkedText(element, text) {
  const urlPattern =
    /((?:https?:\/\/|www\.)[^\s<>()]+|(?:[a-z0-9-]+\.)+(?:com|co\.kr|kr|net|org|io|ai|edu|gov|co|me|design|studio|xyz)(?:\/[^\s<>()]*)?)/gi;
  element.textContent = "";

  String(text)
    .split(urlPattern)
    .filter((part) => part !== "")
    .forEach((part) => {
      if (urlPattern.test(part)) {
        urlPattern.lastIndex = 0;
        const trailingMatch = part.match(/[.,;:!?)]$/);
        const trailingText = trailingMatch ? trailingMatch[0] : "";
        const urlText = trailingText ? part.slice(0, -1) : part;
        const link = document.createElement("a");
        link.href = /^https?:\/\//i.test(urlText) ? urlText : `https://${urlText}`;
        link.textContent = urlText;
        link.target = "_blank";
        link.rel = "noreferrer";
        element.appendChild(link);

        if (trailingText) {
          element.appendChild(document.createTextNode(trailingText));
        }
        return;
      }

      urlPattern.lastIndex = 0;
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
  pauseDetailMedia();
  currentProject = null;
  detail.classList.remove("is-open", "is-flipped");
  detail.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
  detailScrollArea.scrollTop = 0;
  syncDetailScrollbar();
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
  const isShowingBack = detail.classList.toggle("is-flipped");

  if (!isShowingBack) {
    pauseDetailMedia();
  }
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

function syncDetailScrollbar() {
  const maxScrollTop = detailScrollArea.scrollHeight - detailScrollArea.clientHeight;
  const trackInset = 20;
  const trackHeight = detailScrollbar.clientHeight - trackInset * 2;

  detailScrollbar.hidden = maxScrollTop <= 0;

  if (detailScrollbar.hidden) {
    return;
  }

  const thumbHeight = Math.max(72, (detailScrollArea.clientHeight / detailScrollArea.scrollHeight) * trackHeight);
  const maxThumbTop = trackHeight - thumbHeight;
  const thumbTop = trackInset + (detailScrollArea.scrollTop / maxScrollTop) * maxThumbTop;

  detailScrollbarThumb.style.height = `${thumbHeight}px`;
  detailScrollbarThumb.style.transform = `translateY(${thumbTop - trackInset}px)`;
}

detailScrollArea.addEventListener("scroll", syncDetailScrollbar);
window.addEventListener("resize", syncDetailScrollbar);
detailScrollArea.addEventListener(
  "wheel",
  (event) => {
    const scrollArea = event.currentTarget;
    const direction = Math.sign(event.deltaY);

    if (!direction) {
      return;
    }

    event.preventDefault();
    scrollArea.scrollTop += direction * 28;
  },
  { passive: false },
);

detailScrollbar.addEventListener("pointerdown", (event) => {
  event.preventDefault();

  if (event.target === detailScrollbarThumb) {
    const startY = event.clientY;
    const startScrollTop = detailScrollArea.scrollTop;

    function handleMove(moveEvent) {
      const maxScrollTop = detailScrollArea.scrollHeight - detailScrollArea.clientHeight;
      const trackHeight = detailScrollbar.clientHeight - 40;
      const thumbHeight = detailScrollbarThumb.offsetHeight;
      const maxThumbTop = trackHeight - thumbHeight;
      const delta = moveEvent.clientY - startY;

      detailScrollArea.scrollTop = startScrollTop + (delta / maxThumbTop) * maxScrollTop;
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return;
  }

  const direction = event.clientY < detailScrollbarThumb.getBoundingClientRect().top ? -1 : 1;
  detailScrollArea.scrollTop += direction * 84;
});

async function init() {
  const cardContentById = await loadCardContent();
  projects = createProjects(cardContentById);
  renderAbout();
  render("all");
}

init();
