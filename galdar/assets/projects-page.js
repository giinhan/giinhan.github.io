(() => {
  const stories = [...document.querySelectorAll('[data-project-reveal]')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0.12 });
    stories.forEach(story => { observer.observe(story); story.classList.add('will-reveal'); });
  }
  const buttons = [...document.querySelectorAll('[data-project-category]')];
  const rows = [...document.querySelectorAll('[data-project-groups]')];
  const status = document.querySelector('[data-project-filter-status]');
  const reset = document.querySelector('[data-project-reset]');
  if (!status || !reset) return;
  let current = '';
  function select(category) {
    current = category === current ? '' : category;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.projectCategory === current)));
    rows.forEach(row => { row.hidden = !!current && !row.dataset.projectGroups.split(' ').includes(current); });
    const active = buttons.find(button => button.dataset.projectCategory === current);
    const label = active ? active.querySelector('strong').textContent : '전체 프로젝트';
    status.textContent = `${label} · ${rows.filter(row => !row.hidden).length}개`;
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.projectCategory)));
  reset.addEventListener('click', () => select(''));
  select('');
})();
