'use strict';

const ROUTE_IDS = ['A', 'B', 'C', 'D'];
// Each row uses one original blue answer per route. Every answer appears once.
const QUESTION_PLAN = [
  { title: '오늘 멜로 영화를 고르는 당신에게, 가장 필요한 것은?', picks: [0, 2, 5, 0] },
  { title: '이번 영화에서 끝까지 따라가 보고 싶은 이야기는?', picks: [4, 0, 1, 5] },
  { title: '영화가 끝난 뒤, 어떤 마음을 더 들여다보고 싶나요?', picks: [6, 1, 0, 1] },
  { title: '지금 당신을 영화 앞으로 데려오는 마음은?', picks: [3, 4, 6, 6] },
  { title: '스크린 속 사랑에서 가장 가까이 보고 싶은 것은?', picks: [1, 5, 4, 4] },
  { title: '오늘 고를 멜로의 결을 한 문장으로 말한다면?', picks: [5, 6, 3, 2] },
  { title: '지금의 관계를 떠올릴 때, 가장 와닿는 문장은?', picks: [2, 7, 2, 7] },
  { title: '오늘의 멜로 취향에 마지막 한 표를 보낸다면?', picks: [7, 3, 7, 3] }
];
const ROUTE_SUMMARIES = {
  A: '“아— 연애하고 싶다!” 잠들어 있던 연애 세포를 깨우는 길. 설레는 만남과 진심 어린 사랑을 따라가다 보면, 사랑받기 충분한 나를 다시 믿게 될 거예요.',
  B: '사랑이 끝난 자리에서도 이야기는 계속됩니다. 관계 속에서 잊었던 나를 만나고, 내 발로 서는 인물들을 따라가 보세요. 온전히 나 자신과 함께하는 시간으로 향하는 길입니다.',
  C: '사랑은 어떻게 증오로 변할까요? 사랑이라는 이름 뒤에 숨은 통제와 권력, 왜곡된 욕망을 마주하는 길. 불편한 진실을 보여주는 영화가 당신의 경고등을 켭니다.',
  D: '전쟁과 역사, 계급과 사회의 벽 앞에서도 쉽게 포기하지 않는 사랑. 격렬한 싸움부터 고요한 이별까지, 사랑이 세계와 부딪치는 순간의 깊은 감정으로 향하는 길입니다.'
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
  return shuffle(QUESTION_PLAN.map((question, id) => ({
    id,
    title: question.title,
    options: shuffle(ROUTE_IDS.map((route, index) => ({
      route,
      text: MELO_DATA.routes[route].answers[question.picks[index]]
    })), random)
  })), random);
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
  const match = /^#melo=(\d),(\d),(\d),(\d)$/.exec(hash);
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
      input.name = 'melo-answer';
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
    get('next').textContent = current === 7 ? '나의 경로 확인하기 ↗' : '다음 질문 →';
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
    const data = MELO_DATA.routes[route];
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
      ? `당신의 멜로는, ${MELO_DATA.routes[winners[0]].name}.`
      : `${winners.length}개의 길이 만나는 당신의 멜로.`;
    get('result-intro').textContent = (shared ? '공유된 멜로 탐험 결과입니다. ' : '') + (winners.length === 1
      ? '지금의 마음이 가장 자주 향한 길입니다. 기점이 되는 영화를 골라 필드맵 탐험을 시작해 보세요.'
      : '같은 수의 선택을 받은 경로를 함께 소개합니다. 마음이 먼저 움직이는 영화에서 출발해 보세요.');
    get('route-results').replaceChildren(...winners.map(routeCard));
    get('scores').replaceChildren();
    ROUTE_IDS.forEach(route => {
      const row = element('div', 'score-row');
      const heading = element('div', 'score-heading');
      heading.append(element('span', '', `${route}. ${MELO_DATA.routes[route].name}`), element('span', '', `${scores[route]} / 8`));
      const track = element('div', 'score-track');
      track.setAttribute('aria-hidden', 'true');
      const fill = element('div', 'score-fill');
      fill.style.width = `${scores[route] / 8 * 100}%`;
      track.append(fill);
      row.append(heading, track);
      get('scores').append(row);
    });
    get('share-status').textContent = '';
    const hash = '#melo=' + ROUTE_IDS.map(route => scores[route]).join(',');
    history.replaceState(null, '', location.pathname + location.search + hash);
    showScreen('result', 'result-title');
  }

  get('fieldmap-intro').textContent = MELO_DATA.intro;
  get('hidden-route').textContent = MELO_DATA.hidden;
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
      get('share-status').textContent = '결과 링크를 복사했어요. 나의 멜로 경로를 나눠보세요.';
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
