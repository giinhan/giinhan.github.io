(() => {
  const pages = Array.from(document.querySelectorAll('.page'));
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const restart = document.getElementById('restart');
  const count = document.getElementById('page-count');
  const dots = document.querySelector('.dots');
  let current = 0;
  const buttons = pages.map((page, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${index + 1}페이지로 이동`);
    button.addEventListener('click', () => show(index));
    dots.append(button);
    return button;
  });
  function show(index, focus = true) {
    current = Math.max(0, Math.min(pages.length - 1, index));
    pages.forEach((page, i) => { page.hidden = i !== current; });
    buttons.forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    previous.disabled = current === 0;
    next.hidden = current === pages.length - 1;
    restart.hidden = current !== pages.length - 1;
    count.textContent = `${String(current + 1).padStart(2, '0')} / 10`;
    document.title = `${current + 1}/10 · 여러분에게 보내는 작은 제안 — 한지인`;
    if (focus) {
      // Focus the page so keyboard and screen-reader users follow the page turn.
      const page = pages[current];
      page.tabIndex = -1;
      page.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  restart.addEventListener('click', () => show(0));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  show(0, false);
})();
