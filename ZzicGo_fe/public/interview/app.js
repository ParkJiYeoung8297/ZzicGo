(() => {
  const $ = (id) => document.getElementById(id);
  const categoryEl = $("category");
  const questionEl = $("question");
  const filterEl = $("filter");
  const drawButton = $("draw");
  const resetButton = $("reset");
  const noRepeatEl = $("noRepeat");
  const statusEl = $("status");
  const stopwatchDisplay = $("stopwatch-display");
  const stopwatchStart = $("stopwatch-start");
  const stopwatchStop = $("stopwatch-stop");
  const stopwatchReset = $("stopwatch-reset");

  let questions = [];
  const used = new Set();
  let elapsedMs = 0;
  let startedAt = null;
  let stopwatchInterval = null;

  function formatElapsed(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const pad = (value) => String(value).padStart(2, "0");
    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(Math.floor(totalSeconds / 60))}:${pad(seconds)}`;
  }

  function renderStopwatch() {
    const currentElapsed = elapsedMs + (startedAt === null ? 0 : performance.now() - startedAt);
    stopwatchDisplay.textContent = formatElapsed(currentElapsed);
  }

  function startStopwatch() {
    if (startedAt !== null) return;
    startedAt = performance.now();
    stopwatchInterval = window.setInterval(renderStopwatch, 200);
    stopwatchStart.disabled = true;
    stopwatchStop.disabled = false;
    renderStopwatch();
  }

  function stopStopwatch() {
    if (startedAt === null) return;
    elapsedMs += performance.now() - startedAt;
    startedAt = null;
    window.clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchStart.disabled = false;
    stopwatchStop.disabled = true;
    renderStopwatch();
  }

  function resetStopwatch() {
    stopStopwatch();
    elapsedMs = 0;
    renderStopwatch();
  }

  function currentPool() {
    const category = filterEl.value;
    return questions.filter((item) => !category || item.category === category);
  }

  function updateStatus() {
    const pool = currentPool();
    const remaining = pool.filter((item) => !used.has(item.id)).length;
    statusEl.textContent = noRepeatEl.checked
      ? `남은 질문 ${remaining} / ${pool.length}개`
      : `질문 ${pool.length}개`;
  }

  function draw() {
    let pool = currentPool();
    if (noRepeatEl.checked) pool = pool.filter((item) => !used.has(item.id));
    if (pool.length === 0) {
      categoryEl.textContent = "";
      questionEl.textContent = "모든 질문이 나왔어요! 초기화를 눌러 주세요.";
      questionEl.classList.add("placeholder");
      updateStatus();
      return;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    used.add(picked.id);
    categoryEl.textContent = picked.category;
    questionEl.textContent = picked.question;
    questionEl.classList.remove("placeholder");
    updateStatus();
  }

  function reset() {
    used.clear();
    categoryEl.textContent = "";
    questionEl.textContent = "버튼을 눌러 질문을 뽑아 보세요";
    questionEl.classList.add("placeholder");
    updateStatus();
  }

  drawButton.addEventListener("click", draw);
  resetButton.addEventListener("click", reset);
  stopwatchStart.addEventListener("click", startStopwatch);
  stopwatchStop.addEventListener("click", stopStopwatch);
  stopwatchReset.addEventListener("click", resetStopwatch);
  filterEl.addEventListener("change", updateStatus);
  noRepeatEl.addEventListener("change", updateStatus);
  document.addEventListener("keydown", (event) => {
    if ((event.code === "Space" || event.code === "Enter") &&
        !(event.target instanceof HTMLButtonElement) &&
        !(event.target instanceof HTMLSelectElement) &&
        !(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
      draw();
    }
  });

  fetch(`${window.INTERVIEW_API_BASE_URL}/api/z1/interview/questions`)
    .then((response) => {
      if (!response.ok) throw new Error("질문 요청에 실패했습니다.");
      return response.json();
    })
    .then((data) => {
      questions = data.result || [];
      if (questions.length === 0) throw new Error("등록된 질문이 없습니다.");
      [...new Set(questions.map((item) => item.category))].forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterEl.append(option);
      });
      questionEl.textContent = "버튼을 눌러 질문을 뽑아 보세요";
      filterEl.disabled = false;
      drawButton.disabled = false;
      resetButton.disabled = false;
      updateStatus();
    })
    .catch(() => {
      questionEl.textContent = "질문을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
    });
})();
