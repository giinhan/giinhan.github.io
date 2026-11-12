const STORAGE_KEY = 'hey-branding-2026-member-notes-v1';
const NOTES_API = 'https://script.google.com/macros/s/AKfycbzsXH4Ael7BUmBnzgFEm761mPDGLqovOuMSgSnXWwV4SJyPVXV0DeFVsnLE39qhnO5Gdw/exec';
// Existing local records stay in localStorage; shared records come from Google Sheets.
let notesByBook = {};
let notesRevision = 0;
let loadSequence = 0;
const pendingSubmissions = new Map();

function setNotesStatus(entry, message, retry = false) {
  const status = entry.querySelector('.notes-status');
  status.replaceChildren();
  if (message) status.append(document.createTextNode(message));
  if (retry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '다시 불러오기';
    button.addEventListener('click', () => loadSharedNotes());
    status.append(button);
  }
}

async function callNotesApi(options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`${NOTES_API}?_=${Date.now()}`, {
      ...options, credentials: 'omit', redirect: 'follow', signal: controller.signal
    });
    if (!response.ok) throw new Error('서버에 연결하지 못했습니다.');
    const result = await response.json();
    if (!result || result.ok !== true) throw new Error(result?.error || '요청을 완료하지 못했습니다.');
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

function groupSharedNotes(notes) {
  if (!Array.isArray(notes)) throw new Error('기록 응답을 확인하지 못했습니다.');
  const grouped = {};
  notes.forEach(note => {
    if (!note || !Number.isInteger(note.book) || note.book < 0 || note.book > 3 ||
        typeof note.author !== 'string' || typeof note.text !== 'string' ||
        typeof note.sentence !== 'string') return;
    (grouped[note.book] ||= []).push(note);
  });
  return grouped;
}

async function loadSharedNotes(quiet = false) {
  const sequence = ++loadSequence;
  const revision = notesRevision;
  const entries = document.querySelectorAll('.book-entry');
  if (!quiet) entries.forEach(entry => setNotesStatus(entry, '기록을 불러오는 중…'));
  try {
    const result = await callNotesApi();
    const grouped = groupSharedNotes(result.notes);
    if (sequence !== loadSequence || revision !== notesRevision) return;
    notesByBook = grouped;
    entries.forEach(entry => {
      renderNotes(entry, entry.dataset.book);
      setNotesStatus(entry, '');
    });
  } catch (error) {
    if (sequence !== loadSequence || revision !== notesRevision) return;
    entries.forEach(entry => setNotesStatus(entry, '기록을 불러오지 못했습니다. ', true));
  }
}

async function saveSharedNote(key, fields, migrationId = null) {
  const signature = JSON.stringify([key, fields.author, fields.sentence, fields.text]);
  let id = migrationId || pendingSubmissions.get(signature);
  if (!id) {
    id = crypto.randomUUID();
    pendingSubmissions.set(signature, id);
  }
  const payload = {id, book: Number(key), ...fields};
  let result;
  try {
    // A form-encoded POST avoids a cross-origin preflight request.
    result = await callNotesApi({method: 'POST', body: new URLSearchParams(payload)});
  } catch (error) {
    // A response may be lost after the sheet was updated. Verify this exact ID.
    try {
      const verification = await callNotesApi();
      const saved = verification.notes?.find(note => note.id === id);
      if (saved) result = {ok: true, ...saved};
    } catch { /* Keep the same ID for a safe retry and leave the form intact. */ }
    if (!result) throw error;
  }
  let createdAt = result.createdAt;
  if (!createdAt) {
    const verification = await callNotesApi();
    const saved = verification.notes?.find(note => note.id === id);
    if (!saved) throw new Error('저장 여부를 확인하지 못했습니다. 다시 눌러주세요.');
    createdAt = saved.createdAt;
  }
  notesRevision++;
  const saved = {...payload, createdAt};
  notesByBook[key] = [saved, ...(notesByBook[key] || []).filter(note => note.id !== id)];
  pendingSubmissions.delete(signature);
  return saved;
}

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
  const status = document.createElement('p');
  status.className = 'notes-status';
  status.setAttribute('role', 'status');
  entry.querySelector('.notes-scroll').before(status);
  renderNotes(entry, key);
  entry.querySelector('.expand-button').addEventListener('click', event => {
    const expanded = entry.classList.toggle('is-expanded');
    event.currentTarget.setAttribute('aria-expanded', String(expanded));
    event.currentTarget.textContent = expanded ? '접기' : '펼쳐서 보기';
  });
  const form = entry.querySelector('.note-form');
  const formStatus = document.createElement('p');
  formStatus.className = 'save-status';
  formStatus.setAttribute('role', 'status');
  form.append(formStatus);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    const data = new FormData(form);
    const author = String(data.get('author') || '').trim();
    const text = String(data.get('note') || '').trim();
    const sentence = String(data.get('sentence') || '').trim();
    if (!author || !sentence || !text) return;
    button.disabled = true;
    button.textContent = '저장 중…';
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => { field.readOnly = true; });
    formStatus.textContent = '';
    try {
      await saveSharedNote(key, {author, text, sentence});
      renderNotes(entry, key);
      form.reset();
      formStatus.textContent = '저장했습니다.';
      setNotesStatus(entry, '');
      loadSharedNotes(true);
    } catch (error) {
      formStatus.textContent = '저장을 확인하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 눌러주세요.';
    } finally {
      fields.forEach(field => { field.readOnly = false; });
      button.disabled = false;
      button.textContent = '기록 남기기';
    }
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

