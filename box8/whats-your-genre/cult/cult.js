'use strict';

const ROUTE_IDS = ['A', 'B', 'C', 'D'];
// Each row uses one original blue answer per route. Every answer appears once.
// Follow the journey from choosing a film to the feelings after watching.
const QUESTION_PLAN = [
  { title: "컬트 비디오 코너야. 오늘은 어떤 영화를 집어 들고 싶어?", picks: [7, 6, 6, 6] },
  { title: "오늘, 평범한 영화 말고 컬트 영화가 필요한 이유는 뭐야?", picks: [3, 1, 7, 1] },
  { title: "재생 버튼을 누르기 전, 어떤 이야기에 더 마음이 가?", picks: [6, 3, 1, 0] },
  { title: "영화가 시작됐어. 어떤 디테일에 가장 먼저 눈길이 가?", picks: [5, 0, 2, 4] },
  { title: "이상한 세계에 점점 빠져들고 있어. 지금 마음은 어때?", picks: [4, 2, 5, 5] },
  { title: "마지막 장면까지 봤어. 어떤 한마디가 나오면 좋겠어?", picks: [1, 5, 4, 2] },
  { title: "엔딩 크레딧이 올라가. 다음엔 뭘 해보고 싶어?", picks: [0, 7, 3, 3] },
  { title: "영화는 끝났는데, 아직 여운이 남아. 이제 뭘 하고 싶어?", picks: [2, 4, 0, 7] }
];
const ROUTE_SUMMARIES = {
  "A": "“내가 지금 뭘 본 거지?” 설명되지 않는 장면이 자꾸 떠오르는 길. 다시 돌려보고, 해석을 찾아보고, 누군가와 이야기하고 싶어지는 기이한 잔상을 따라가 보세요.",
  "B": "세상이 정해놓은 기준에 온몸으로 맞서는 길. 자유를 향한 갈망과 분노를 품은 아웃사이더들이, 순응하고 싶지 않은 당신 안의 반항아를 깨웁니다.",
  "C": "어설퍼도 진심이고, 조잡해도 사랑스러운 길. 매끈한 완성도 대신 아마추어의 기백과 배짱, 거친 질감과 별난 감각에서 발견의 쾌감을 만나보세요.",
  "D": "익숙한 장르의 법칙을 해체하고 자기만의 세계를 만드는 길. 실패를 두려워하지 않는 감독들을 따라, 컬트와 고전 사이의 예측 불가능한 경계를 탐험해 보세요."
};

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildQuestionSet(random = Math.random) {
  return QUESTION_PLAN.map((question, id) => ({
    id,
    title: question.title,
    options: shuffle(ROUTE_IDS.map((route, index) => ({
      route,
      text: CULT_DATA.routes[route].answers[question.picks[index]]
    })), random)
  }));
}

function scoreAnswers(answers) {
  const scores = Object.fromEntries(ROUTE_IDS.map(route => [route, 0]));
  answers.forEach(route => { if (ROUTE_IDS.includes(route)) scores[route]++; });
  return scores;
}

function winningRoutes(scores) {
  const highest = Math.max(...ROUTE_IDS.map(route => scores[route]));
  return ROUTE_IDS.filter(route => scores[route] === highest);
}

function parseResultHash(hash) {
  const match = /^#cult=(\d),(\d),(\d),(\d)$/.exec(hash);
  if (!match) return null;
  const values = match.slice(1).map(Number);
  if (values.some(value => value > 8) || values.reduce((a, b) => a + b, 0) !== 8) return null;
  return Object.fromEntries(ROUTE_IDS.map((route, index) => [route, values[index]]));
}

