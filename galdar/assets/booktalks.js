(() => {
  const root = document.querySelector('[data-booktalk-archive]');
  if (!root) return;
  const search = root.querySelector('[data-booktalk-search]');
  const year = root.querySelector('[data-booktalk-year]');
  const cards = [...root.querySelectorAll('[data-booktalk-card]')];
  const count = root.querySelector('[data-booktalk-count]');
  const empty = root.querySelector('[data-booktalk-empty]');
  const more = root.querySelector('[data-booktalk-more]');
  const batch = 24;
  let limit = batch;
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g, ' ').trim();
  function render() {
    const query = normalize(search ? search.value : '');
    const matches = cards.filter(card => (!year.value || card.dataset.year === year.value) && normalize(card.dataset.title).includes(query));
    const shown = new Set(matches.slice(0, limit));
    cards.forEach(card => { card.hidden = !shown.has(card); });
    count.textContent = `총 ${matches.length}개 중 ${shown.size}개 표시`;
    empty.hidden = matches.length > 0;
    more.hidden = matches.length <= limit;
  }
  function reset() { limit = batch; render(); }
  if (search) search.addEventListener('input', reset);
  year.addEventListener('change', reset);
  more.addEventListener('click', () => { limit += batch; render(); });
  render();
})();
