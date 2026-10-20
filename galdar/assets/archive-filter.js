(() => {
  const root = document.querySelector('[data-reading-archive]');
  if (!root) return;
  const input = root.querySelector('[data-reading-search]');
  const cards = [...root.querySelectorAll('[data-reading-card]')];
  const buttons = [...root.querySelectorAll('[data-reading-filter]')];
  const empty = root.querySelector('[data-reading-empty]');
  const count = root.querySelector('[data-reading-count]');
  let category = '전체';
  function apply() {
    const query = input.value.trim().normalize('NFKC').toLocaleLowerCase('ko');
    let visible = 0;
    cards.forEach(card => {
      const match = (category === '전체' || card.dataset.category === category) && card.textContent.normalize('NFKC').toLocaleLowerCase('ko').includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    empty.hidden = visible !== 0;
    count.textContent = `${visible}개의 기록`;
  }
  input.addEventListener('input', apply);
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.readingFilter;
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    apply();
  }));
  apply();
})();
