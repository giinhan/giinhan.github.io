'use strict';

const ROUTE_IDS = ['A', 'B', 'C', 'D'];
// Each row uses one original blue answer per route. Every answer appears once.
// Follow the journey from choosing a film to the feelings after watching.
const QUESTION_PLAN = [
  { title: "호러 비디오 코너야. 오늘은 어떤 마음으로 영화를 골라?", picks: [1, 2, 3, 2] },
  { title: "재생 버튼을 누르기 전, 일상에서 오싹했던 순간을 떠올려볼까?", picks: [4, 0, 0, 4] },
  { title: "이번 영화에서는 어떤 두려움과 마주하고 싶어?", picks: [3, 1, 2, 1] },
  { title: "영화가 시작됐어. 어떤 장면의 디테일에 먼저 눈길이 가?", picks: [2, 3, 6, 0] },
  { title: "공포가 점점 다가와. 어떤 순간이 가장 강하게 느껴져?", picks: [7, 6, 4, 7] },
  { title: "마침내 두려움의 정체가 드러났어. 어떤 생각이 들어?", picks: [5, 4, 5, 5] },
  { title: "마지막 장면을 보고 나서, 어떤 질문이 마음에 남아?", picks: [6, 5, 7, 6] },
  { title: "영화가 끝났어. 이제 뭘 떠올리거나 찾아보게 될 것 같아?", picks: [0, 7, 1, 3] }
];
const ROUTE_SUMMARIES = {
  "A": "존재하지 않는다고 믿으면서도, 어딘가엔 있을 것 같은 것들. 악마와 유령, 저주와 괴물처럼 알 수 없는 존재들이 드리운 어둠 속으로 향하는 정통 호러 경로입니다.",
  "B": "익숙한 얼굴과 편안한 집이 갑자기 낯설어지는 순간. 가장 무서운 것이 내 안에 있을지도 모른다는 불안을 따라, 영화가 끝나도 쉽게 사라지지 않는 심리 호러의 길로 들어갑니다.",
  "C": "혐오스러운데도 눈을 뗄 수 없는 변화. 연약하고 상하기 쉬운 몸의 경계를 마주하며, “인간은 어디까지 인간인가?”를 묻는 바디 호러의 길입니다.",
  "D": "귀신보다 사람이 더 무섭다는 말. 탐욕과 차별, 폭력과 침묵이 어떻게 괴물을 만드는지 들여다보며, 현실을 비추는 사회 호러의 거울 앞으로 향합니다."
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
      text: HORROR_DATA.routes[route].answers[question.picks[index]]
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
  const match = /^#horror=(\d),(\d),(\d),(\d)$/.exec(hash);
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
      input.name = 'horror-answer';
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
    const data = HORROR_DATA.routes[route];
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
      ? `당신의 호러는, ${HORROR_DATA.routes[winners[0]].name}.`
      : `${winners.length}개의 길이 만나는 당신의 호러.`;
    get('result-intro').textContent = (shared ? '공유된 호러 탐험 결과입니다. ' : '') + (winners.length === 1
      ? '지금의 마음이 가장 자주 향한 길입니다. 기점이 되는 영화를 골라 필드맵 탐험을 시작해 보세요.'
      : '같은 수의 선택을 받은 경로를 함께 소개합니다. 마음이 먼저 움직이는 영화에서 출발해 보세요.');
    get('route-results').replaceChildren(...winners.map(routeCard));
    get('scores').replaceChildren();
    ROUTE_IDS.forEach(route => {
      const row = element('div', 'score-row');
      const heading = element('div', 'score-heading');
      heading.append(element('span', '', `${route}. ${HORROR_DATA.routes[route].name}`), element('span', '', `${scores[route]} / 8`));
      const track = element('div', 'score-track');
      track.setAttribute('aria-hidden', 'true');
      const fill = element('div', 'score-fill');
      fill.style.width = `${scores[route] / 8 * 100}%`;
      track.append(fill);
      row.append(heading, track);
      get('scores').append(row);
    });
    get('share-status').textContent = '';
    const hash = '#horror=' + ROUTE_IDS.map(route => scores[route]).join(',');
    history.replaceState(null, '', location.pathname + location.search + hash);
    showScreen('result', 'result-title');
  }

  get('fieldmap-intro').textContent = HORROR_DATA.intro;
  get('hidden-route').textContent = HORROR_DATA.hidden;
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
      get('share-status').textContent = '결과 링크를 복사했어요. 나의 호러 경로를 나눠보세요.';
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
