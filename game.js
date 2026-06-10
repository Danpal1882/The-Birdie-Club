const asset = (name) => `assets/${name}.png`;

const birds = [
  { id: 'robin', name: 'Robin', fullName: 'Rory Robin', role: 'Balanced starter', drive: 6, accuracy: 6, putting: 4, focus: 5, rarity: 'Common', ability: 'Earns extra XP on par or better.' },
  { id: 'duck', name: 'Duck', fullName: 'Daisy Duck', role: 'Safe grinder', drive: 5, accuracy: 6, putting: 6, focus: 7, rarity: 'Common', ability: 'Reduces disaster holes.' },
  { id: 'owl', name: 'Owl', fullName: 'Oswald Owl', role: 'Tactical genius', drive: 4, accuracy: 7, putting: 7, focus: 8, rarity: 'Rare', ability: 'Gets a bonus on Safe strategy.' },
  { id: 'crow', name: 'Crow', fullName: 'Cyrus Crow', role: 'Chaos specialist', drive: 7, accuracy: 4, putting: 5, focus: 4, rarity: 'Uncommon', ability: 'Finds bonus coins and feathers.' }
];

const courses = [
  { id: 'pebblebrook', name: 'Pebblebrook Municipal', par: 72, holes: 18, difficulty: 5, reward: 95, trait: 'Friendly parkland course' },
  { id: 'mossy', name: 'Mossy Meadows Pitch & Putt', par: 54, holes: 18, difficulty: 3, reward: 55, trait: 'Short game playground' },
  { id: 'bramble', name: 'Bramblewood Golf Club', par: 70, holes: 18, difficulty: 7, reward: 135, trait: 'Narrow fairways' },
  { id: 'clifftop', name: 'Windy Clifftop Links', par: 72, holes: 18, difficulty: 9, reward: 185, trait: 'Windy and punishing' }
];

const strategies = {
  safe: { name: 'Safe', risk: 0.75, scoring: 0.86, reward: 0.92 },
  balanced: { name: 'Balanced', risk: 1, scoring: 1, reward: 1 },
  aggressive: { name: 'Aggressive', risk: 1.35, scoring: 1.14, reward: 1.12 },
  glory: { name: 'Go for Glory', risk: 1.85, scoring: 1.28, reward: 1.25 }
};

const defaultState = {
  coins: 450,
  feathers: 35,
  clubXp: 0,
  clubLevel: 1,
  selectedBird: 'robin',
  selectedCourse: 'pebblebrook',
  selectedStrategy: 'balanced',
  birdLevels: { robin: 1, duck: 1, owl: 1, crow: 1 },
  upgrades: { range: 1, green: 1, workshop: 1 },
  lastVisit: Date.now(),
  lastRound: null
};

let state = loadState();
let swingFrameTimer = null;

function loadState() {
  const saved = localStorage.getItem('birdieClubSaveV2');
  if (!saved) return structuredClone(defaultState);
  try { return { ...structuredClone(defaultState), ...JSON.parse(saved) }; }
  catch { return structuredClone(defaultState); }
}

function saveState() {
  state.lastVisit = Date.now();
  localStorage.setItem('birdieClubSaveV2', JSON.stringify(state));
}

