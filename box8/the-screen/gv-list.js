const gvSection = document.querySelector('.screen-gv');
if (gvSection) {
  const cards = [...gvSection.querySelectorAll('.gv-card')];
  const more = gvSection.querySelector('.gv-more');
  let expanded = false;
  function updateCards() {
    const limit = 4;
    cards.forEach((card, index) => { card.hidden = !expanded && index >= limit; });
    more.hidden = expanded || cards.length <= limit;
    more.setAttribute('aria-expanded', String(expanded));
  }
  more.addEventListener('click', () => {
    const firstNewCard = cards.find(card => card.hidden);
    expanded = true;
    updateCards();
    if (firstNewCard) firstNewCard.focus({ preventScroll: true });
  });
  updateCards();
}