loadSharedNotes();
setInterval(() => { if (!document.hidden) loadSharedNotes(true); }, 30000);


// Import only real records from this club's old storage key; retain the backup.
async function migrateBrowserNotes() {
  let legacy;
  try { legacy = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return; }
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return;
  const records = [];
  for (let book = 0; book < 4; book++) {
    if (!Array.isArray(legacy[book])) continue;
    legacy[book].forEach(note => {
      if (!note || typeof note.author !== 'string' || typeof note.text !== 'string') return;
      const author = note.author.trim();
      const text = note.text.trim();
      const sentence = typeof note.sentence === 'string' && note.sentence.trim()
        ? note.sentence.trim() : '(별도 문장 없이 작성한 기존 기록)';
      if (author && text) records.push({book, author, text, sentence, originalDate: note.createdAt || note.date || ''});
    });
  }
  if (!records.length) return;
  const status = document.createElement('p');
  status.className = 'migration-status';
  status.setAttribute('role', 'status');
  document.getElementById('books').prepend(status);
  let busy = false;
  async function transfer() {
    if (busy) return;
    busy = true;
    status.textContent = '이 브라우저의 기존 기록을 확인하는 중…';
    let copied = 0;
    try {
      const server = await callNotesApi();
      if (!Array.isArray(server.notes)) throw new Error('Invalid records');
      const existing = server.notes;
      for (const record of records) {
        const bytes = new TextEncoder().encode(JSON.stringify(record));
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const id = 'legacy_' + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        const matching = existing.find(note => note.id === id ||
          (note.book === record.book && note.author === record.author &&
           note.sentence === record.sentence && note.text === record.text));
        if (!matching) {
          if (record.author.length > 40 || record.text.length > 1000 || record.sentence.length > 1000)
            throw new Error('기존 기록 중 글자 수 제한을 초과한 항목이 있습니다.');
          status.textContent = `기존 기록을 옮기는 중… ${copied + 1}/${records.length}`;
          const saved = await saveSharedNote(String(record.book), {
            author: record.author, sentence: record.sentence, text: record.text
          }, id);
          // Confirm the exact record can be read back before considering it migrated.
          const verification = await callNotesApi();
          if (!verification.notes?.some(note => note.id === id)) throw new Error('Migration not confirmed');
          existing.push(saved);
          copied++;
        }
      }
      status.remove();
      await loadSharedNotes(true);
    } catch (error) {
      status.textContent = '일부 기존 기록을 옮기지 못했습니다. 브라우저 원본은 보관되어 있습니다. ';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = '다시 옮기기';
      retry.addEventListener('click', transfer);
      status.append(retry);
    } finally { busy = false; }
  }
  await transfer();
}
migrateBrowserNotes();