function $(id) { return document.getElementById(id); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getBird(id = state.selectedBird) { return birds.find(b => b.id === id); }
function getCourse(id = state.selectedCourse) { return courses.find(c => c.id === id); }
function lvl(id) { return state.birdLevels[id] || 1; }
function stat(bird, key) { return bird[key] + lvl(bird.id) - 1 + Math.floor(state.clubLevel / 3); }
function statWidth(value) { return `${clamp(value, 1, 10) * 10}%`; }
function idleReward() {
  const mins = Math.min(720, Math.max(0, (Date.now() - state.lastVisit) / 60000));
  const mult = state.clubLevel + state.upgrades.range + state.upgrades.green;
  return {
    coins: Math.floor(mins * (0.75 + mult * 0.08)),
    feathers: Math.floor(mins / 18 + state.upgrades.workshop * 0.05)
  };
}

function render() {
  const xpNeed = state.clubLevel * 250;
  $('coins').textContent = Math.floor(state.coins).toLocaleString('en-GB');
  $('feathers').textContent = Math.floor(state.feathers).toLocaleString('en-GB');
  $('clubLevel').textContent = state.clubLevel;
  $('xpFill').style.width = `${clamp(state.clubXp / xpNeed, 0, 1) * 100}%`;
  $('xpText').textContent = `${Math.floor(state.clubXp)} / ${xpNeed} XP`;
  $('birdPass').textContent = `${Math.floor(state.clubXp % 100)} / 100`;

  renderCourseSelect();
  renderBirdCards();
  renderCurrentBird();
  renderIdlePreview();
  renderLastRound();
}

function renderCourseSelect() {
  const course = getCourse();
  $('courseName').textContent = course.name;
  $('courseDetails').textContent = `Par ${course.par} • ${course.holes} holes • ${course.trait}`;
  $('courseSelect').innerHTML = courses.map(c => `<option value="${c.id}" ${c.id === state.selectedCourse ? 'selected' : ''}>${c.name}</option>`).join('');
}

function renderBirdCards() {
  $('birdList').innerHTML = birds.map((bird, index) => {
    const selected = state.selectedBird === bird.id;
    return `<article class="bird-card ${selected ? 'selected' : ''}" data-bird="${bird.id}">
      <span class="num">${index + 1}</span>
      <img class="sprite" src="${asset(`${bird.id}-idle`)}" alt="${bird.name} golfer sprite" />
      <h3>${bird.name}</h3>
      <p class="role">${bird.role}</p>
      ${statRow('Drive', stat(bird, 'drive'))}
      ${statRow('Accuracy', stat(bird, 'accuracy'))}
      ${statRow('Putting', stat(bird, 'putting'))}
      <button>${selected ? 'Selected' : 'Select'}</button>
    </article>`;
  }).join('');

  document.querySelectorAll('.bird-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedBird = card.dataset.bird;
      saveState();
      render();
    });
  });
}

function statRow(label, value) {
  return `<div class="stat"><span>${label}</span><b class="bar"><i style="width:${statWidth(value)}"></i></b></div>`;
}

function renderCurrentBird(frame = 'idle') {
  const bird = getBird();
  $('currentBirdPanel').innerHTML = `
    <img src="${asset(`${bird.id}-${frame}`)}" alt="${bird.fullName}" />
    <strong>${bird.fullName}</strong>
    <p class="small">Level ${lvl(bird.id)} • ${bird.rarity}</p>
    <p class="small">${bird.ability}</p>
  `;
}

function renderIdlePreview() {
  const r = idleReward();
  $('idlePreview').textContent = `${r.coins.toLocaleString('en-GB')} coins • ${r.feathers.toLocaleString('en-GB')} feathers`;
}

function renderLastRound() {
  if (!state.lastRound) return;
  $('roundSummary').textContent = `${state.lastRound.bird} shot ${state.lastRound.scoreText} at ${state.lastRound.course}. Earned ${state.lastRound.coins} coins and ${state.lastRound.xp} XP.`;
  $('holeLog').innerHTML = state.lastRound.holes.map(h => `<li><strong>Hole ${h.n}</strong> • Par ${h.par}<br/>${h.text}<br/><b>${h.result}</b></li>`).join('');
}

async function playRound() {
  if (state.roundInProgress) return;
  state.roundInProgress = true;
  $('playRound').disabled = true;
  $('playRound').textContent = '⛳ Playing...';

  const bird = getBird();
  const course = getCourse();
  const strategy = strategies[state.selectedStrategy];
  const pars = generatePars(course);
  let total = 0;
  let parTotal = 0;
  const holes = [];

  resetLiveStage(bird);
  $('liveTitle').textContent = `${bird.fullName} steps onto the 1st tee.`;
  $('liveSubtitle').textContent = `${course.name} • ${strategy.name} strategy`;
  $('liveScore').textContent = 'E';

  for (let i = 0; i < 9; i++) {
    const par = pars[i];
    parTotal += par;
    const outcome = simulateHole(bird, course, strategy, par);
    total += outcome.strokes;

    const running = total - parTotal;
    await animateHole(i + 1, par, outcome.relative, running, bird);

    holes.push({ n: i + 1, par, result: resultText(outcome.relative), text: shotText(bird, outcome.relative, par, state.selectedStrategy) });
  }

  const toPar = total - parTotal;
  const coins = Math.max(25, Math.floor((course.reward + (parTotal - total) * 12) * strategy.reward));
  const featherBonus = bird.id === 'crow' ? Math.floor(rand(2, 8)) : Math.floor(rand(0, 4));
  const xp = Math.max(20, Math.floor(55 + (parTotal - total) * 9 + course.difficulty * 6));

  state.coins += coins;
  state.feathers += featherBonus;
  state.clubXp += xp;
  state.birdLevels[bird.id] = lvl(bird.id) + (xp > 85 ? 1 : 0);
  levelClubIfNeeded();
  state.lastRound = { bird: bird.fullName, course: course.name, scoreText: scoreText(toPar), coins, xp, holes };
  saveState();
  render();
  $('liveTitle').textContent = `Round complete: ${scoreText(toPar)}`;
  $('liveSubtitle').textContent = `${bird.fullName} earned ${coins} coins and ${xp} XP.`;
  $('playRound').disabled = false;
  $('playRound').textContent = '⛳ Play Round';
  state.roundInProgress = false;
  toast('Round complete!');
}

