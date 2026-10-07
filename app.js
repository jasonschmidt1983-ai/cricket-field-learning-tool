const positions = [
  { name: 'Wicket-keeper', short: 'KEEPER', x: 49.6, y: 35.6, description: 'Behind the batter, directly in line with the stumps. The keeper receives the ball after it passes the batter.', cue: 'Directly behind the batter, at the north end of the pitch.' },
  { name: 'Slip', short: 'SLIP', x: 43.3, y: 34.5, description: 'A close catching position just to the off side of the wicket-keeper, angled behind the batter.', cue: 'Just left of the keeper, close to the north stumps.' },
  { name: 'Gully', short: 'GULLY', x: 40.4, y: 37, description: 'A catching position wider than slip on the off side, between slip and point.', cue: 'Left of slip, slightly wider and lower.' },
  { name: 'Third man', short: 'THIRD MAN', x: 31.5, y: 21.5, description: 'Deep behind square on the off side, near the boundary. Third man covers edges behind the batter.', cue: 'Deep upper-left on the off side.' },
  { name: 'Fine leg', short: 'FINE LEG', x: 65, y: 18.5, description: 'Deep behind square on the leg side, near the boundary.', cue: 'Deep upper-right on the leg side.' },
  { name: 'Square leg', short: 'SQUARE LEG', x: 66.8, y: 40.7, description: 'On the leg side, square to the batter.', cue: 'Right of the batter, level with the pitch.' },
  { name: 'Point', short: 'POINT', x: 35.8, y: 40.9, description: 'On the off side, square to the batter.', cue: 'Left of the batter, level with the pitch.' },
  { name: 'Cover', short: 'COVER', x: 34.1, y: 48.2, description: 'On the off side, in front of square.', cue: 'Left of the pitch, below point.' },
  { name: 'Extra Cover', short: 'EXTRA COVER', x: 35.2, y: 55.5, description: 'On the off side between cover and mid-off.', cue: 'Left of the pitch, below cover.' },
  { name: 'Mid-off', short: 'MID-OFF', x: 40.6, y: 62.7, description: 'On the off side, closer to the bowler than extra cover.', cue: 'Lower-left, between extra cover and the bowler.' },
  { name: 'Long-off', short: 'LONG-OFF', x: 40.4, y: 88.7, description: 'Deep on the off side, near the boundary.', cue: 'Deep lower-left on the off side.' },
  { name: 'Mid-wicket', short: 'MID-WICKET', x: 66.3, y: 48.5, description: 'On the leg side, in front of square.', cue: 'Right of the pitch, below square leg.' },
  { name: 'Mid-on', short: 'MID-ON', x: 63, y: 59.7, description: 'On the leg side, closer to the bowler than mid-wicket.', cue: 'Lower-right, between mid-wicket and the bowler.' },
  { name: 'Long-on', short: 'LONG-ON', x: 59.7, y: 88.7, description: 'Deep on the leg side, near the boundary.', cue: 'Deep lower-right on the leg side.' }
];

const formats = {
  conventional: {
    label: 'Conventional cricket',
    help: 'Standard field markings',
    hint: 'Circular field layout for a right-handed batter. Keeper and batter are north; bowler is south.',
    chip: '30 yd inner circle',
    pitch: '27.43 m',
    announcement: 'Conventional cricket selected. Standard field markings are shown.'
  },
  blind: {
    label: 'Blind cricket · NCIC',
    help: 'NCIC BLV field markings',
    hint: 'Circular NCIC BLV layout. Keeper and batter are north; bowler is south.',
    chip: '18 m inner circle · B1 ring 4.5 m',
    pitch: '18.0 m',
    announcement: 'Blind cricket selected. The 18 metre inner circle and 4.5 metre B1 scoring rings are shown.'
  }
};

