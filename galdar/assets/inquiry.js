(() => {
  const dialog = document.getElementById('visit-inquiry');
  if (!dialog) return;
  const form = document.getElementById('inquiry-form');
  const subject = document.getElementById('inquiry-subject');
  const email = document.getElementById('inquiry-email');
  const message = document.getElementById('inquiry-message');
  const kind = document.getElementById('inquiry-kind');
  const send = form.querySelector('[type="submit"]');
  const states = [...form.querySelectorAll('[data-inquiry-state]')];
  let busy = false;
  let trigger = null;
  const heading = document.getElementById('inquiry-heading');
  const defaultHeading = heading.textContent.trim();
  const showState = state => states.forEach(node => { node.hidden = node.dataset.inquiryState !== state; });
  document.querySelectorAll('[data-open-inquiry]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      if (!busy) {
        form.reset();
        showState('');
        send.disabled = false;
        const proposal = button.dataset?.inquiryMode === 'proposal';
        heading.textContent = proposal ? button.textContent.trim() : defaultHeading;
        kind.value = proposal ? button.textContent.trim() : button.closest('article').querySelector('h3').textContent.trim();
        subject.value = kind.value === heading.textContent.trim() ? kind.value : `${kind.value} · ${heading.textContent.trim()}`;
      }
      dialog.showModal();
      subject.focus();
    });
  });
  document.querySelector('[data-close-inquiry]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    if (form.elements.namedItem('_honey').value.trim()) return;
    const title = subject.value.trim().replace(/[\r\n]+/g, ' ');
    const sender = email.value.trim();
    const body = message.value.trim();
    if (!title || !sender || !body) return;
    const payload = {
      _subject: `[사이트 문의] ${title}`,
      _replyto: sender,
      _template: 'table',
      email: sender,
      subject: title,
      message: body,
      '문의유형': kind.value,
      _honey: '',
    };
    busy = true;
    send.disabled = true;
    form.setAttribute('aria-busy', 'true');
    showState('pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    let accepted = false;
    try {
      const response = await fetch('https://formsubmit.co/ajax/galdarbookshop@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('Submission rejected');
      accepted = true;
      showState('success');
    } catch (error) {
      showState(error.name === 'AbortError' ? 'timeout' : 'error');
    } finally {
      clearTimeout(timeout);
      busy = false;
      form.removeAttribute('aria-busy');
      send.disabled = accepted;
    }
  });
})();