function simulateHole(bird, course, strategy, par) {
  const drive = stat(bird, 'drive');
  const accuracy = stat(bird, 'accuracy');
  const putting = stat(bird, 'putting');
  const focus = stat(bird, 'focus');
  let skill = (drive * 0.27) + (accuracy * 0.34) + (putting * 0.28) + (focus * 0.11);
  skill += state.upgrades.range * 0.12 + state.upgrades.green * 0.13 + state.upgrades.workshop * 0.08;
  if (bird.id === 'owl' && state.selectedStrategy === 'safe') skill += 0.6;
  if (bird.id === 'duck') skill += 0.25;

  const target = course.difficulty + rand(-1.8, 2.6) * strategy.risk;
  let diff = target - skill * strategy.scoring;
  let relative = Math.round(clamp(diff + rand(-1.2, 1.2), -2, 4));

  const disasterChance = clamp((course.difficulty - focus) * 0.035 * strategy.risk, 0.02, 0.26);
  if (bird.id === 'duck' && relative > 1) relative -= 1;
  if (bird.id === 'crow' && Math.random() < 0.12) relative -= 1;
  if (Math.random() < disasterChance) relative += 1;
  if (par === 5 && drive >= 8 && Math.random() < 0.15) relative -= 1;
  relative = clamp(relative, -2, 4);
  return { relative, strokes: par + relative };
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function resetLiveStage(bird = getBird()) {
  const liveBird = $('liveBird');
  const liveBall = $('liveBall');
  const trail = $('shotTrail');
  if (!liveBird || !liveBall || !trail) return;
  liveBird.src = asset(`${bird.id}-idle`);
  liveBall.style.transition = 'none';
  liveBall.style.left = '16%';
  liveBall.style.top = '80%';
  liveBall.style.transform = 'translate(-50%, -50%) scale(1)';
  trail.innerHTML = '';
}

async function animateHole(holeNumber, par, relative, runningScore, bird) {
  const liveBird = $('liveBird');
  const liveBall = $('liveBall');
  const trail = $('shotTrail');
  if (!liveBird || !liveBall || !trail) return;

  trail.innerHTML = '';
  liveBall.style.transition = 'none';
  liveBall.style.left = '16%';
  liveBall.style.top = '80%';
  liveBall.style.transform = 'translate(-50%, -50%) scale(1)';
  liveBird.src = asset(`${bird.id}-ready`);
  $('liveTitle').textContent = `Hole ${holeNumber} • Par ${par}`;
  $('liveSubtitle').textContent = 'Setting up over the ball...';
  await sleep(220);

  const endBias = relative <= -1 ? 0 : relative === 0 ? 4 : relative === 1 ? 9 : 15;
  const shots = par + relative <= 3 ? 2 : par + relative <= 5 ? 3 : 4;
  const points = buildShotPath(shots, endBias);

  for (let i = 0; i < points.length; i++) {
    liveBird.src = asset(`${bird.id}-backswing`);
    $('liveSubtitle').textContent = i === 0 ? 'Backswing...' : (i === points.length - 1 ? 'Rolling it towards the cup...' : 'Next shot...');
    await sleep(170);
    liveBird.src = asset(`${bird.id}-swing`);
    await sleep(120);
    liveBall.style.transition = 'left .55s cubic-bezier(.16,.8,.32,1), top .55s cubic-bezier(.16,.8,.32,1), transform .28s ease';
    liveBall.style.left = `${points[i].x}%`;
    liveBall.style.top = `${points[i].y}%`;
    liveBall.style.transform = `translate(-50%, -50%) scale(${points[i].scale})`;
    addTrailDot(points[i].x, points[i].y, i + 1);
    await sleep(620);
    liveBird.src = asset(`${bird.id}-idle`);
    await sleep(120);
  }

  $('liveTitle').textContent = `Hole ${holeNumber}: ${resultText(relative)}`;
  $('liveSubtitle').textContent = liveResultLine(relative);
  $('liveScore').textContent = scoreText(runningScore);
  await sleep(650);
}

function buildShotPath(shots, endBias) {
  const finalX = clamp(82 + rand(-3, 3), 72, 88);
  const finalY = clamp(22 + endBias + rand(-3, 3), 18, 44);
  if (shots <= 2) return [
    { x: clamp(58 + rand(-4, 5), 48, 66), y: clamp(42 + rand(-8, 8), 30, 55), scale: .72 },
    { x: finalX, y: finalY, scale: .55 }
  ];
  if (shots === 3) return [
    { x: clamp(42 + rand(-4, 5), 36, 50), y: clamp(58 + rand(-7, 8), 46, 68), scale: .78 },
    { x: clamp(66 + rand(-5, 5), 58, 73), y: clamp(36 + rand(-8, 7), 26, 48), scale: .65 },
    { x: finalX, y: finalY, scale: .55 }
  ];
  return [
    { x: clamp(35 + rand(-6, 6), 28, 44), y: clamp(62 + rand(-8, 8), 50, 72), scale: .8 },
    { x: clamp(54 + rand(-5, 6), 46, 62), y: clamp(48 + rand(-8, 10), 36, 60), scale: .7 },
    { x: clamp(70 + rand(-4, 5), 62, 78), y: clamp(34 + rand(-7, 9), 25, 46), scale: .6 },
    { x: finalX, y: finalY, scale: .55 }
  ];
}

function addTrailDot(x, y, n) {
  const trail = $('shotTrail');
  const dot = document.createElement('span');
  dot.style.left = `${x}%`;
  dot.style.top = `${y}%`;
  dot.textContent = n;
  trail.appendChild(dot);
}

function liveResultLine(relative) {
  if (relative <= -2) return 'Huge swing, outrageous roll, eagle putt dropped!';
  if (relative === -1) return 'Clean strike, tidy approach, birdie secured.';
  if (relative === 0) return 'Fairway, green, two putts. Stress-free par.';
  if (relative === 1) return 'A little trouble, but the damage is limited.';
  return 'That one got messy. Back to the next tee.';
}

function generatePars(course) {
  if (course.id === 'mossy') return [3,3,3,3,3,3,3,3,3];
  return [4,4,3,5,4,4,3,5,4].sort(() => Math.random() - 0.5);
}

function resultText(relative) {
  return relative <= -2 ? 'Eagle!' : relative === -1 ? 'Birdie!' : relative === 0 ? 'Par' : relative === 1 ? 'Bogey' : relative === 2 ? 'Double bogey' : `+${relative}`;
}

function scoreText(toPar) {
  if (toPar === 0) return 'level par';
  return toPar > 0 ? `+${toPar}` : `${toPar}`;
}

function shotText(bird, relative, par, strategy) {
  const good = [
    `${bird.name} split the fairway and clipped a tidy wedge close.`,
    `${bird.name} read the green perfectly and rolled one in.`,
    `${bird.name} found the short grass, stayed calm, and attacked the pin.`
  ];
  const okay = [
    `${bird.name} played sensible golf and took the stress-free two putt.`,
    `${bird.name} missed the perfect line but recovered neatly.`,
    `${bird.name} kept it simple and avoided the big number.`
  ];
  const bad = [
    `${bird.name} leaked the tee shot into trouble and had to chip out.`,
    `${bird.name} got greedy with the ${strategies[strategy].name.toLowerCase()} plan and paid for it.`,
    `${bird.name} found sand, grass, then more sand. Golf happened.`
  ];
  if (relative < 0) return pick(good);
  if (relative === 0) return pick(okay);
  return pick(bad);
}

function animateSwing() {
  clearTimeout(swingFrameTimer);
  const frames = ['ready','backswing','swing','idle'];
  frames.forEach((frame, i) => {
    swingFrameTimer = setTimeout(() => renderCurrentBird(frame), i * 150);
  });
}

function levelClubIfNeeded() {
  let need = state.clubLevel * 250;
  while (state.clubXp >= need) {
    state.clubXp -= need;
    state.clubLevel += 1;
    need = state.clubLevel * 250;
  }
}

function collectIdle() {
  const r = idleReward();
  if (r.coins <= 0 && r.feathers <= 0) return toast('No practice rewards yet.');
  state.coins += r.coins;
  state.feathers += r.feathers;
  state.lastVisit = Date.now();
  saveState();
  render();
  toast(`Claimed ${r.coins} coins and ${r.feathers} feathers.`);
}

function upgradeCost(key) { return (state.upgrades[key] + 1) * 160; }
function upgrade(key) {
  const cost = upgradeCost(key);
  if (state.coins < cost) return toast('Not enough coins yet.');
  state.coins -= cost;
  state.upgrades[key] += 1;
  saveState();
  render();
  showClubhouse();
  toast('Upgrade complete!');
}

function showClubhouse() {
  openModal(`<h2>Clubhouse</h2><p>Upgrade the club to improve your Birdies and idle rewards.</p>
    <div class="upgrade-list">
      ${upgradeRow('range', 'Driving Range', 'Improves Drive and coin rewards.')}
      ${upgradeRow('green', 'Putting Green', 'Improves Putting and practice income.')}
      ${upgradeRow('workshop', 'Club Workshop', 'Improves all-round consistency and feathers.')}
    </div>`);
  document.querySelectorAll('[data-upgrade]').forEach(btn => btn.addEventListener('click', () => upgrade(btn.dataset.upgrade)));
}

function upgradeRow(key, title, desc) {
  return `<div class="upgrade-row"><div><strong>${title} Lv ${state.upgrades[key]}</strong><p class="small">${desc}</p></div><button data-upgrade="${key}">Upgrade<br/>${upgradeCost(key)} 🪙</button></div>`;
}

function showShop() {
  openModal(`<h2>Shop</h2><p>The pro shop is a placeholder for now, but the structure is ready.</p>
    <div class="upgrade-list">
      <div class="upgrade-row"><div><strong>Soft Feel Balls</strong><p class="small">Future item: +putting for one round.</p></div><button disabled>Coming soon</button></div>
      <div class="upgrade-row"><div><strong>Big Beak Driver</strong><p class="small">Future item: +drive for power birds.</p></div><button disabled>Coming soon</button></div>
      <div class="upgrade-row"><div><strong>Lucky Feather Tee</strong><p class="small">Future item: reroll one disaster hole.</p></div><button disabled>Coming soon</button></div>
    </div>`);
}

function showTournaments() {
  openModal(`<h2>Tournaments</h2><p>Weekly events will live here.</p>
    <div class="upgrade-list">
      <div class="upgrade-row"><div><strong>Municipal Medal</strong><p class="small">Target score: +6 or better over 9 holes.</p></div><button class="action" id="quickTournament">Enter</button></div>
      <div class="upgrade-row"><div><strong>Feather Cup</strong><p class="small">Unlocks after Club Level 4.</p></div><button disabled>Locked</button></div>
    </div>`);
  const quick = $('quickTournament');
  if (quick) quick.addEventListener('click', () => { $('modal').close(); playRound(); });
}

function openModal(html) {
  $('modalContent').innerHTML = html;
  $('modal').showModal();
}

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast fade';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}

$('courseSelect').addEventListener('change', (e) => { state.selectedCourse = e.target.value; saveState(); render(); });
$('playRound').addEventListener('click', playRound);
$('idleButton').addEventListener('click', collectIdle);
$('clubhouseButton').addEventListener('click', showClubhouse);
$('shopButton').addEventListener('click', showShop);
$('tournamentButton').addEventListener('click', showTournaments);
$('toggleLog').addEventListener('click', () => {
  $('holeLog').classList.toggle('hidden');
  $('toggleLog').textContent = $('holeLog').classList.contains('hidden') ? 'Show scorecard' : 'Hide scorecard';
});
$('resetButton').addEventListener('click', () => {
  if (!confirm('Reset The Birdie Club save?')) return;
  localStorage.removeItem('birdieClubSaveV2');
  state = structuredClone(defaultState);
  saveState();
  render();
});

document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') renderIdlePreview(); });
setInterval(renderIdlePreview, 60000);
render();