const state = { selected: 0, mode: 'guide', format: 'blind', speech: false, quizIndex: 0, quizAnswered: false, score: 0 };
const els = {
  markers: document.querySelector('#field-markers'),
  list: document.querySelector('#position-list'),
  title: document.querySelector('#position-title'),
  description: document.querySelector('#position-description'),
  cue: document.querySelector('#position-cue'),
  number: document.querySelector('#position-number'),
  progress: document.querySelector('#progress-label'),
  live: document.querySelector('#live-region'),
  speechToggle: document.querySelector('#speech-toggle'),
  speechLabel: document.querySelector('#speech-toggle .icon-button__label'),
  speakButton: document.querySelector('#speak-button'),
  speakLabel: document.querySelector('#speak-label'),
  previous: document.querySelector('#previous-button'),
  next: document.querySelector('#next-button'),
  guideTab: document.querySelector('#guide-tab'),
  quizTab: document.querySelector('#quiz-tab'),
  guidePanel: document.querySelector('#guide-panel'),
  quizPanel: document.querySelector('#quiz-panel'),
  quizNumber: document.querySelector('#quiz-number'),
  quizQuestion: document.querySelector('#quiz-question'),
  quizOptions: document.querySelector('#quiz-options'),
  quizFeedback: document.querySelector('#quiz-feedback'),
  quizSpeak: document.querySelector('#quiz-speak-button'),
  nextQuiz: document.querySelector('#next-quiz-button'),
  restartQuiz: document.querySelector('#restart-quiz-button'),
  coachStatus: document.querySelector('#coach-status-label'),
  fieldMap: document.querySelector('.field-map'),
  fieldHint: document.querySelector('#field-hint'),
  formatChip: document.querySelector('#format-chip'),
  formatHelp: document.querySelector('#format-help'),
  pitchMeasure: document.querySelector('#pitch-measure'),
  conventionalFormat: document.querySelector('#conventional-format'),
  blindFormat: document.querySelector('#blind-format'),
  orientationTop: document.querySelector('#orientation-top'),
  orientationBottom: document.querySelector('#orientation-bottom'),
  orientationChip: document.querySelector('#orientation-chip')
};

function announce(message) {
  els.live.textContent = '';
  window.setTimeout(() => { els.live.textContent = message; }, 30);
}

function speak(text) {
  if (!state.speech || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function positionText(index) {
  const p = positions[index];
  return `${p.name}. ${p.description} Spatial cue: ${p.cue}`;
}

function setFormat(format, shouldSpeak = true) {
  const detail = formats[format];
  if (!detail) return;
  state.format = format;
  const isBlind = format === 'blind';
  els.fieldMap.classList.toggle('field-map--blind', isBlind);
  els.fieldMap.classList.toggle('field-map--conventional', !isBlind);
  els.conventionalFormat.classList.toggle('format-option--active', !isBlind);
  els.blindFormat.classList.toggle('format-option--active', isBlind);
  els.conventionalFormat.setAttribute('aria-checked', String(!isBlind));
  els.blindFormat.setAttribute('aria-checked', String(isBlind));
  els.fieldHint.textContent = detail.hint;
  els.formatChip.innerHTML = `<span class="format-chip__dot"></span>${detail.chip}`;
  els.formatHelp.textContent = detail.help;
  els.pitchMeasure.textContent = detail.pitch;
  els.orientationTop.innerHTML = '<span aria-hidden="true">↑</span> KEEPER · BATTER';
  els.orientationBottom.innerHTML = 'BOWLER <span aria-hidden="true">↓</span>';
  els.orientationChip.innerHTML = '<span class="orientation-chip__dot"></span>North = keeper · batter';
  renderMarkers();
  if (shouldSpeak) { announce(detail.announcement); speak(detail.announcement); }
}

function fieldPosition(position, index) {
  return position;
}

function renderMarkers() {
  els.markers.innerHTML = positions.map((position, index) => {
    const layoutPosition = fieldPosition(position, index);
    return `
    <button class="field-marker ${index === state.selected ? 'field-marker--active' : ''}" style="left:${layoutPosition.x}%;top:${layoutPosition.y}%" type="button" data-position="${index}" aria-label="${position.name}: ${position.cue}" aria-pressed="${index === state.selected}">
      <span class="field-marker__dot" aria-hidden="true"></span><span class="field-marker__label">${position.name}</span>
    </button>`;
  }).join('');
  els.markers.querySelectorAll('[data-position]').forEach((button) => button.addEventListener('click', () => selectPosition(Number(button.dataset.position), true)));
}

function renderPositionList() {
  els.list.innerHTML = positions.map((position, index) => `
    <button class="position-list__button ${index === state.selected ? 'position-list__button--active' : ''}" type="button" data-position="${index}" aria-label="Learn about ${position.name}" aria-current="${index === state.selected ? 'true' : 'false'}">
      <span class="position-list__number">${String(index + 1).padStart(2, '0')}</span><span class="position-list__name">${position.name}</span>
    </button>`).join('');
  els.list.querySelectorAll('[data-position]').forEach((button) => button.addEventListener('click', () => selectPosition(Number(button.dataset.position), true)));
}

function updateGuide() {
  const p = positions[state.selected];
  els.title.textContent = p.name;
  els.description.textContent = p.description;
  els.cue.textContent = p.cue;
  els.number.textContent = String(state.selected + 1).padStart(2, '0');
  els.progress.textContent = `${state.selected + 1} / ${positions.length}`;
  els.previous.disabled = state.selected === 0;
  els.next.textContent = state.selected === positions.length - 1 ? 'Restart positions  ↺' : 'Next position  →';
  els.speakLabel.textContent = state.speech ? 'Read this position aloud' : 'Turn on voice to hear this';
  els.coachStatus.textContent = state.selected === 0 ? 'START HERE' : 'POSITION SELECTED';
  renderMarkers();
  renderPositionList();
}

function selectPosition(index, shouldSpeak = false) {
  const source = document.activeElement;
  const sourceKind = source?.classList.contains('position-list__button') ? 'list' : source?.classList.contains('field-marker') ? 'marker' : null;
  state.selected = (index + positions.length) % positions.length;
  updateGuide();
  if (sourceKind) window.requestAnimationFrame(() => document.querySelector(sourceKind === 'list' ? `.position-list__button[data-position="${state.selected}"]` : `.field-marker[data-position="${state.selected}"]`)?.focus());
  const message = positionText(state.selected);
  announce(message);
  if (shouldSpeak) speak(message);
}

function setMode(mode) {
  state.mode = mode;
  const guide = mode === 'guide';
  const quiz = mode === 'quiz';
  els.guideTab.classList.toggle('mode-tab--active', guide);
  els.quizTab.classList.toggle('mode-tab--active', quiz);
  els.guideTab.setAttribute('aria-selected', String(guide));
  els.quizTab.setAttribute('aria-selected', String(quiz));
  els.guidePanel.hidden = !guide;
  els.quizPanel.hidden = !quiz;
  document.querySelectorAll('.rail-step').forEach((step, index) => step.classList.toggle('rail-step--active', guide ? index < 2 : quiz && index === 2 || mode === 'explore' && index === 1));
  els.coachStatus.textContent = guide ? (state.selected === 0 ? 'START HERE' : 'POSITION SELECTED') : quiz ? 'RECALL MODE' : 'FREE EXPLORE';
  if (quiz) renderQuiz();
  announce(guide ? 'Guide mode. Use the field map or Next position to explore.' : quiz ? 'Quiz mode. Choose the position that matches the question.' : 'Guide closed. Explore freely from the field map.');
}

function createQuizOptions(correctIndex) {
  const candidates = [correctIndex];
  while (candidates.length < 4) {
    const candidate = Math.floor(Math.random() * positions.length);
    if (!candidates.includes(candidate)) candidates.push(candidate);
  }
  return candidates.sort(() => Math.random() - 0.5);
}

function renderQuiz() {
  const correct = state.quizIndex % positions.length;
  const correctPosition = positions[correct];
  const questionTemplates = [
    `Which position is ${correctPosition.cue.toLowerCase()}`,
    `Which fielding position matches this cue: ${correctPosition.cue}`,
    `Which position protects this area: ${correctPosition.cue}`
  ];
  els.quizNumber.textContent = String(state.quizIndex + 1).padStart(2, '0');
  els.quizQuestion.textContent = questionTemplates[state.quizIndex % questionTemplates.length];
  document.querySelector('#quiz-panel .coach-card__description').textContent = 'Choose the best answer. You’ll get a clear cue after every try.';
  els.quizFeedback.hidden = true;
  els.quizFeedback.className = 'quiz-feedback';
  els.quizSpeak.hidden = true;
  els.nextQuiz.hidden = true;
  state.quizAnswered = false;
  els.quizOptions.innerHTML = createQuizOptions(correct).map((index) => `<button class="quiz-option" type="button" data-answer="${index}">${positions[index].name}</button>`).join('');
  els.quizOptions.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => answerQuiz(Number(button.dataset.answer), correct)));
}

