'use strict';
const dateInput = document.querySelector('#date');
const questionsNode = document.querySelector('#questions');
const statusNode = document.querySelector('#status');
const retry = document.querySelector('#retry');
const koreanToday = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());
const isDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
let activeRequest;
let currentQuestions = [];
let completed = new Set();
let memory = {};
let storageAvailable = true;
const readingModeInput = document.querySelector('#reading-mode');
let readAll = false;
try { readAll = localStorage.getItem('daily-cs:reading-mode') === 'all'; } catch { /* Use toggle mode when storage is unavailable. */ }
readingModeInput.checked = readAll;
function updateReadingDescription() {
  document.querySelector('#reading-mode-description').textContent = readAll
    ? '모든 답변을 펼쳐서 끊김 없이 읽어요.'
    : '필요한 답변만 하나씩 열어보세요.';
}
updateReadingDescription();
readingModeInput.addEventListener('change', () => {
  readAll = readingModeInput.checked;
  try { localStorage.setItem('daily-cs:reading-mode', readAll ? 'all' : 'toggle'); } catch { /* Mode still works for this visit. */ }
  questionsNode.querySelectorAll('.answer-sections').forEach((section, index) => {
    section.replaceWith(renderAnswerSections(currentQuestions[index]));
  });
  updateReadingDescription();
});
function loadCompleted(date) {
  try {
    const data = JSON.parse(localStorage.getItem(`daily-cs:${date}`) || '[]');
    return new Set(Array.isArray(data) ? data : []);
  } catch { storageAvailable = false; return new Set(memory[date] || []); }
}
function saveCompleted() {
  memory[dateInput.value] = [...completed];
  try { localStorage.setItem(`daily-cs:${dateInput.value}`, JSON.stringify([...completed])); }
  catch { storageAvailable = false; }
  document.querySelector('.storage-note').textContent = storageAvailable
    ? '♥ 풀이 체크는 이 브라우저에 저장돼요. 로그인 없이 누구나 공부할 수 있어요.'
    : '브라우저 저장을 사용할 수 없어 풀이 체크는 현재 페이지에서만 유지돼요.';
}
function updateProgress() {
  const count = currentQuestions.filter(q => completed.has(q.id)).length;
  document.querySelector('#progress-count').textContent = `${count} / ${currentQuestions.length}`;
  document.querySelector('#progress-bar').style.width = `${currentQuestions.length ? count / currentQuestions.length * 100 : 0}%`;
}
function burst(button) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle'; particle.setAttribute('aria-hidden', 'true');
    particle.textContent = i % 3 === 0 ? '♥' : '✦';
    const angle = i * Math.PI / 6;
    particle.style.setProperty('--x', `${Math.cos(angle) * 65}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * 65 - 20}px`);
    button.append(particle); setTimeout(() => particle.remove(), 850);
  }
}
const markdown = text => window.DailyCsMarkdown.render(text);
function questionContent(text) {
  const lines = text.split('\n');
  const title = lines[0].replace(/^#+\s*/, '');
  const metadata = text.match(/\*\*분야:\*\*\s*(.*?)\s*\|\s*\*\*난이도:\*\*\s*(.*)/);
  const prompt = text.slice(lines[0].length).replace(/^\s*\*\*분야:.*$/m, '').replace(/^### ❓ 면접 질문\s*$/m, '').trim();
  return { title, category: metadata?.[1], difficulty: metadata?.[2], prompt };
}
function renderAnswerSections(q) {
  const answerSections = document.createElement('div');
  answerSections.className = `answer-sections${readAll ? ' reading-all' : ''}`;
  const parts = q.answer.split(/(?=^### )/m).filter(part => part.trim());
  parts.forEach((part, sectionIndex) => {
    const heading = part.match(/^### (.+)(?:\n|$)/);
    const title = heading ? heading[1].replace(/^[^가-힣A-Za-z0-9]+/, '') : '모범 답안';
    const section = document.createElement(readAll ? 'section' : 'details');
    const label = document.createElement(readAll ? 'h4' : 'summary');
    label.textContent = title;
    if (!readAll) {
      const hint = document.createElement('span'); hint.className = 'summary-hint';
      hint.textContent = sectionIndex === 0 ? '답변 확인하기' : '펼쳐보기'; label.append(hint);
    }
    const answer = markdown(heading ? part.slice(heading[0].length) : part);
    answer.classList.add('answer'); section.append(label, answer); answerSections.append(section);
  });
  return answerSections;
}
function renderQuestion(q, index) {
  const card = document.createElement('article'); card.className = 'question-card';
  const top = document.createElement('div'); top.className = 'card-top';
  const number = document.createElement('span'); number.className = 'question-number';
  number.textContent = `QUESTION ${String(index + 1).padStart(2, '0')}`;
  const content = questionContent(q.question);
  const badge = document.createElement('span'); badge.className = 'think-badge'; badge.textContent = content.category || 'CS 면접';
  top.append(number, badge);
  const title = document.createElement('h3'); title.textContent = content.title;
  const prompt = markdown(content.prompt); prompt.classList.add('question-prompt');
  const difficulty = document.createElement('span'); difficulty.className = 'difficulty';
  difficulty.textContent = content.difficulty ? `난이도 ${content.difficulty}` : '먼저 1분 동안 답해보세요';
  const answerSections = renderAnswerSections(q);
  const bottom = document.createElement('div'); bottom.className = 'card-bottom';
  const hint = document.createElement('span'); hint.textContent = '내 말로 설명할 수 있다면';
  const button = document.createElement('button'); button.className = 'heart-button';
  const label = document.createElement('span'); button.append(label);
  function sync() {
    const checked = completed.has(q.id);
    button.setAttribute('aria-pressed', String(checked));
    button.setAttribute('aria-label', `${index + 1}번 문제 ${checked ? '풀이 완료 취소' : '풀이 완료 표시'}`);
    label.textContent = checked ? '♥ 풀었어요' : '♡ 풀었어요';
    card.classList.toggle('completed', checked);
  }
  button.addEventListener('click', () => {
    if (completed.has(q.id)) completed.delete(q.id);
    else { completed.add(q.id); burst(button); }
    saveCompleted(); sync(); updateProgress();
  });
  sync(); bottom.append(hint, button); card.append(top, title, difficulty, prompt, answerSections, bottom);
  return card;
}
function isWeekend(date) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
}
function weekdayDates(date) {
  const selected = new Date(`${date}T12:00:00Z`);
  const day = selected.getUTCDay();
  selected.setUTCDate(selected.getUTCDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 5 }, (_, index) => {
    const value = new Date(selected);
    value.setUTCDate(value.getUTCDate() + index);
    return value.toISOString().slice(0, 10);
  });
}
function setWeekendLayout(weekend) {
  document.querySelector('#hero-title').textContent = weekend
    ? '이번주 문제들을 복습해보아요' : '오늘의 세 질문이\n내일의 자신감이 되도록';
  document.querySelector('#hero-description').textContent = weekend
    ? '이번 주에 배운 질문을 다시 떠올리고, 내 말로 설명해 보세요.'
    : '1분 동안 내 말로 답해보고, 모범 답안과 비교해 보세요.';
  for (const selector of ['.view-options', '.progress-row', '.progress-track', '.storage-note']) {
    document.querySelector(selector).hidden = weekend;
  }
}
function emptyQuestionsMessage(date) {
  return date < koreanToday()
    ? '이날은 공개된 질문이 없어요. 질문은 평일 오전 7시에 공개됩니다.'
    : '아직 공개된 질문이 없어요. 질문은 평일 오전 7시에 공개됩니다.';
}
async function loadWeekend(date, controller) {
  const base = (window.DAILY_CS_CONFIG?.apiBaseUrl || '').replace(/\/$/, '');
  const days = await Promise.all(weekdayDates(date).map(async value => {
    const response = await fetch(`${base}/api/z1/cs/days/${value}`, {
      signal: controller.signal, credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/json' }
    });
    if (response.status === 404) return [];
    if (!response.ok) throw new Error('weekly request failed');
    const data = await response.json();
    if (!data.isSuccess || !Array.isArray(data.result?.questions)) throw new Error('invalid weekly response');
    return data.result.questions;
  }));
  if (activeRequest !== controller) return;
  const groups = [];
  days.forEach((questions, index) => {
    if (!questions.length) return;
    const group = document.createElement('section'); group.className = 'weekly-group';
    const heading = document.createElement('h3'); heading.textContent = ['월요일', '화요일', '수요일', '목요일', '금요일'][index];
    const list = document.createElement('ol'); list.className = 'weekly-questions';
    questions.forEach(q => {
      const content = questionContent(q.question);
      const item = document.createElement('li');
      const title = document.createElement('h4'); title.textContent = content.title;
      item.append(title);
      if (content.prompt) item.append(markdown(content.prompt));
      list.append(item);
    });
    group.append(heading, list); groups.push(group);
  });
  questionsNode.replaceChildren(...groups);
  statusNode.textContent = groups.length ? '' : (date < koreanToday()
    ? emptyQuestionsMessage(date) : '이번 주에 공개된 문제가 아직 없어요.');
}
function publicationMessage(date, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hourCycle: 'h23'
  }).formatToParts(now);
  const part = type => parts.find(value => value.type === type).value;
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  if (!isWeekend(date) && date === today && Number(part('hour')) < 7) return '오전 7시 공개 예정입니다';
  return '';
}
async function load() {
  const date = dateInput.value;
  if (!isDate(date) || date > koreanToday()) return;
  activeRequest?.abort(); const controller = new AbortController(); activeRequest = controller;
  document.querySelector('#day-introduction').hidden = true;
  document.querySelector('#day-review').hidden = true;
  document.querySelector('#day-label').textContent = '오늘의 학습';
  document.querySelector('#daily-title').textContent = '오늘의 학습';
  const weekend = isWeekend(date);
  setWeekendLayout(weekend);
  questionsNode.replaceChildren(); currentQuestions = []; updateProgress(); retry.hidden = true;
  statusNode.textContent = '오늘의 질문을 가져오고 있어요…';
  const url = new URL(location.href); url.searchParams.set('date', date); history.replaceState(null, '', url);
  const message = publicationMessage(date);
  if (message) { statusNode.textContent = message; return; }
  const timeout = setTimeout(() => controller.abort('timeout'), 15000);
  try {
    if (weekend) { await loadWeekend(date, controller); return; }
    const base = (window.DAILY_CS_CONFIG?.apiBaseUrl || '').replace(/\/$/, '');
    const response = await fetch(`${base}/api/z1/cs/days/${date}`, {
      signal: controller.signal, credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/json' }
    });
    if (activeRequest !== controller) return;
    if (response.status === 404) {
      statusNode.textContent = emptyQuestionsMessage(date); return;
    }
    if (!response.ok) throw new Error('request failed');
    const data = await response.json();
    if (!data.isSuccess || !Array.isArray(data.result?.questions)) throw new Error('invalid response');
    if (activeRequest !== controller) return;
    const intro = document.querySelector('#day-introduction');
    const review = document.querySelector('#day-review');
    if (data.result.introduction) {
      const body = data.result.introduction.replace(/^# .+\n?/m, '').replace(/^\*\*DAY.+\n?/m, '').trim();
      intro.replaceChildren(markdown(body)); intro.hidden = false;
    }
    if (data.result.review) { review.replaceChildren(markdown(data.result.review)); review.hidden = false; }
    currentQuestions = data.result.questions;
    completed = loadCompleted(date);
    statusNode.textContent = currentQuestions.length ? '' : emptyQuestionsMessage(date);
    questionsNode.replaceChildren(...currentQuestions.map(renderQuestion)); updateProgress();
  } catch {
    if (activeRequest !== controller) return;
    statusNode.textContent = '질문을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'; retry.hidden = false;
  } finally { clearTimeout(timeout); }
}
const requestedDate = new URLSearchParams(location.search).get('date');
dateInput.value = requestedDate && isDate(requestedDate) && requestedDate <= koreanToday() ? requestedDate : koreanToday();
dateInput.max = koreanToday();
dateInput.addEventListener('change', load); retry.addEventListener('click', load);
load();
