(() => {
  const dialog = document.getElementById('club-notify');
  if (!dialog) return;
  const form = document.getElementById('notify-form');
  const phone = document.getElementById('notify-phone');
  const consent = document.getElementById('notify-consent');
  const send = form.querySelector('[type="submit"]');
  const states = [...form.querySelectorAll('[data-notify-state]')];
  let busy = false, accepted = false, trigger = null;
  const digits = () => phone.value.replace(/\D/g, '');
  const validPhone = () => phone.checkValidity() && digits().length >= 9 && digits().length <= 15;
  const sync = () => { send.disabled = busy || accepted || !consent.checked || !validPhone(); };
  const state = value => states.forEach(node => { node.hidden = node.dataset.notifyState !== value; });
  phone.addEventListener('input', sync);
  consent.addEventListener('change', sync);
  document.querySelectorAll('[data-open-notify]').forEach(button => button.addEventListener('click', () => {
    trigger = button;
    if (!busy) { form.reset(); accepted = false; state(''); sync(); }
    dialog.showModal(); phone.focus();
  }));
  document.querySelector('[data-close-notify]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || accepted || !consent.checked || !validPhone() || !form.reportValidity()) { sync(); return; }
    if (form.elements.namedItem('_honey').value.trim()) return;
    const title = document.getElementById('notify-heading').textContent.trim().replace(/[\r\n]+/g,' ');
    const payload = {
      _subject: `[사이트 문의] ${title}`,
      _template: 'table',
      phone: phone.value.trim(),
      '개인정보 수집 및 활용 동의': '동의함',
      '동의 문구': document.getElementById('notify-consent-copy').textContent.trim(),
      '동의 시각 (UTC)': new Date().toISOString(),
      _honey: '',
    };
    busy = true; sync(); state('pending'); form.setAttribute('aria-busy','true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/galdarbookshop@gmail.com', {
        method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify(payload), signal:controller.signal,
      });
      const result = await response.json();
      if (!response.ok || ![true,'true'].includes(result.success)) throw new Error('Submission rejected');
      accepted = true; state('success');
    } catch (error) { state(error.name === 'AbortError' ? 'timeout' : 'error'); }
    finally { clearTimeout(timeout); busy = false; form.removeAttribute('aria-busy'); sync(); }
  });
})();
