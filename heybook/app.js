const STORAGE_KEY = 'hey-branding-2026-member-notes-v1';
let notesByBook = {};
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) notesByBook = saved;
} catch { /* Start with an empty archive when storage is unavailable. */ }
function renderNotes(entry, key) {
  const notes = Array.isArray(notesByBook[key]) ? notesByBook[key].filter(note => note && typeof note.author === 'string' && typeof note.text === 'string') : [];
  const container = entry.querySelector('.notes-scroll');
  container.replaceChildren();
  notes.forEach(note => {
    const card = document.createElement('article');
    card.className = 'note-card';
    if (note.sentence) {
      const sentence = document.createElement('p');
      sentence.className = 'note-sentence';
      sentence.textContent = note.sentence.trim()
        .split(/\n+|(?<=[.!?。！？])\s+/u)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => `"${line.replace(/^["“]|["”]$/g, '')}"`)
        .join('\n');
      card.append(sentence);
    }
    const content = document.createElement('p');
    content.className = 'note-reflection';
    content.textContent = note.text;
    const meta = document.createElement('div');
    meta.className = 'note-meta';
    const author = document.createElement('span');
    author.textContent = note.author;
    const date = document.createElement('time');
    if (note.createdAt && Number.isFinite(Date.parse(note.createdAt))) {
      date.dateTime = note.createdAt;
      const parts = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date(note.createdAt));
      const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
      date.textContent = `${values.month}. ${values.day}. ${values.hour}:${values.minute}`;
    } else {
      date.textContent = note.date || '';
    }
    meta.append(author, date);
    card.append(content, meta);
    container.append(card);
  });
}
document.querySelectorAll('.book-entry').forEach(entry => {
  const key = entry.dataset.book;
  renderNotes(entry, key);
  entry.querySelector('.expand-button').addEventListener('click', event => {
    const expanded = entry.classList.toggle('is-expanded');
    event.currentTarget.setAttribute('aria-expanded', String(expanded));
    event.currentTarget.textContent = expanded ? '접기' : '펼쳐서 보기';
  });
  entry.querySelector('.note-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const author = String(data.get('author') || '').trim();
    const text = String(data.get('note') || '').trim();
    const sentence = String(data.get('sentence') || '').trim();
    if (!author || !sentence || !text) return;
    const next = {...notesByBook, [key]: [{author, sentence, text, createdAt: new Date().toISOString(), date: new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul', month:'2-digit', day:'2-digit'}).format(new Date())}, ...(Array.isArray(notesByBook[key]) ? notesByBook[key] : [])]};
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { window.alert('기록을 저장하지 못했습니다. 브라우저 저장 공간을 확인해주세요.'); return; }
    notesByBook = next;
    renderNotes(entry, key);
    event.currentTarget.reset();
  });
});

function fitNoteField(field) {
  field.style.height = 'auto';
  field.style.height = `${Math.max(parseFloat(getComputedStyle(field).minHeight) || 0, field.scrollHeight + 1)}px`;
}
document.querySelectorAll('.note-form textarea').forEach(field => {
  field.addEventListener('input', () => fitNoteField(field));
  field.form.addEventListener('reset', () => requestAnimationFrame(() => fitNoteField(field)));
  fitNoteField(field);
});
window.addEventListener('resize', () => {
  document.querySelectorAll('.note-form textarea').forEach(fitNoteField);
});
document.querySelectorAll('.expand-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.note-form textarea').forEach(fitNoteField);
  });
});
