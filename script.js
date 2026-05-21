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

const cardFlipSounds = [
  "sound/card flip 01.mp3",
  "sound/card flip 02.mp3",
  "sound/card flip 03.wav",
  "sound/card flip 04.mp3",
  "sound/card flip 05.mp3",
];

const workbookPath = "txt/giinhan txt.xlsx";

const fallbackAboutContent = {
  name: "한지인",
  email: "giinhan@gmail.com",
  body: "나는 한지인이다",
};

let aboutContent = { ...fallbackAboutContent };

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

function mediaFiles(folder, files) {
  return files.map((file) => `${folder}/${file}`);
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
    path: "img/1 create/1-21/1-21-0.png",
    backMedia: mediaFiles("img/1 create/1-21", [
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
      "1-30-6.png",
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
      "1-34-25.JPG",
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
      "1-36-2.jpg",
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
      "1-36-17.JPG",
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
    category: "2",
    path: "img/2 operate/2-01/2-01.jpg",
    backMedia: numberedMedia("img/2 operate/2-01", "2-01", [1, 2, 3, 4], "png").concat("img/2 operate/2-01/2-01-5.jpg"),
  },
  {
    category: "2",
    path: "img/2 operate/2-02/2-02.jpg",
    backMedia: mediaFiles("img/2 operate/2-02", ["2-02-1", "2-02-2.png", "2-02-3.png"]),
  },
  {
    category: "2",
    path: "img/2 operate/2-03/2-03.jpg",
    backMedia: numberedMedia("img/2 operate/2-03", "2-03", [1, 2, 3], "jpg").concat(
      "img/2 operate/2-03/2-03-4.JPG",
      "img/2 operate/2-03/2-03-5.jpg",
      "img/2 operate/2-03/2-03-6.jpg",
    ),
  },
  {
    category: "2",
    id: "2-04",
    path: "img/2 operate/2-04/55-2.jpg",
    backMedia: mediaFiles("img/2 operate/2-04", ["2-04-1.png", "2-04-2.png", "2-04-3.jpg", "2-04-4.jpg"]),
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
    path: "img/2 operate/2-10/2-10.png",
    backMedia: numberedMedia("img/2 operate/2-10", "2-10", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "jpg"),
  },
  { category: "3", id: "3-01", path: "img/3 write/3-01/62.jpeg" },
  { category: "3", id: "3-02", path: "img/3 write/3-02/61.jpeg" },
  { category: "3", id: "3-03", path: "img/3 write/3-03/63.jpg" },
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
];

const categoryNumberByName = {
  create: "1",
  operate: "2",
  write: "3",
  talk: "4",
  consult: "5",
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

async function loadSiteContent() {
  if (!window.XLSX) {
    return { cardContentById: fallbackCardContentById, about: fallbackAboutContent };
  }

  try {
    const response = await fetch(workbookPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Workbook request failed with ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets.Cards || workbook.Sheets[workbook.SheetNames[0]];
    const rows = normalizeWorkbookRows(sheet);
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
      };
    });

    const aboutSheet = workbook.Sheets.about || workbook.Sheets.About;
    const aboutRows = aboutSheet ? XLSX.utils.sheet_to_json(aboutSheet, { header: 1, defval: "", raw: false }) : [];
    const about = {
      name: getCell(aboutRows, "A1") || fallbackAboutContent.name,
      email: getCell(aboutRows, "A3") || fallbackAboutContent.email,
      body: getCell(aboutRows, "A5") || fallbackAboutContent.body,
    };

    return { cardContentById: contentById, about };
  } catch (error) {
    console.warn(`${workbookPath} could not be loaded.`, error);
    return { cardContentById: fallbackCardContentById, about: fallbackAboutContent };
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
    card.style.setProperty("--stagger-gap-extra", `${Math.abs(project.staggerY) * 1.35}px`);
    card.setAttribute("aria-label", `${project.title} 크게 보기`);
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.title;
    image.addEventListener("load", () => applyFrontImageScale(card, image), { once: true });
    const title = document.createElement("span");
    title.className = "project-card-title";
    title.textContent = project.title;

    card.append(image, title);
    card.addEventListener("click", () => openDetail(project));
    grid.appendChild(card);
  });
}

function applyFrontImageScale(card, image) {
  const ratio = image.naturalWidth / image.naturalHeight;
  const scale = ratio >= 1.18 ? 1.2 : ratio >= 0.92 ? 1.06 : 1;

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
  renderDetailTitle(project);
  renderLinkedText(detailCopy, project.copy);
  renderDetailMedia(project);
  detail.setAttribute("aria-hidden", "false");
  detail.classList.add("is-open");
  document.body.classList.add("detail-open");
  requestAnimationFrame(fitDetailTitleLines);
  requestAnimationFrame(() => requestAnimationFrame(fitDetailTitleLines));
  document.fonts?.ready.then(fitDetailTitleLines);
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
        createDetailMediaElement(src, project, index),
        createDetailMediaElement("img/1 create/1-33/1-33-4.mp4", project, index + 1),
      );
      detailMedia.appendChild(pair);
      return;
    }

    if (src.endsWith("1-33-4.mp4")) {
      return;
    }

    const element = createDetailMediaElement(src, project, index);
    detailMedia.appendChild(element);
  });
}

function createDetailMediaElement(src, project, index) {
  const isVideo = /\.(mov|mp4|webm|m4v)$/i.test(src);
  const element = document.createElement(isVideo ? "video" : "img");

  element.src = src;
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
  element.addEventListener("loadedmetadata", syncDetailScrollbar);
  return element;
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

function renderDetailTitle(project) {
  detailTitle.innerHTML = "";

  String(project.title)
    .split("\n")
    .forEach((line, index) => {
      const item = document.createElement("span");
      const isFittedLine = project.id === "1-08" && index === 1;

      item.className = isFittedLine ? "detail-title-line detail-title-line-fit" : "detail-title-line";
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

function playRandomCardFlipSound() {
  const sound = cardFlipSounds[Math.floor(Math.random() * cardFlipSounds.length)];
  playSound(sound);
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
window.addEventListener("resize", fitDetailTitleLines);
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
  const { cardContentById, about } = await loadSiteContent();
  aboutContent = about;
  projects = createProjects(cardContentById);
  renderAbout();
  render("all");
}

init();