function renderQuizComplete() {
  const scoreText = `You finished the field check with ${state.score} out of ${positions.length} correct.`;
  els.quizNumber.textContent = 'DONE';
  els.quizQuestion.textContent = 'You finished the field check.';
  document.querySelector('#quiz-panel .coach-card__description').textContent = scoreText + ' Repeat the quiz or return to guided learning to strengthen the map.';
  els.quizOptions.innerHTML = '';
  els.quizFeedback.hidden = true;
  els.quizSpeak.hidden = false;
  els.quizSpeak.querySelector('span:nth-child(2)').textContent = 'Read my result aloud';
  els.nextQuiz.hidden = true;
  announce(scoreText);
  speak(scoreText);
}

function answerQuiz(answer, correct) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;
  const isCorrect = answer === correct;
  if (isCorrect) state.score += 1;
  els.quizOptions.querySelectorAll('.quiz-option').forEach((button) => {
    const option = Number(button.dataset.answer);
    button.disabled = true;
    if (option === correct) button.classList.add('quiz-option--correct');
    if (option === answer && !isCorrect) button.classList.add('quiz-option--wrong');
  });
  els.quizFeedback.hidden = false;
  els.quizFeedback.classList.add(isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong');
  els.quizFeedback.textContent = isCorrect ? `Good choice. ${positions[correct].name} is ${positions[correct].cue.toLowerCase()}` : `Not quite. The answer is ${positions[correct].name}: ${positions[correct].cue}`;
  els.nextQuiz.hidden = false;
  els.nextQuiz.textContent = state.quizIndex === positions.length - 1 ? 'See your result' : 'Next question  →';
  els.quizSpeak.hidden = false;
  const message = els.quizFeedback.textContent;
  announce(message);
  speak(message);
}

