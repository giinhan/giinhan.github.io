(() => {
  const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
  const columns = {
    title: { selector: '.project-identity h3', label: '프로젝트명' },
    year: { selector: '.project-year', label: '연도' },
    keyword: { selector: '.project-keyword', label: '키워드' },
    category: { selector: '.project-category', label: '구분' }
  };
  document.querySelectorAll('#projects').forEach(section => {
    const list = section.querySelector('.projects');
    const buttons = [...section.querySelectorAll('[data-project-sort]')];
    const status = section.querySelector('.project-sort-status');
    if (!list || !buttons.length) return;
    const rows = [...list.querySelectorAll('.project')].map((element, index) => ({ element, index }));
    let activeKey = '';
    let ascending = true;
    const value = (row, key) => row.element.querySelector(columns[key].selector).textContent.normalize('NFKC').trim();
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.projectSort;
        ascending = key === activeKey ? !ascending : true;
        activeKey = key;
        rows.sort((a, b) => {
          const left = value(a, key);
          const right = value(b, key);
          // Keep missing values last and equal values in their original order.
          if (!left && right) return 1;
          if (left && !right) return -1;
          return (ascending ? 1 : -1) * collator.compare(left, right) || a.index - b.index;
        });
        rows.forEach(row => list.appendChild(row.element));
        buttons.forEach(control => {
          const selected = control.dataset.projectSort === key;
          const nextDirection = selected && ascending ? '내림차순' : '오름차순';
          const label = `${columns[control.dataset.projectSort].label} ${nextDirection}으로 정렬`;
          control.setAttribute('aria-pressed', String(selected));
          control.setAttribute('aria-label', label);
          control.title = label;
          if (selected) control.dataset.direction = ascending ? 'ascending' : 'descending';
          else delete control.dataset.direction;
        });
        if (status) status.textContent = `${columns[key].label} ${ascending ? '오름차순' : '내림차순'}으로 정렬했습니다.`;
      });
    });
  });
})();
