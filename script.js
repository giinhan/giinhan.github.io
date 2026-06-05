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
const aboutBody = document.querySelector("[data-about-body]");
const aboutLangButtons = document.querySelectorAll("[data-about-lang]");
const aboutBalls = [...document.querySelectorAll(".about-ball")];
const aboutTimeToggle = document.querySelector("[data-about-time-toggle]");
let currentProject = null;
let projects = [];
let cardListRows = [];
let currentListCategory = "";
let listSort = { key: "", direction: "" };
let detailRotation = 0;
const dominantColorByImage = new Map();
let renderSequence = 0;
const aboutAudio = new Audio("sound/about.mp3");
aboutAudio.loop = true;
let aboutMotionPlaying = true;
let aboutMotionFrame = null;
let aboutMotionLastTime = 0;

const cardFlipSounds = [
  "sound/card flip 01.mp3",
  "sound/card flip 02.mp3",
  "sound/card flip 03.wav",
  "sound/card flip 04.mp3",
  "sound/card flip 05.mp3",
];

const workbookPath = "txt/giinhan txt.xlsx?v=20260605-01";
const assetVersion = "20260605-01";
const eagerImageLoadCount = 16;
const imageLoadStagger = 85;
const listViewCategories = new Set(["3", "4", "5"]);

const fallbackAboutContent = {
  name: "한지인",
  email: "giinhan@gmail.com",
  body: "나는 한지인이다",
};

const aboutDocumentPaths = {
  kor: "txt/about-kor.docx?v=20260527-03",
  eng: "txt/about-eng.docx?v=20260527-03",
  jpn: "txt/about-jpn.docx?v=20260527-03",
  chn: "txt/about-chn.docx?v=20260527-03",
};

function versionAsset(src) {
  if (/^(?:https?:)?\/\//i.test(src) || src.includes("?")) {
    return src;
  }

  return `${src}?v=${assetVersion}`;
}

const frontImageDimensions = {
  "img/1 create/1-01/1-01.jpg": [1000, 1667],
  "img/1 create/1-02/1-02.jpg": [1200, 1500],
  "img/1 create/1-03/1-03.jpg": [1200, 1525],
  "img/1 create/1-04/1-04.png": [1200, 1703],
  "img/1 create/1-05/1-05.png": [1200, 1715],
  "img/1 create/1-06/1-06.jpg": [1200, 1500],
  "img/1 create/1-07/1-07.jpg": [1200, 1200],
  "img/1 create/1-08/1-08.png": [1200, 1689],
  "img/1 create/1-09/1-09.jpg": [1200, 1200],
  "img/1 create/1-10/1-10.jpg": [1200, 1500],
  "img/1 create/1-11/1-11.png": [1200, 1431],
  "img/1 create/1-12/1-12.png": [1200, 1358],
  "img/1 create/1-13/1-13.JPG": [1200, 1136],
  "img/1 create/1-14/1-14.jpg": [1200, 1285],
  "img/1 create/1-15/1-15.JPG": [1200, 1600],
  "img/1 create/1-16/1-16.JPG": [1200, 1200],
  "img/1 create/1-17/1-17.JPG": [1200, 1800],
  "img/1 create/1-18/1-18.JPG": [1200, 1804],
  "img/1 create/1-19/1-19.jpg": [1200, 1697],
  "img/1 create/1-20/1-20.png": [1200, 1698],
  "img/1 create/1-21/1-47.jpg": [1080, 1350],
  "img/1 create/1-22/1-22.jpg": [1200, 1800],
  "img/1 create/1-23/1-23.jpg": [1200, 1500],
  "img/1 create/1-24/1-24.jpg": [1200, 1346],
  "img/1 create/1-25/1-25.png": [1200, 1205],
  "img/1 create/1-26/1-26.JPG": [1200, 1200],
  "img/1 create/1-27/1-27.JPG": [1200, 1364],
  "img/1 create/1-28/1-28.JPG": [1200, 1651],
  "img/1 create/1-29/1-29.jpg": [1200, 1374],
  "img/1 create/1-30/1-30.jpg": [1200, 1800],
  "img/1 create/1-31/1-31.JPG": [1200, 1240],
  "img/1 create/1-32/1-32.jpg": [1200, 1687],
  "img/1 create/1-33/1-33.png": [1200, 1200],
  "img/1 create/1-34/1-34.JPG": [1200, 1223],
  "img/1 create/1-35/1-35.jpg": [1200, 1234],
  "img/1 create/1-36/1-36.JPG": [1200, 1800],
  "img/1 create/1-37/1-37.JPG": [1200, 1442],
  "img/1 create/1-38/1-38.jpg": [500, 500],
  "img/1 create/1-39/1-39.jpg": [1200, 1697],
  "img/1 create/1-40/1-40.jpg": [1200, 800],
  "img/1 create/1-41/1-41.png": [1200, 1197],
  "img/1 create/1-42/1-42.png": [1200, 1406],
  "img/1 create/1-43/1-43.jpg": [1200, 1800],
  "img/1 create/1-44/1-44.jpg": [1200, 1696],
  "img/1 create/1-45/1-45.jpg": [1200, 656],
  "img/1 create/1-46/1-46.jpg": [1200, 1167],
  "img/1 create/1-47/1-47.jpg": [1200, 1568],
  "img/2 operate/2-01/2-01.jpg": [1200, 1200],
  "img/2 operate/2-02/2-02.jpg": [1200, 1694],
  "img/2 operate/2-03/2-03.jpg": [1200, 1200],
  "img/2 operate/2-04/2-04.png": [1200, 1200],
  "img/2 operate/2-05/2-05.jpeg": [1200, 1676],
  "img/2 operate/2-06/2-06.jpg": [1200, 1018],
  "img/2 operate/2-07/2-07.jpg": [1200, 1167],
  "img/2 operate/2-08/2-08.jpg": [1200, 900],
  "img/2 operate/2-09/2-09.JPG": [1200, 1268],
  "img/2 operate/2-10/2-10.png": [1200, 1437],
  "img/3 write/3-01/62.jpeg": [1200, 1890],
  "img/3 write/3-02/61.jpeg": [1200, 1763],
  "img/3 write/3-03/63.jpg": [1200, 1754],
  "img/3 write/3-04/3-04.png": [1200, 1527],
  "img/3 write/3-05/3-05.png": [1200, 1259],
  "img/4 talk/4-01/4-01.JPG": [1200, 901],
  "img/4 talk/4-02/64-3.jpg": [4032, 2268],
  "img/4 talk/4-03/64-4.JPG": [8256, 5504],
  "img/4 talk/4-04/64-5.jpg": [1083, 815],
  "img/4 talk/4-05/3-01.png": [978, 918],
  "img/5 consult/5-01/5-01.png": [1715, 1790],
  "img/5 consult/Screenshot 2026-05-21 at 11.00.54 AM.png": [1200, 869],
  "img/5 consult/5-10/1-21-0.png": [1200, 2001],
};

let aboutContentByLanguage = {
  kor: { ...fallbackAboutContent },
};
let currentAboutLanguage = "kor";

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

const aboutBallState = aboutBalls.map((element, index) => ({
  element,
  x: 90,
  y: 140,
  fromX: 90,
  fromY: 140,
  toX: 320,
  toY: 220,
  shotStart: 0,
  shotDuration: 900,
  shotSide: 1,
  spin: 0,
  rallySeed: 0.37,
  rallyIndex: 0,
  phase: index * 0.82,
}));