function nextQuiz() {
  if (state.quizIndex === positions.length - 1) { renderQuizComplete(); return; }
  state.quizIndex += 1;
  renderQuiz();
  announce(`Question ${state.quizIndex + 1}. ${els.quizQuestion.textContent}`);
}

function toggleSpeech() {
  state.speech = !state.speech;
  els.speechToggle.setAttribute('aria-pressed', String(state.speech));
  els.speechToggle.setAttribute('aria-label', state.speech ? 'Turn spoken feedback off' : 'Turn spoken feedback on');
  els.speechLabel.textContent = state.speech ? 'Voice on' : 'Voice off';
  els.speakLabel.textContent = state.speech ? 'Read this position aloud' : 'Turn on voice to hear this';
  announce(state.speech ? 'Spoken feedback on.' : 'Spoken feedback off.');
  if (state.speech) speak('Spoken feedback on. ' + positionText(state.selected));
  else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

els.speechToggle.addEventListener('click', toggleSpeech);
els.speakButton.addEventListener('click', () => {
  if (!state.speech) { toggleSpeech(); return; }
  speak(positionText(state.selected));
  announce(positionText(state.selected));
});
els.previous.addEventListener('click', () => selectPosition(state.selected - 1, true));
els.next.addEventListener('click', () => selectPosition(state.selected === positions.length - 1 ? 0 : state.selected + 1, true));
els.guideTab.addEventListener('click', () => setMode('guide'));
els.quizTab.addEventListener('click', () => setMode('quiz'));
els.nextQuiz.addEventListener('click', nextQuiz);
els.quizSpeak.addEventListener('click', () => { const message = els.quizFeedback.hidden ? `You finished the field check with ${state.score} out of ${positions.length} correct.` : els.quizFeedback.textContent; speak(message); announce(message); });
els.restartQuiz.addEventListener('click', () => { state.quizIndex = 0; state.score = 0; renderQuiz(); announce('Quiz restarted.'); });
els.conventionalFormat.addEventListener('click', () => setFormat('conventional'));
els.blindFormat.addEventListener('click', () => setFormat('blind'));
document.querySelector('#exit-guide-button').addEventListener('click', () => { setMode('explore'); window.requestAnimationFrame(() => document.querySelector('.field-marker--active')?.focus()); });
document.querySelector('#return-guide-button').addEventListener('click', () => setMode('guide'));

function handleTabKeydown(event) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const target = event.key === 'Home' ? els.guideTab : event.key === 'End' ? els.quizTab : event.key === 'ArrowRight' ? els.quizTab : els.guideTab;
  target.focus();
  setMode(target === els.guideTab ? 'guide' : 'quiz');
}
els.guideTab.addEventListener('keydown', handleTabKeydown);
els.quizTab.addEventListener('keydown', handleTabKeydown);
function handleFormatKeydown(event) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const target = event.key === 'Home' || event.key === 'ArrowLeft' ? els.conventionalFormat : els.blindFormat;
  target.focus();
  setFormat(target === els.blindFormat ? 'blind' : 'conventional');
}
els.conventionalFormat.addEventListener('keydown', handleFormatKeydown);
els.blindFormat.addEventListener('keydown', handleFormatKeydown);
document.addEventListener('keydown', (event) => {
  const tag = document.activeElement?.tagName;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
  if (['tab', 'radio'].includes(document.activeElement?.getAttribute('role'))) return;
  if (event.key === 'ArrowRight' && state.mode === 'guide') { event.preventDefault(); selectPosition(state.selected + 1, true); }
  if (event.key === 'ArrowLeft' && state.mode === 'guide') { event.preventDefault(); selectPosition(state.selected - 1, true); }
  if (event.key.toLowerCase() === 'r') { event.preventDefault(); const message = state.mode === 'guide' ? positionText(state.selected) : state.mode === 'quiz' ? (els.quizFeedback.hidden ? els.quizQuestion.textContent : els.quizFeedback.textContent) : positionText(state.selected); speak(message); announce(message); }
  if (event.key.toLowerCase() === 'm') { event.preventDefault(); toggleSpeech(); }
  if (event.key.toLowerCase() === 'g') { event.preventDefault(); setMode('guide'); }
  if (event.key.toLowerCase() === 'q') { event.preventDefault(); setMode('quiz'); }
});

setFormat('blind', false);
updateGuide();
