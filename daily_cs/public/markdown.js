/* Small, text-only Markdown renderer. Raw HTML and executable URLs are never parsed. */
'use strict';
window.DailyCsMarkdown = (() => {
  function inline(parent, text) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    for (const part of parts) {
      if (part.startsWith('**') && part.endsWith('**')) {
        const strong = document.createElement('strong'); strong.textContent = part.slice(2, -2); parent.append(strong);
      } else if (part.startsWith('`') && part.endsWith('`')) {
        const code = document.createElement('code'); code.textContent = part.slice(1, -1); parent.append(code);
      } else parent.append(document.createTextNode(part));
    }
  }
  const cells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim());
  function render(markdown) {
    const root = document.createElement('div'); root.className = 'markdown';
    const lines = String(markdown || '').replace(/\r\n?/g, '\n').split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (/^```/.test(line)) {
        const pre = document.createElement('pre'); const code = document.createElement('code');
        const content = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) content.push(lines[i++]);
        code.textContent = content.join('\n'); pre.append(code); root.append(pre); i++; continue;
      }
      if (/^\s*---+\s*$/.test(line)) { root.append(document.createElement('hr')); i++; continue; }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        const el = document.createElement(`h${Math.min(heading[1].length + 1, 6)}`);
        inline(el, heading[2]); root.append(el); i++; continue;
      }
      if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
        const wrap = document.createElement('div'); wrap.className = 'table-scroll'; wrap.tabIndex = 0;
        wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', '핵심 복습 표');
        const table = document.createElement('table'); const head = document.createElement('thead');
        const row = document.createElement('tr');
        cells(line).forEach(text => { const th = document.createElement('th'); th.scope = 'col'; inline(th, text); row.append(th); });
        head.append(row); table.append(head); i += 2;
        const body = document.createElement('tbody');
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
          const tr = document.createElement('tr'); cells(lines[i++]).forEach(text => {
            const td = document.createElement('td'); inline(td, text); tr.append(td);
          }); body.append(tr);
        }
        table.append(body); wrap.append(table); root.append(wrap); continue;
      }
      if (/^>\s?/.test(line)) {
        const quote = document.createElement('blockquote'); const content = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) content.push(lines[i++].replace(/^>\s?/, ''));
        inline(quote, content.join('\n')); root.append(quote); continue;
      }
      if (/^(?:[-*] |\d+\. )/.test(line)) {
        const ordered = /^\d+\./.test(line); const list = document.createElement(ordered ? 'ol' : 'ul');
        const pattern = ordered ? /^\d+\. / : /^[-*] /;
        while (i < lines.length && pattern.test(lines[i])) {
          const li = document.createElement('li'); inline(li, lines[i++].replace(pattern, '')); list.append(li);
        }
        root.append(list); continue;
      }
      const content = [line]; i++;
      while (i < lines.length && lines[i].trim() && !/^(?:#{1,6} |```|> ?|[-*] |\d+\. |---)/.test(lines[i])) content.push(lines[i++]);
      const p = document.createElement('p'); inline(p, content.join('\n')); root.append(p);
    }
    return root;
  }
  return { render };
})();