function numberedMedia(folder, prefix, numbers, extension) {
  return numbers.map((number) => `${folder}/${prefix}-${number}.${extension}`);
}

function mediaFiles(folder, files) {
  return files.map((file) => `${folder}/${file}`);
}

const imageRows = [
  {
    category: "1",
    path: "img/1 create/1-01/1-01.jpg",
    backMedia: numberedMedia("img/1 create/1-01", "1-01", [1, 2], "jpg"),
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
      "img/1 create/1-09/1-09-3.jpg",
      "img/1 create/1-09/1-09-4.jpg",
      "img/1 create/1-09/1-09-5.jpg",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-10/1-10.jpg",
    backMedia: numberedMedia("img/1 create/1-10", "1-10", [1, 2], "png"),
  },
  {
    category: "1",
    path: "img/1 create/1-11/1-11.png",
    backMedia: [
      "img/1 create/1-11/1-11-1.jpg",
      ...numberedMedia("img/1 create/1-11", "1-11", [2, 3, 4], "png"),
      "img/1 create/1-11/1-11-5.JPG",
    ],
  },
  {
    category: "1",
    path: "img/1 create/1-12/1-12.png",
    backMedia: mediaFiles("img/1 create/1-12", [
      "1-12-0.png",
      "1-12-1.jpg",
      "1-12-2.jpg",
      "1-12-3.jpg",
      "1-12-4.png",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-13/1-13.JPG",
    backMedia: mediaFiles("img/1 create/1-13", ["1-13-1.png", "1-13-2.jpg", "1-13-3.png", "1-13-4.png"]),
  },
  {
    category: "1",
    path: "img/1 create/1-14/1-14.jpg",
    backMedia: mediaFiles("img/1 create/1-14", [
      "1-14-1.jpg",
      "1-14-2.jpg",
      "1-14-3.jpg",
      "1-14-4.jpg",
      "1-14-5.jpg",
      "1-14-6.jpg",
      "1-14-7.png",
      "1-14-8.jpg",
      "Screenshot 2026-05-17 at 9.11.57 PM.png",
      "Screenshot 2026-05-17 at 9.12.14 PM.png",
      "Screenshot 2026-05-17 at 9.12.24 PM.png",
      "Screenshot 2026-05-17 at 9.13.03 PM.png",
      "Screenshot 2026-05-17 at 9.13.07 PM.png",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-15/1-15.JPG",
    backMedia: mediaFiles("img/1 create/1-15", ["1-15-1.jpg", "1-15-2.JPG", "1-15-3.JPG", "1-15-4.JPG", "1-15-5.JPG"]),
  },
  {
    category: "1",
    path: "img/1 create/1-16/1-16.JPG",
    backMedia: mediaFiles("img/1 create/1-16", [
      "1-16-0.jpg",
      "1-16-1.JPG",
      "1-16-2.JPG",
      "1-16-3.JPG",
      "1-16-4.JPG",
      "1-16-5.JPG",
      "1-16-6.jpg",
      "1-16-8.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-17/1-17.JPG",
    backMedia: mediaFiles("img/1 create/1-17", ["1-17-0.JPG", "1-17-1.JPG", "1-17-2.JPG", "1-17-3.JPG", "1-17-4.JPG", "1-17-5.JPG"]),
  },
  {
    category: "1",
    path: "img/1 create/1-18/1-18.JPG",
    backMedia: mediaFiles("img/1 create/1-18", [
      "1-18-1.JPG",
      "1-18-2.JPG",
      "1-18-3.jpg",
      "1-18-4.JPG",
      "1-18-5.JPG",
      "1-18-6.JPG",
      "1-18-7.JPG",
      "1-18-8.JPG",
      "1-18-9.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-19/1-19.jpg",
    backMedia: numberedMedia("img/1 create/1-19", "1-19", [1, 2, 3, 4, 5, 6, 7], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-20/1-20.png",
    backMedia: mediaFiles("img/1 create/1-20", [
      "1-20-1.png",
      "1-20-2.png",
      "1-20-3.jpg",
      "1-20-4.jpg",
      "1-20-5.png",
      "1-20-6.png",
      "1-20-7.png",
      "1-20-8.png",
      "1-20-9.jpg",
      "1-20-10.png",
    ]),
  },
  {
    category: "1",
    id: "1-21",
    path: "img/1 create/1-21/1-47.jpg",
    backMedia: mediaFiles("img/1 create/1-21", [
      "1-47-1.mp4",
      "1-47-2",
      "1-47-3.png",
      "1-47-4.jpeg",
      "1-47-5.png",
      "1-47-6.JPG",
      "1-47-7.png",
      "1-47-8.png",
      "1-47-9.jpg",
      "1-47-10.JPG",
      "1-47-11.jpeg",
      "1-47-12.JPG",
      "1-47-13.JPG",
      "1-47-14.JPG",
      "1-47-15.JPG",
      "1-47-16.JPG",
      "1-47-17.JPG",
      "1-47-18.JPG",
      "1-47-19.jpg",
      "1-47-20.jpg",
      "1-47-21.jpeg",
      "1-47-22.jpeg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-22/1-22.jpg",
    backMedia: numberedMedia("img/1 create/1-22", "1-22", [1, 2, 3, 4, 5], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-23/1-23.jpg",
    backMedia: numberedMedia("img/1 create/1-23", "1-23", [1, 2, 3], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-24/1-24.jpg",
    backMedia: mediaFiles("img/1 create/1-24", [
      "1-24-1.jpg",
      "1-24-2.jpg",
      "1-24-3.JPG",
      "1-24-4.JPG",
      "1-24-5.JPG",
      "1-24-6.JPG",
      "1-24-7.JPG",
      "1-24-8.jpg",
      "1-24-9.JPG",
      "1-24-10.JPG",
      "1-24-11.jpg",
      "1-24-12.jpg",
      "1-24-13.jpg",
      "1-24-14.png",
      "1-24-15.jpg",
      "1-24-16.JPG",
      "1-24-17.jpg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-25/1-25.png",
    backMedia: numberedMedia("img/1 create/1-25", "1-25", [0, 1, 2, 3, 4, 5], "png"),
  },
  {
    category: "1",
    path: "img/1 create/1-26/1-26.JPG",
    backMedia: mediaFiles("img/1 create/1-26", [
      "1-26-1.jpg",
      "1-26-2.JPG",
      "1-26-3.JPG",
      "1-26-4.JPG",
      "1-26-5.JPG",
      "1-26-6.JPG",
      "1-26-7.JPG",
      "1-26-8.JPG",
      "1-26-9.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-27/1-27.JPG",
    backMedia: mediaFiles("img/1 create/1-27", ["1-27-1.jpg", "1-27-2.JPG", "1-27-3.jpg", "1-27-4.JPG", "1-27-5.JPG", "1-27-6.JPG", "1-27-7.JPG"]),
  },
  {
    category: "1",
    path: "img/1 create/1-28/1-28.JPG",
    backMedia: mediaFiles("img/1 create/1-28", [
      "1-28-1.JPG",
      "1-28-2.JPG",
      "1-28-3.JPG",
      "1-28-4.JPG",
      "1-28-5.jpg",
      "1-28-6.JPG",
      "1-28-7.jpg",
      "1-28-8.jpg",
      "1-28-9.jpg",
      "1-28-10.jpg",
      "1-28-11.jpg",
      "1-28-12.jpg",
      "1-28-13.JPG",
      "1-28-14.jpg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-29/1-29.jpg",
    backMedia: numberedMedia("img/1 create/1-29", "1-29", [1, 2, 3], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-30/1-30.jpg",
    backMedia: mediaFiles("img/1 create/1-30", [
      "1-30-1.jpg",
      "1-30-2.jpg",
      "1-30-3.jpg",
      "1-30-4.jpg",
      "1-30-5.jpg",
      "1-30-6.jpg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-31/1-31.JPG",
    backMedia: mediaFiles("img/1 create/1-31", [
      "1-31-1.JPG",
      "1-31-2.JPG",
      "1-31-3.JPG",
      "1-31-4.JPG",
      "1-31-5.jpg",
      "1-31-6.JPG",
      "1-31-7.JPG",
      "1-31-8.JPG",
      "1-31-9.jpg",
      "1-31-10.JPG",
      "1-31-12.JPG",
      "1-31-13.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-32/1-32.jpg",
    backMedia: mediaFiles("img/1 create/1-32", ["1-32-1.JPG", "1-32-2.PNG"]),
  },
  {
    category: "1",
    path: "img/1 create/1-33/1-33.png",
    backMedia: mediaFiles("img/1 create/1-33", [
      "1-33-0.jpg",
      "1-33-1.jpg",
      "1-33-2.jpg",
      "1-33-3.mp4",
      "1-33-4.mp4",
      "1-33-5.JPG",
      "1-33-6.JPG",
      "1-33-7.JPG",
      "1-33-8.JPG",
      "1-33-9.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-34/1-34.JPG",
    backMedia: mediaFiles("img/1 create/1-34", [
      "1-34-1.JPG",
      "1-34-2.jpg",
      "1-34-3.JPG",
      "1-34-4.JPG",
      "1-34-5.JPG",
      "1-34-6.JPG",
      "1-34-7.JPG",
      "1-34-12.jpg",
      "1-34-13.jpg",
      "1-34-14.jpg",
      "1-34-15.JPG",
      "1-34-16.JPG",
      "1-34-17.JPG",
      "1-34-18",
      "1-34-19.png",
      "1-34-20.png",
      "1-34-21.png",
      "1-34-23.JPG",
      "1-34-24.JPG",
      "1-34-26.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-35/1-35.jpg",
    backMedia: numberedMedia("img/1 create/1-35", "1-35", [1, 2, 3, 4], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-36/1-36.JPG",
    backMedia: mediaFiles("img/1 create/1-36", [
      "1-36-1.JPG",
      "1-36-3.JPG",
      "1-36-4.JPG",
      "1-36-5.JPG",
      "1-36-6.JPG",
      "1-36-8.JPG",
      "1-36-9.JPG",
      "1-36-10.JPG",
      "1-36-11.JPG",
      "1-36-12.JPG",
      "1-36-13.JPG",
      "1-36-14.JPG",
      "1-36-15.JPG",
      "1-36-16.JPG",
      "1-36-17.jpg",
      "1-36-18.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-37/1-37.JPG",
    backMedia: mediaFiles("img/1 create/1-37", ["1-37-1.JPG", "1-37-2.JPG", "1-37-3.JPG", "1-37-4.jpg", "1-37-5.JPG"]),
  },
  {
    category: "1",
    path: "img/1 create/1-38/1-38.jpg",
    backMedia: mediaFiles("img/1 create/1-38", [
      "1-38-1.jpg",
      "1-38-2.JPG",
      "1-38-3.jpg",
      "1-38-4.jpg",
      "1-38-5.jpg",
      "1-38-6.jpg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-39/1-39.jpg",
    backMedia: mediaFiles("img/1 create/1-39", ["1-39-0.png", "1-39-1.JPG", "1-39-2.JPG", "1-39-3.jpg"]),
  },
  {
    category: "1",
    path: "img/1 create/1-40/1-40.jpg",
    backMedia: mediaFiles("img/1 create/1-40", [
      "1-40-2.JPG",
      "1-40-3.JPG",
      "1-40-4.JPG",
      "1-40-5.MOV",
      "1-40-6.png",
      "1-40-7.png",
      "1-40-8.png",
      "1-40-9.jpg",
      "1-40-10.JPG",
      "1-40-12.JPG",
      "1-40-13.JPG",
      "1-40-14.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-41/1-41.png",
    backMedia: numberedMedia("img/1 create/1-41", "1-41", [1, 2, 3, 4], "png"),
  },
  {
    category: "1",
    path: "img/1 create/1-42/1-42.png",
    backMedia: numberedMedia("img/1 create/1-42", "1-42", [1, 2], "png"),
  },
  {
    category: "1",
    path: "img/1 create/1-43/1-43.jpg",
    backMedia: mediaFiles("img/1 create/1-43", [
      "1-43-1-1.jpg",
      "1-43-1-2.jpg",
      "1-43-2.png",
      "1-43-3.png",
      "1-43-4.png",
      "1-43-5.png",
      "1-43-6.png",
      "1-43-7.JPG",
      "1-43-8.JPG",
      "1-43-9.JPG",
      "1-43-10.JPG",
      "1-43-11.JPG",
      "1-43-12.JPG",
      "1-43-13.JPG",
      "1-43-15.jpg",
      "1-43-16.jpg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-44/1-44.jpg",
    backMedia: numberedMedia("img/1 create/1-44", "1-44", [1, 2], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-45/1-45.jpg",
    backMedia: numberedMedia("img/1 create/1-45", "1-45", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-46/1-46.jpg",
    backMedia: mediaFiles("img/1 create/1-46", [
      "1-46-0.jpg",
      "1-46-1.jpg",
      "1-46-2.jpg",
      "1-46-3.jpg",
      "1-46-4.jpg",
      "1-46-5.jpg",
      "1-46-6.jpg",
      "1-46-7.jpg",
      "1-46-8.jpg",
      "1-46-9.jpg",
      "1-46-10.jpg",
      "1-46-11.JPG",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-47/1-47.jpg",
    backMedia: mediaFiles("img/1 create/1-47", [
      "1-47-1.JPG",
      "1-47-2.JPG",
      "1-47-3.JPG",
      "1-47-4.JPG",
      "1-47-5.JPG",
      "1-47-6.JPG",
      "1-47-7.JPG",
      "1-47-8.JPG",
      "1-47-9.JPG",
      "1-47-10.JPG",
      "1-47-11.jpg",
    ]),
  },
  {
    category: "1",
    path: "img/1 create/1-48/1-48.jpg",
    backMedia: numberedMedia("img/1 create/1-48", "1-48", [1, 2], "jpg"),
  },
  {
    category: "1",
    path: "img/1 create/1-49/1-49.jpg",
    backMedia: [
      "img/1 create/1-49/1-49-1.png",
      ...numberedMedia("img/1 create/1-49", "1-49", [2, 3, 4, 5], "jpg"),
    ],
  },
  {
    category: "2",
    path: "img/2 operate/2-01/2-01.jpg",
    backMedia: numberedMedia("img/2 operate/2-01", "2-01", [1, 2, 3, 4], "png").concat("img/2 operate/2-01/2-01-5.jpg"),
  },
  {
    category: "2",
    path: "img/2 operate/2-02/2-02.jpg",
    backMedia: mediaFiles("img/2 operate/2-02", ["2-02-0", "2-02-1.JPG", "2-02-2.png", "2-02-3.JPG", "2-02-4.png"]),
  },
  {
    category: "2",
    path: "img/2 operate/2-03/2-03.jpg",
    backMedia: mediaFiles("img/2 operate/2-03", ["2-03-0.jpg"]).concat(
      numberedMedia("img/2 operate/2-03", "2-03", [1, 2, 3], "jpg"),
      "img/2 operate/2-03/2-03-4.JPG",
      "img/2 operate/2-03/2-03-5.jpg",
      "img/2 operate/2-03/2-03-6.jpg",
    ),
  },
  {
    category: "2",
    id: "2-04",
    path: "img/2 operate/2-04/2-04.png",
    backMedia: mediaFiles("img/2 operate/2-04", ["2-04-1.png", "2-04-2.jpg", "2-04-3.jpg", "2-04-4.jpg"]),
  },
  {
    category: "2",
    id: "2-05",
    path: "img/2 operate/2-05/2-05.jpeg",
    backMedia: mediaFiles("img/2 operate/2-05", [
      "2-05-0.jpg",
      "2-05-1.jpg",
      "2-05-2.jpg",
      "2-05-3.jpg",
      "2-05-4.jpg",
      "2-05-5.JPG",
      "2-05-6.jpg",
      "2-05-7.jpg",
    ]),
  },
  {
    category: "2",
    path: "img/2 operate/2-06/2-06.jpg",
    backMedia: mediaFiles("img/2 operate/2-06", ["2-06-1.mp4", "2-06-2.jpg", "2-06-3.jpg", "2-06-4.jpg"]),
  },
  {
    category: "2",
    path: "img/2 operate/2-07/2-07.jpg",
    backMedia: numberedMedia("img/2 operate/2-07", "2-07", [1, 2, 3, 4, 5], "jpg"),
  },
  {
    category: "2",
    path: "img/2 operate/2-08/2-08.jpg",
    backMedia: mediaFiles("img/2 operate/2-08", [
      "2-08-1.jpg",
      "2-08-2.jpg",
      "2-08-3.jpg",
      "2-08-4.JPG",
      "2-08-5.JPG",
      "2-08-6.jpg",
      "2-08-7.jpg",
      "2-08-8.png",
    ]),
  },
  {
    category: "2",
    path: "img/2 operate/2-09/2-09.JPG",
    backMedia: mediaFiles("img/2 operate/2-09", ["2-09-1.JPG", "2-09-2.JPG"]),
  },
  {
    category: "2",
    path: "img/2 operate/2-10/2-10.png",
    backMedia: numberedMedia("img/2 operate/2-10", "2-10", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "jpg"),
  },
  { category: "3", id: "3-01", path: "img/3 write/3-01/62.jpeg" },
  { category: "3", id: "3-02", path: "img/3 write/3-02/61.jpeg" },
  { category: "3", id: "3-03", path: "img/3 write/3-03/63.jpg" },
  { category: "3", id: "3-04", path: "img/3 write/3-04/3-04.png" },
  { category: "3", id: "3-05", path: "img/3 write/3-05/3-05.png" },
  {
    category: "4",
    path: "img/4 talk/4-01/4-01.JPG",
    backMedia: mediaFiles("img/4 talk/4-01", ["4-01-1.JPG", "4-01-2.jpg"]),
  },
  { category: "4", id: "4-02", path: "img/4 talk/4-02/64-3.jpg" },
  { category: "4", id: "4-03", path: "img/4 talk/4-03/64-4.JPG" },
  { category: "4", id: "4-04", path: "img/4 talk/4-04/64-5.jpg", backMedia: ["img/4 talk/4-04/3-02.jpg"] },
  { category: "4", id: "4-05", path: "img/4 talk/4-05/3-01.png" },
  { category: "5", path: "img/5 consult/5-01/5-01.png" },
  { category: "5", id: "5-02", path: "img/5 consult/Screenshot 2026-05-21 at 11.00.54 AM.png" },
  {
    category: "5",
    id: "5-10",
    path: "img/5 consult/5-10/1-21-0.png",
    backMedia: mediaFiles("img/5 consult/5-10", [
      "1-21-1",
      "1-21-2.png",
      "1-21-3.png",
      "1-21-4.png",
      "1-21-5.png",
      "1-21-6.png",
      "1-21-7.png",
      "1-21-8.jpg",
    ]),
  },
];

const categoryNumberByName = {
  create: "1",
  operate: "2",
  write: "3",
  talk: "4",
  consult: "5",
  council: "5",
  counsil: "5",
};

const layoutProfiles = [
  { tilt: -4, x: 0, y: 0 },
  { tilt: 2.5, x: -6, y: 24 },
  { tilt: -1.5, x: 8, y: -14 },
  { tilt: 4.5, x: -4, y: 36 },
  { tilt: -3, x: 5, y: 8 },
  { tilt: 1.5, x: -8, y: -24 },
  { tilt: -5, x: 4, y: 18 },
  { tilt: 3.5, x: -3, y: -8 },
  { tilt: -2, x: 9, y: 30 },
  { tilt: 3, x: -7, y: -18 },
  { tilt: -3.5, x: 2, y: 12 },
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

function getRowYears(row) {
  return String(row.year || "")
    .split(",")
    .map((year) => year.trim())
    .filter(Boolean);
}

function getCell(rows, cell) {
  const column = cell.match(/[A-Z]+/)?.[0];
  const row = Number(cell.match(/\d+/)?.[0]) - 1;
  const columnIndex = column
    .split("")
    .reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;

  return String(rows[row]?.[columnIndex] || "").trim();
}

function normalizeWorkbookRows(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
}

function normalizeWorkbookGrid(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false, blankrows: false });
}

function getCategoryNumber(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return categoryNumberByName[normalized] || normalized;
}

function createListLinkParts(text, link) {
  const label = String(text || "").trim();
  const url = String(link || "").trim();

  if (!label) {
    return [];
  }

  if (!url) {
    return [{ label, url: "" }];
  }

  const reviewMatch = label.match(/^후기\s+(.+)$/);
  if (reviewMatch) {
    return [
      { label: "후기", url: "" },
      { label: reviewMatch[1].trim(), url },
    ];
  }

  return [{ label, url }];
}

function normalizeCardListRows(sheet) {
  if (!sheet) {
    return [];
  }

  const rows = normalizeWorkbookGrid(sheet);
  let currentCategory = "";
  const items = [];

  rows.slice(1).forEach((row) => {
    const [
      category = "",
      what = "",
      year = "",
      slash = "",
      linkText = "",
      link = "",
      note = "",
    ] = row;
    const rowCategory = getCategoryNumber(category);
    const itemTitle = String(what || "").trim();
    const plusText = String(linkText || "").trim();
    const linkUrl = String(link || "").trim();

    if (rowCategory) {
      currentCategory = rowCategory;
    }

    if (!itemTitle && !year && !slash && !note && plusText && items.length > 0) {
      items[items.length - 1].linkParts.push(...createListLinkParts(plusText, linkUrl));
      return;
    }

    const item = {
      category: currentCategory,
      id: "",
      what: itemTitle,
      when: String(year || "").trim(),
      slash: String(slash || "").trim(),
      plusText,
      link: linkUrl,
      linkParts: createListLinkParts(plusText, linkUrl),
      isListNote: itemTitle.startsWith("*영리기반 개인/기업 컨설팅 내역"),
      note: String(note || "").trim(),
    };

    const hasVisibleContent = Boolean(item.what || item.when || item.slash || item.plusText || item.note);
    if (item.category && hasVisibleContent) {
      items.push(item);
    }
  });

  return items;
}

function getCardNumber(row, currentCategory, lastCardNumber, hasContent) {
  const explicitCard = String(row.card || "").trim();

  if (explicitCard) {
    return explicitCard;
  }

  if (!currentCategory || !hasContent || !lastCardNumber) {
    return "";
  }

  return String(lastCardNumber + 1).padStart(2, "0");
}

function decodeXmlEntities(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

async function inflateRaw(bytes) {
  if (!("DecompressionStream" in window)) {
    throw new Error("DecompressionStream is not supported in this browser.");
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipTextFile(buffer, targetPath) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder("utf-8");
  let offset = 0;

  while (offset < view.byteLength - 30) {
    if (view.getUint32(offset, true) !== 0x04034b50) {
      offset += 1;
      continue;
    }

    const compressionMethod = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const fileNameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const fileNameStart = offset + 30;
    const fileNameEnd = fileNameStart + fileNameLength;
    const fileName = decoder.decode(bytes.slice(fileNameStart, fileNameEnd));
    const dataStart = fileNameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (fileName === targetPath) {
      const fileBytes = bytes.slice(dataStart, dataEnd);
      if (compressionMethod === 0) {
        return decoder.decode(fileBytes);
      }
      if (compressionMethod === 8) {
        return decoder.decode(await inflateRaw(fileBytes));
      }
      throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`);
    }

    offset = dataEnd;
  }

  throw new Error(`${targetPath} was not found in the ZIP archive.`);
}

function extractDocxParagraphs(documentXml) {
  const paragraphs = (documentXml.match(/<w:p[\s\S]*?<\/w:p>/g) || []).map((paragraph) => {
    const prepared = paragraph.replace(/<w:tab\b[^>]*\/>/g, "\t").replace(/<w:br\b[^>]*\/>/g, "\n");
    const runs = [...prepared.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((match) =>
      decodeXmlEntities(match[1]),
    );
    return runs.join("").trim();
  });

  while (paragraphs[0] === "") {
    paragraphs.shift();
  }

  while (paragraphs[paragraphs.length - 1] === "") {
    paragraphs.pop();
  }

  return paragraphs;
}

async function loadAboutDocument(language, path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`About ${language} request failed with ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const documentXml = await readZipTextFile(buffer, "word/document.xml");
  const paragraphs = extractDocxParagraphs(documentXml);

  return {
    ...fallbackAboutContent,
    body: paragraphs.join("\n") || fallbackAboutContent.body,
  };
}

async function loadAboutContent() {
  const entries = await Promise.all(
    Object.entries(aboutDocumentPaths).map(async ([language, path]) => {
      try {
        return [language, await loadAboutDocument(language, path)];
      } catch (error) {
        console.warn(`${path} could not be loaded.`, error);
        return [language, aboutContentByLanguage[language] || fallbackAboutContent];
      }
    }),
  );

  return Object.fromEntries(entries);
}

async function loadSiteContent() {
  if (!window.XLSX) {
    const about = await loadAboutContent();
    return { cardContentById: fallbackCardContentById, cardListRows: [], about };
  }

  try {
    const response = await fetch(workbookPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Workbook request failed with ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets.Cards || workbook.Sheets[workbook.SheetNames[0]];
    const cardListSheet = workbook.Sheets["card_list view"];
    const rows = normalizeWorkbookRows(sheet);
    const listRows = normalizeCardListRows(cardListSheet);
    const contentById = { ...fallbackCardContentById };
    let currentCategory = "";
    let lastCardNumber = 0;

    rows.forEach((row) => {
      const rowCategory = String(row.category || "").trim();
      if (rowCategory) {
        currentCategory = rowCategory;
        lastCardNumber = 0;
      }

      const hasContent =
        Boolean(row["back heading"] || row["back  body"] || row["back body"]) || getRowTags(row).length > 0;
      const card = getCardNumber(row, currentCategory, lastCardNumber, hasContent);
      if (card) {
        lastCardNumber = Number(String(card).replace(/\D/g, "")) || lastCardNumber;
      }

      if (!hasContent) {
        return;
      }

      const id = getCardId(currentCategory, card);
      if (!id) {
        return;
      }

      contentById[id] = {
        backHeading: row["back heading"] || contentById[id]?.backHeading || id,
        backBody: row["back  body"] || row["back body"] || contentById[id]?.backBody || "",
        tags: getRowTags(row),
        years: getRowYears(row),
      };
    });

    const about = await loadAboutContent();

    return { cardContentById: contentById, cardListRows: listRows, about };
  } catch (error) {
    console.warn(`${workbookPath} could not be loaded.`, error);
    const about = await loadAboutContent();
    return { cardContentById: fallbackCardContentById, cardListRows: [], about };
  }
}

function createProjects(cardContentById) {
  return imageRows.map((row, index) => {
    const fileName = row.path.split("/").pop();
    const id = row.id || fileName.replace(/\.[^.]+$/, "");
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
      years: content.years || [],
    };
  });
}

function render(category = "all") {
  const sequence = ++renderSequence;
  const activeCategory = getCategoryNumber(category);

  grid.classList.remove("is-ready", "is-list");
  grid.setAttribute("aria-busy", "true");
  grid.innerHTML = "";

  if (listViewCategories.has(activeCategory)) {
    currentListCategory = activeCategory;
    const rows = getSortedProjectListRows(cardListRows.filter((row) => row.category === activeCategory));
    grid.classList.add("is-list");
    grid.append(createProjectList(rows));
    grid.classList.add("is-ready");
    grid.removeAttribute("aria-busy");
    return;
  }

  currentListCategory = "";

  const filtered =
    category === "all"
      ? projects.filter((project) => !listViewCategories.has(project.category))
      : projects.filter((project) => project.category === category);
  const arranged = arrangeCards(filtered);
  const cards = arranged.map((project, index) => createProjectCard(project, index, sequence));
  grid.append(...cards);

  requestAnimationFrame(() => {
    if (sequence === renderSequence) {
      grid.classList.add("is-ready");
      grid.removeAttribute("aria-busy");
      loadCardImagesSequentially(cards, sequence);
    }
  });
}

function getYearValues(value) {
  const matches = String(value || "").match(/\d{4}/g);
  return matches ? matches.map(Number).filter(Boolean) : [];
}

function getSortYearValue(value, direction) {
  const years = getYearValues(value);
  if (!years.length) {
    return direction === "desc" ? -Infinity : Infinity;
  }

  return direction === "desc" ? Math.max(...years) : Math.min(...years);
}

function getSortedProjectListRows(rows) {
  const noteRows = rows.filter((row) => row.isListNote);
  const sortableRows = rows.filter((row) => !row.isListNote);

  if (!listSort.key) {
    return [...sortableRows, ...noteRows];
  }

  return [...sortableRows].sort((a, b) => {
    if (listSort.key === "when") {
      const aYear = getSortYearValue(a.when, listSort.direction);
      const bYear = getSortYearValue(b.when, listSort.direction);
      return listSort.direction === "desc" ? bYear - aYear : aYear - bYear;
    }

    if (listSort.key === "x") {
      return String(a.slash || "").localeCompare(String(b.slash || ""), "ko", {
        numeric: true,
        sensitivity: "base",
      });
    }

    return 0;
  }).concat(noteRows);
}

function updateListSort(key) {
  if (key === "when") {
    listSort = {
      key,
      direction: listSort.key === "when" && listSort.direction === "desc" ? "asc" : "desc",
    };
  } else if (key === "x") {
    listSort = { key, direction: "asc" };
  }

  if (currentListCategory) {
    render(currentListCategory);
  }
}

function createProjectList(rows) {
  const list = document.createElement("div");
  list.className = "project-list";
  list.setAttribute("role", "table");
  list.setAttribute("aria-label", "Project list");

  const header = document.createElement("div");
  header.className = "project-list-row project-list-header";
  header.setAttribute("role", "row");
  [
    { label: "what" },
    { label: "when", sortKey: "when" },
    { label: "x", sortKey: "x" },
    { label: "+" },
  ].forEach(({ label, sortKey }) => {
    const cell = document.createElement("span");
    cell.className = "project-list-cell";
    cell.setAttribute("role", "columnheader");
    if (sortKey) {
      const button = document.createElement("button");
      button.className = "project-list-sort";
      button.type = "button";
      button.textContent = label;
      button.setAttribute("aria-label", `${label} 열 정렬`);
      if (listSort.key === sortKey) {
        button.classList.add("is-active");
        button.dataset.sortDirection = listSort.direction;
        button.setAttribute("aria-sort", listSort.direction === "desc" ? "descending" : "ascending");
      }
      button.addEventListener("click", () => updateListSort(sortKey));
      cell.append(button);
    } else {
      cell.textContent = label;
    }
    header.append(cell);
  });
  list.append(header);

  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = row.isListNote ? "project-list-row project-list-note-row" : "project-list-row";
    item.setAttribute("role", "row");

    if (row.isListNote) {
      const noteCell = document.createElement("span");
      noteCell.className = "project-list-cell project-list-note-cell";
      noteCell.setAttribute("role", "cell");
      noteCell.setAttribute("aria-colspan", "4");
      noteCell.textContent = row.what;
      item.append(noteCell);
      list.append(item);
      return;
    }

    const values = [row.what, row.when, row.slash];
    values.forEach((value) => {
      const cell = document.createElement("span");
      cell.className = "project-list-cell";
      cell.setAttribute("role", "cell");
      cell.textContent = value;
      item.append(cell);
    });

    const linkCell = document.createElement("span");
    linkCell.className = "project-list-cell";
    linkCell.setAttribute("role", "cell");
    if (row.linkParts?.length) {
      row.linkParts.forEach((part, index) => {
        if (index > 0) {
          linkCell.append(document.createTextNode(" "));
        }

        if (part.url) {
          const anchor = document.createElement("a");
          anchor.href = part.url;
          anchor.target = "_blank";
          anchor.rel = "noreferrer";
          anchor.textContent = part.label;
          linkCell.append(anchor);
          return;
        }

        linkCell.append(document.createTextNode(part.label));
      });
    } else if (row.link && row.plusText) {
      const anchor = document.createElement("a");
      anchor.href = row.link;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.textContent = row.plusText;
      linkCell.append(anchor);
    } else {
      linkCell.textContent = row.plusText;
    }
    item.append(linkCell);

    list.append(item);
  });

  return list;
}

function loadCardImagesSequentially(cards, sequence) {
  cards.forEach((card, index) => {
    const delay = index < eagerImageLoadCount ? index * 18 : eagerImageLoadCount * 18 + (index - eagerImageLoadCount) * imageLoadStagger;
    setTimeout(() => {
      if (sequence !== renderSequence) {
        return;
      }

      const image = card.querySelector("img");
      if (image && image.dataset.src && !image.src) {
        image.src = image.dataset.src;
      }
    }, delay);
  });
}

function createProjectCard(project, index, sequence) {
  const card = document.createElement("button");
  card.className = "project-card";
  card.classList.add(`is-wiggle-${Math.floor(Math.random() * 3) + 1}`);
  card.type = "button";
  card.style.setProperty("--entry-delay", `${Math.min(index * 38 + Math.random() * 90, 1200)}ms`);
  card.style.setProperty("--tilt", `${project.tilt}deg`);
  card.style.setProperty("--stagger-x", `${project.staggerX}px`);
  card.style.setProperty("--stagger-gap-extra", `${Math.abs(project.staggerY) * 1.35}px`);
  card.setAttribute("aria-label", `${project.title} 크게 보기`);

  const motion = document.createElement("span");
  motion.className = "project-card-motion";
  const image = document.createElement("img");
  const dimensions = frontImageDimensions[project.image];

  if (dimensions) {
    const [width, height] = dimensions;
    image.width = width;
    image.height = height;
    card.style.setProperty("--front-ratio", `${width} / ${height}`);
    card.style.setProperty("--card-scale", getFrontImageScale(width / height));
  }

  image.alt = project.title;
  image.decoding = "async";
  image.loading = "eager";
  image.fetchPriority = index < 6 ? "high" : "auto";
  image.addEventListener(
    "load",
    () => {
      if (sequence !== renderSequence) {
        return;
      }

      applyFrontImageScale(card, image);
      card.classList.add("is-loaded");
    },
    { once: true },
  );
  image.dataset.src = versionAsset(project.image);

  motion.append(image);
  card.append(motion);
  card.addEventListener("click", () => openDetail(project));
  return card;
}

function applyFrontImageScale(card, image) {
  const ratio = image.naturalWidth / image.naturalHeight;
  card.style.setProperty("--card-scale", getFrontImageScale(ratio));
}

function getFrontImageScale(ratio) {
  return ratio >= 1.18 ? 1.2 : ratio >= 0.92 ? 1.06 : 1;
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
  detailImage.src = versionAsset(project.image);
  detailImage.alt = project.title;
  applyScrollbarColor(project);
  renderTags(detailTags, project.tags, project.years);
  renderDetailTitle(project);
  renderLinkedText(detailCopy, project.copy);
  renderDetailMedia(project);
  detail.setAttribute("aria-hidden", "false");
  detail.classList.add("is-open");
  document.body.classList.add("detail-open");
  requestAnimationFrame(fitDetailTitleLines);
  requestAnimationFrame(() => requestAnimationFrame(fitDetailTitleLines));
  document.fonts?.ready.then(fitDetailTitleLines);
  requestAnimationFrame(syncDetailMediaSize);
  requestAnimationFrame(() => requestAnimationFrame(syncDetailMediaSize));
  requestAnimationFrame(syncDetailScrollbar);
}

function renderDetailMedia(project) {
  detailMedia.innerHTML = "";
  detailMedia.hidden = !project.backMedia.length;

  project.backMedia.forEach((src, index) => {
    if (src.endsWith("1-33-3.mp4")) {
      const pair = document.createElement("div");
      pair.className = "back-media-pair";
      pair.append(
        createDetailMediaNode(src, project, index),
        createDetailMediaNode("img/1 create/1-33/1-33-4.mp4", project, index + 1),
      );
      detailMedia.appendChild(pair);
      return;
    }

    if (src.endsWith("1-33-4.mp4")) {
      return;
    }

    const node = createDetailMediaNode(src, project, index);
    detailMedia.appendChild(node);
  });
}

function createDetailMediaNode(src, project, index) {
  const element = createDetailMediaElement(src, project, index);
  if (element.tagName !== "VIDEO") {
    return element;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "back-media-video-frame";
  if (element.classList.contains("back-media-video-small")) {
    wrapper.classList.add("back-media-video-frame-small");
  }

  if (src.endsWith("1-47-1.mp4")) {
    wrapper.append(element);
    return wrapper;
  }

  const soundButton = document.createElement("button");
  soundButton.className = "video-sound-toggle";
  soundButton.type = "button";
  soundButton.textContent = "sound on";
  soundButton.setAttribute("aria-label", "영상 사운드 켜기");
  soundButton.addEventListener("click", (event) => {
    event.stopPropagation();
    element.muted = !element.muted;
    soundButton.textContent = element.muted ? "sound on" : "sound off";
    soundButton.setAttribute("aria-label", element.muted ? "영상 사운드 켜기" : "영상 사운드 끄기");
  });

  wrapper.append(element, soundButton);
  return wrapper;
}

function createDetailMediaElement(src, project, index) {
  const isVideo = /\.(mov|mp4|webm|m4v)$/i.test(src);
  const element = document.createElement(isVideo ? "video" : "img");

  element.src = versionAsset(src);
  element.className = "back-media-item";

  if (isVideo) {
    element.classList.add("back-media-video");
    if (src.endsWith("2-06-1.mp4")) {
      element.classList.add("back-media-video-small");
    }
    if (src.endsWith("1-33-3.mp4") || src.endsWith("1-33-4.mp4")) {
      element.classList.add("back-media-video-paired");
    }
    element.controls = true;
    element.muted = true;
    element.playsInline = true;
    element.preload = "metadata";
  } else {
    element.alt = `${project.title} back image ${index + 1}`;
  }

  element.addEventListener("load", syncDetailScrollbar);
  element.addEventListener("loadedmetadata", () => {
    syncDetailMediaSize();
    syncDetailScrollbar();
  });
  return element;
}

function syncDetailMediaSize() {
  const height = detailInner.getBoundingClientRect().height;
  if (!height) {
    return;
  }

  detailMedia.style.setProperty("--detail-card-media-height", `${Math.max(320, height * 0.72)}px`);
}

function pauseDetailMedia() {
  detailMedia.querySelectorAll("video, audio").forEach((media) => {
    media.pause();
    media.currentTime = 0;
  });
}

function renderTags(element, tags, years = []) {
  element.innerHTML = "";
  element.hidden = !tags.length && !years.length;

  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.className = "back-tag";
    item.textContent = tag;
    element.appendChild(item);
  });

  years.forEach((year) => {
    const item = document.createElement("span");
    item.className = "back-tag back-tag-year";
    item.textContent = year;
    element.appendChild(item);
  });
}

function renderDetailTitle(project) {
  detailTitle.innerHTML = "";

  String(project.title)
    .split("\n")
    .forEach((line, index) => {
      const item = document.createElement("span");
      const isFittedLine = project.id === "1-08" && index === 1;
      const classNames = ["detail-title-line"];

      if (index === 1) {
        classNames.push("detail-title-line-subtitle");
      }

      if (isFittedLine) {
        classNames.push("detail-title-line-fit");
      }

      item.className = classNames.join(" ");
      if (isFittedLine) {
        item.dataset.fitRatio = "0.9";
      }

      renderLinkedText(item, line);
      detailTitle.appendChild(item);
    });
}

function fitDetailTitleLines() {
  detailTitle.querySelectorAll(".detail-title-line-fit").forEach((line) => {
    line.style.fontSize = "";

    const availableWidth = detailTitle.clientWidth;
    const lineWidth = line.scrollWidth;

    if (!availableWidth || !lineWidth || lineWidth <= availableWidth) {
      return;
    }

    const currentSize = Number.parseFloat(getComputedStyle(line).fontSize);
    const fitRatio = Number.parseFloat(line.dataset.fitRatio || "0.995");
    const fittedSize = Math.max(10, currentSize * (availableWidth / lineWidth) * fitRatio);
    line.style.fontSize = `${fittedSize}px`;
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
    image.src = versionAsset(src);
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

  const createLink = (urlText, label) => {
    const link = document.createElement("a");
    link.href = /^https?:\/\//i.test(urlText) ? urlText : `https://${urlText}`;
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noreferrer";
    return link;
  };

  const appendInlineLinkedText = (value) => {
    String(value)
      .split(urlPattern)
      .filter((part) => part !== "")
      .forEach((part) => {
        if (urlPattern.test(part)) {
          urlPattern.lastIndex = 0;
          const trailingMatch = part.match(/[.,;:!?)]$/);
          const trailingText = trailingMatch ? trailingMatch[0] : "";
          const urlText = trailingText ? part.slice(0, -1) : part;
          element.appendChild(createLink(urlText, urlText));

          if (trailingText) {
            element.appendChild(document.createTextNode(trailingText));
          }
          return;
        }

        urlPattern.lastIndex = 0;
        element.appendChild(document.createTextNode(part));
      });
  };

  const lines = String(text).split("\n");
  const linkedLines = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const previous = linkedLines[linkedLines.length - 1];
    const isOnlyUrl = trimmedLine && trimmedLine.match(urlPattern)?.[0] === trimmedLine;
    urlPattern.lastIndex = 0;

    if (isOnlyUrl && previous?.text.trim() && !previous.url) {
      previous.url = trimmedLine;
      return;
    }

    linkedLines.push({ text: line, url: "" });
  });

  linkedLines.forEach((line, index) => {
    if (index > 0) {
      element.appendChild(document.createTextNode("\n"));
    }

    if (line.url) {
      element.appendChild(createLink(line.url, line.text));
      return;
    }

    appendInlineLinkedText(line.text);
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

function playRandomCardFlipSound() {
  const sound = cardFlipSounds[Math.floor(Math.random() * cardFlipSounds.length)];
  playSound(sound);
}

function updateAboutTimeButton() {
  aboutTimeToggle.textContent = aboutMotionPlaying ? "TIME" : "PLAY";
  aboutTimeToggle.setAttribute("aria-pressed", String(!aboutMotionPlaying));
}

function getAboutTimeTailTarget(ball) {
  const buttonRect = aboutTimeToggle.getBoundingClientRect();
  const ballSize = ball.element.offsetWidth || 40;

  return {
    x: buttonRect.left + 25 - ballSize / 2,
    y: buttonRect.bottom - ballSize / 2,
  };
}

function getAboutMotionBounds() {
  const panelWidth = aboutPanel.classList.contains("is-open") ? aboutPanel.getBoundingClientRect().width : 0;
  const width = Math.max(180, window.innerWidth - panelWidth - 24);
  const height = Math.max(180, window.innerHeight);

  return { width, height };
}

function seededNoise(value) {
  const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function getAboutHitDuration() {
  if (!Number.isFinite(aboutAudio.currentTime) || aboutAudio.paused) {
    return 2360;
  }

  const hitInterval = 2.36;
  const hitOffset = 0.2;
  const audioPosition = ((aboutAudio.currentTime - hitOffset) % hitInterval + hitInterval) % hitInterval;
  let remaining = hitInterval - audioPosition;

  if (remaining < 1.08) {
    remaining += hitInterval;
  }

  return remaining * 1000;
}

function queueAboutBallShot(ball, width, height, time) {
  const size = ball.element.offsetWidth || 48;
  const nextSide = ball.shotSide * -1;
  const seed = ball.rallySeed + ball.rallyIndex * 0.71 + aboutAudio.currentTime * 0.13;
  const noiseA = seededNoise(seed + 1.7);
  const noiseB = seededNoise(seed + 4.3);
  const noiseC = seededNoise(seed + 8.9);
  const courtLeft = 36;
  const courtRight = Math.max(courtLeft + 180, width - size - 44);
  const courtTop = 42;
  const courtBottom = Math.max(courtTop + 360, height - size - 46);
  const courtWidth = courtRight - courtLeft;
  const courtRange = courtBottom - courtTop;
  const centerX = courtLeft + courtWidth * 0.5;
  const laneWidth = Math.min(courtWidth * 0.34, 160);
  const topPlayerY = courtTop + courtRange * 0.07;
  const bottomPlayerY = courtBottom - courtRange * 0.07;
  const crossCourt = ball.rallyIndex % 3 !== 1;
  const lateralDirection = crossCourt ? nextSide : -nextSide;
  const approachJitter = (noiseC - 0.5) * Math.min(34, courtWidth * 0.09);

  ball.fromX = ball.x;
  ball.fromY = ball.y;
  ball.toX = centerX + lateralDirection * (laneWidth * (0.38 + noiseA * 0.54)) + approachJitter;
  ball.toY = nextSide > 0 ? bottomPlayerY - noiseB * 30 : topPlayerY + noiseB * 30;
  ball.shotStart = time;
  ball.shotDuration = getAboutHitDuration();
  ball.shotSide = nextSide;
  ball.rallyIndex += 1;
  ball.rallySeed = (ball.rallySeed + 0.193 + noiseB * 0.29) % 1;
}

function renderAboutBalls(time = performance.now()) {
  const { width, height } = getAboutMotionBounds();

  aboutBallState.forEach((ball, index) => {
    if (aboutMotionPlaying) {
      if (!ball.shotStart) {
        queueAboutBallShot(ball, width, height, time);
      }

      let progress = (time - ball.shotStart) / ball.shotDuration;
      if (progress >= 1) {
        ball.x = ball.toX;
        ball.y = ball.toY;
        ball.spin += ball.shotSide * 18;
        queueAboutBallShot(ball, width, height, time);
        progress = 0;
      }

      const clampedProgress = Math.max(0, Math.min(progress, 1));
      const speedShape = ball.shotDuration < 1700 ? 1.85 : ball.shotDuration > 2800 ? 2.55 : 2.25;
      const eased = 1 - Math.pow(1 - clampedProgress, speedShape);
      const courtCurve = Math.sin(clampedProgress * Math.PI) * ball.shotSide * 10;
      ball.x = ball.fromX + (ball.toX - ball.fromX) * eased;
      ball.y = ball.fromY + (ball.toY - ball.fromY) * eased;
      ball.x += courtCurve;
      ball.spin += ball.shotSide * (3.8 - clampedProgress * 1.6);
    } else {
      const { x: targetX, y: targetY } = getAboutTimeTailTarget(ball);

      ball.x += (targetX - ball.x) * 0.12;
      ball.y += (targetY - ball.y) * 0.12;
      ball.spin *= 0.88;
      ball.shotStart = 0;
    }

    ball.element.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) rotate(${ball.spin}deg)`;
  });
}

function animateAboutMotion(time) {
  if (!document.body.classList.contains("about-open")) {
    aboutMotionFrame = null;
    return;
  }

  if (!aboutMotionLastTime || time - aboutMotionLastTime > 16) {
    renderAboutBalls(time);
    aboutMotionLastTime = time;
  }

  aboutMotionFrame = requestAnimationFrame(animateAboutMotion);
}

function startAboutMotion() {
  aboutMotionLastTime = 0;
  if (!aboutMotionFrame) {
    aboutMotionFrame = requestAnimationFrame(animateAboutMotion);
  }
}

function stopAboutMotion() {
  if (aboutMotionFrame) {
    cancelAnimationFrame(aboutMotionFrame);
    aboutMotionFrame = null;
  }
  aboutMotionLastTime = 0;
}

function playAboutAudio() {
  aboutAudio.currentTime = 0;
  aboutAudio.play().catch(() => {});
}

function stopAboutAudio() {
  aboutAudio.pause();
  aboutAudio.currentTime = 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function renderAboutBody(body) {
  const linkReplacements = [
    {
      pattern: /\bWHAT\s*\.?\s*GIN\b/gi,
      href: "https://www.youtube.com/@what-gin",
    },
    {
      pattern: /\bbeaverdam\b/gi,
      href: "https://www.instagram.com/beaverdam.sigor/",
    },
  ];
  let html = escapeHtml(body);

  linkReplacements.forEach(({ pattern, href }) => {
    html = html.replace(
      pattern,
      (match) => `<a class="about-inline-link" href="${href}" target="_blank" rel="noreferrer">${match}</a>`,
    );
  });

  aboutBody.innerHTML = html;
}

function renderAbout() {
  const aboutContent = aboutContentByLanguage[currentAboutLanguage] || aboutContentByLanguage.kor || fallbackAboutContent;

  renderAboutBody(aboutContent.body);
  aboutLangButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.aboutLang === currentAboutLanguage);
  });
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

function getCategoryFromHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const category = getCategoryNumber(params.get("category") || "all");
  return category === "all" || [...tabs].some((tab) => tab.dataset.category === category) ? category : "all";
}

function persistCategory(category) {
  const nextHash = `category=${encodeURIComponent(category)}`;
  if (window.location.hash.replace(/^#/, "") === nextHash) {
    return;
  }

  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${nextHash}`);
}

function showCategory(category, { persist = true, scroll = false } = {}) {
  const normalizedCategory = getCategoryNumber(category);
  const activeCategory = normalizedCategory === "all" ? "all" : normalizedCategory;
  const activeTab = [...tabs].find((tab) => tab.dataset.category === activeCategory) || tabs[0];

  tabs.forEach((item) => item.classList.toggle("is-active", item === activeTab));
  render(activeTab.dataset.category);

  if (persist) {
    persistCategory(activeTab.dataset.category);
  }

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showCategory(tab.dataset.category, { scroll: true });
  });
});

document.querySelector("[data-flip]").addEventListener("click", () => {
  playRandomCardFlipSound();
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
      playRandomCardFlipSound();
    }

    closeDetail();
  });
});

document.querySelector("[data-about-open]").addEventListener("click", () => {
  currentAboutLanguage = "kor";
  aboutMotionPlaying = true;
  updateAboutTimeButton();
  renderAbout();
  document.body.classList.add("about-open");
  aboutPanel.classList.add("is-open");
  aboutPanel.setAttribute("aria-hidden", "false");
  startAboutMotion();
  playAboutAudio();
});

aboutTimeToggle.addEventListener("click", () => {
  aboutMotionPlaying = !aboutMotionPlaying;
  updateAboutTimeButton();

  if (aboutMotionPlaying) {
    aboutAudio.play().catch(() => {});
  } else {
    aboutAudio.pause();
  }
  startAboutMotion();
});

aboutLangButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentAboutLanguage = button.dataset.aboutLang;
    renderAbout();
    aboutPanel.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelectorAll("[data-about-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.remove("about-open");
    aboutPanel.classList.remove("is-open");
    aboutPanel.setAttribute("aria-hidden", "true");
    aboutMotionPlaying = true;
    updateAboutTimeButton();
    stopAboutMotion();
    stopAboutAudio();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDetail();
    document.body.classList.remove("about-open");
    aboutPanel.classList.remove("is-open");
    aboutPanel.setAttribute("aria-hidden", "true");
    aboutMotionPlaying = true;
    updateAboutTimeButton();
    stopAboutMotion();
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
window.addEventListener("resize", () => {
  syncDetailMediaSize();
  syncDetailScrollbar();
  fitDetailTitleLines();
  if (document.body.classList.contains("about-open")) {
    renderAboutBalls();
  }
});
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
  const { cardContentById, cardListRows: loadedCardListRows, about } = await loadSiteContent();
  aboutContentByLanguage = about;
  cardListRows = loadedCardListRows;
  projects = createProjects(cardContentById);
  renderAbout();
  updateAboutTimeButton();
  showCategory(getCategoryFromHash(), { persist: false });
}

init();
