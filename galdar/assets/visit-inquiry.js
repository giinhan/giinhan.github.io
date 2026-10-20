(() => {
  document.querySelectorAll('[data-visit-form]').forEach(form => {
    const send = form.querySelector('[type="submit"]');
    const states = [...form.querySelectorAll('[data-visit-state]')];
    const show = state => states.forEach(node => { node.hidden = node.dataset.visitState !== state; });
    let busy = false;
    let accepted = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || accepted || !form.reportValidity()) return;
      const field = name => form.elements.namedItem(name).value.trim();
      if (field('_honey')) return;
      const title = field('subject').replace(/[\r\n]+/g, ' ');
      const email = field('email');
      if (!title || !email || !field('name') || !field('organization') || !field('message')) return;
      const payload = {
        _subject: `[사이트 문의] ${form.dataset.kind} · ${title}`,
        _replyto: email, _template: 'table', _honey: '', email,
        '문의유형': form.dataset.kind, '기관·단체명': field('organization'),
        '담당자': field('name'), '연락처': field('phone'),
        '희망 일정': field('date'), '예상 인원': field('count'),
        subject: title, message: field('message'),
      };
      busy = true;
      send.disabled = true;
      form.setAttribute('aria-busy', 'true');
      show('pending');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch('https://formsubmit.co/ajax/galdarbookshop@gmail.com', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload), signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('Submission rejected');
        accepted = true;
        show('success');
      } catch (error) {
        show(error.name === 'AbortError' ? 'timeout' : 'error');
      } finally {
        clearTimeout(timeout);
        busy = false;
        form.removeAttribute('aria-busy');
        send.disabled = accepted;
      }
    });
  });
})();