if (typeof document !== 'undefined') {
  const get = id => document.getElementById(id);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  let questions = [];
  let answers = [];
  let current = 0;
  let resultScores = null;

  function showScreen(id, focusId) {
    ['intro', 'quiz', 'result'].forEach(screen => { get(screen).hidden = screen !== id; });
    if (focusId) {
      const focus = get(focusId);
      focus.focus({ preventScroll: true });
      get(id).scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  function clearResultLink() {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  function renderQuestion() {
    const question = questions[current];
    get('question-title').textContent = question.title;
    get('step').textContent = `${String(current + 1).padStart(2, '0')} / 08`;
    const completed = answers.filter(Boolean).length;
    get('progress').value = completed;
    get('progress').setAttribute('aria-valuetext', `8문항 중 ${completed}문항 답변 완료`);
    get('choices').replaceChildren();
    question.options.forEach((option, index) => {
      const label = element('label', 'answer');
      const input = element('input');
      input.type = 'radio';
      input.name = 'cult-answer';
      input.value = option.route;
      input.required = true;
      input.checked = answers[current] === option.route;
      input.addEventListener('change', () => {
        answers[current] = option.route;
        get('next').disabled = false;
        const count = answers.filter(Boolean).length;
        get('progress').value = count;
        get('progress').setAttribute('aria-valuetext', `8문항 중 ${count}문항 답변 완료`);
      });
      const box = element('span', 'answer-box');
      const number = element('span', 'answer-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      box.append(number, element('span', '', option.text));
      label.append(input, box);
      get('choices').append(label);
    });
    get('previous').textContent = current === 0 ? '← 시작 화면' : '← 이전 질문';
    get('next').textContent = current === 7 ? '나의 경로 확인하기' : '다음 질문 →';
    get('next').disabled = !answers[current];
    showScreen('quiz', 'question-title');
  }

  function start() {
    clearResultLink();
    questions = buildQuestionSet();
    answers = Array(8).fill(null);
    current = 0;
    renderQuestion();
  }

  function routeCard(route) {
    const data = CULT_DATA.routes[route];
    const card = element('article', 'route-card');
    card.append(element('p', 'route-label', `ROUTE ${route} / ${resultScores[route]} OF 8 CHOICES`));
    card.append(element('h3', '', data.name));
    card.append(element('p', 'route-summary', ROUTE_SUMMARIES[route]));
    const details = element('details', 'editorial');
    const summary = element('summary', '', '이 경로의 이야기를 더 읽어보세요');
    const plus = element('span', '', '＋');
    plus.setAttribute('aria-hidden', 'true');
    summary.append(plus);
    const copy = element('div');
    copy.append(element('p', '', data.description));
    details.append(summary, copy);
    card.append(details, element('h4', 'movie-heading', 'WAYPOINTS / 이 영화에서 출발해 보세요'));
    const list = element('ul', 'movie-list');
    data.movies.forEach(movie => {
      const item = element('li');
      const title = element('span', '', movie.title);
      title.append(element('span', 'movie-year', `(${movie.year})`));
      item.append(element('span', 'movie-id', movie.id), title);
      list.append(item);
    });
    card.append(list);
    return card;
  }

  function renderResult(scores, shared = false) {
    resultScores = scores;
    const winners = winningRoutes(scores);
    get('result-title').textContent = winners.length === 1
      ? `당신의 컬트는, ${CULT_DATA.routes[winners[0]].name}.`
      : `${winners.length}개의 길이 만나는 당신의 컬트.`;
    get('result-intro').textContent = (shared ? '공유된 컬트 탐험 결과입니다. ' : '') + (winners.length === 1
      ? '지금의 마음이 가장 자주 향한 길입니다. 기점이 되는 영화를 골라 필드맵 탐험을 시작해 보세요.'
      : '같은 수의 선택을 받은 경로를 함께 소개합니다. 마음이 먼저 움직이는 영화에서 출발해 보세요.');
    get('route-results').replaceChildren(...winners.map(routeCard));
    get('scores').replaceChildren();
    ROUTE_IDS.forEach(route => {
      const row = element('div', 'score-row');
      const heading = element('div', 'score-heading');
      heading.append(element('span', '', `${route}. ${CULT_DATA.routes[route].name}`), element('span', '', `${scores[route]} / 8`));
      const track = element('div', 'score-track');
      track.setAttribute('aria-hidden', 'true');
      const fill = element('div', 'score-fill');
      fill.style.width = `${scores[route] / 8 * 100}%`;
      track.append(fill);
      row.append(heading, track);
      get('scores').append(row);
    });
    get('share-status').textContent = '';
    const hash = '#cult=' + ROUTE_IDS.map(route => scores[route]).join(',');
    history.replaceState(null, '', location.pathname + location.search + hash);
    showScreen('result', 'result-title');
  }

  get('fieldmap-intro').textContent = CULT_DATA.intro;
  get('hidden-route').textContent = CULT_DATA.hidden;
  get('start').addEventListener('click', start);
  get('retry').addEventListener('click', start);
  get('previous').addEventListener('click', () => {
    if (current > 0) { current--; renderQuestion(); }
    else showScreen('intro', 'start');
  });
  get('restart').addEventListener('click', () => {
    clearResultLink();
    showScreen('intro', 'start');
  });
  get('question-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!answers[current]) return;
    if (current < 7) { current++; renderQuestion(); }
    else renderResult(scoreAnswers(answers));
  });
  get('share').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      get('share-status').textContent = '결과 링크를 복사했어요. 나의 컬트 경로를 나눠보세요.';
    } catch {
      get('share-status').textContent = '아래 링크를 복사해 공유해 주세요.';
      const link = element('a', '', location.href);
      link.href = location.href;
      get('share-status').append(element('br'), link);
    }
  });
  const sharedScores = parseResultHash(location.hash);
  if (sharedScores) renderResult(sharedScores, true);
  window.addEventListener('hashchange', () => {
    const scores = parseResultHash(location.hash);
    if (scores) renderResult(scores, true);
    else showScreen('intro', 'start');
  });
}
