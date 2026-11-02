(() => {
  const excluded = 'script,style,textarea,pre,code,svg,math,option,[contenteditable],[data-english-tracking]';
  const english = /[A-Za-z]+(?:[0-9]*[A-Za-z]*)(?:[ \u00a0’'&.\/-]+[A-Za-z0-9]+)*/g;
  const pending = new Set();
  let frame;
  function wrap(root) {
    if (root.nodeType === 3) {
      if (!root.parentElement || root.parentElement.closest(excluded) || !/[A-Za-z]/.test(root.data)) return;
      const matches = [...root.data.matchAll(english)];
      if (!matches.length) return;
      const fragment = document.createDocumentFragment();
      // Keep each original text node a single flex item, including mixed Korean/English labels.
      const copy = document.createElement('span');
      copy.dataset.englishTracking = 'copy';
      let offset = 0;
      for (const match of matches) {
        copy.append(document.createTextNode(root.data.slice(offset, match.index)));
        const run = document.createElement('span');
        run.dataset.englishTracking = 'run';
        run.textContent = match[0];
        copy.append(run);
        offset = match.index + match[0].length;
      }
      copy.append(document.createTextNode(root.data.slice(offset)));
      fragment.append(copy);
      root.replaceWith(fragment);
      return;
    }
    if (root.nodeType !== 1 || root.closest(excluded)) return;
    [...root.childNodes].forEach(wrap);
  }
  function measure() {
    document.querySelectorAll('[data-english-tracking="run"]').forEach(run => {
      const style = getComputedStyle(run.parentElement);
      const original = parseFloat(style.letterSpacing) || 0;
      const size = parseFloat(style.fontSize) || 16;
      const tracking = original > 0 ? original * 1.5 : original < 0 ? original * .5 : size * .025;
      run.style.letterSpacing = tracking + 'px';
    });
  }
  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'characterData') pending.add(record.target);
      else record.addedNodes.forEach(node => pending.add(node));
    });
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      observer.disconnect();
      pending.forEach(node => { if (node.isConnected) wrap(node); });
      pending.clear();
      measure();
      observe();
    });
  });
  function observe() { observer.observe(document.body, {childList:true,subtree:true,characterData:true}); }
  wrap(document.body);
  measure();
  observe();
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
})();
