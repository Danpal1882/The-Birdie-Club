const asset = (name) => `assets/${name}.png`;

const birds = [
  { id: 'robin', name: 'Robin', fullName: 'Rory Robin', role: 'Balanced starter', drive: 6, accuracy: 6, shortGame: 5, putting: 4, focus: 5, rarity: 'Common', ability: 'Balanced all-rounder.', unlockLevel: 1 },
  { id: 'duck', name: 'Duck', fullName: 'Daisy Duck', role: 'Safe grinder', drive: 5, accuracy: 6, shortGame: 6, putting: 6, focus: 7, rarity: 'Common', ability: 'Reduces disasters and keeps the ball in play.', unlockLevel: 1 },
  { id: 'owl', name: 'Owl', fullName: 'Oswald Owl', role: 'Tactical genius', drive: 4, accuracy: 7, shortGame: 7, putting: 7, focus: 8, rarity: 'Rare', ability: 'Excels with safer strategies and smart play.', unlockLevel: 2 },
  { id: 'crow', name: 'Crow', fullName: 'Cyrus Crow', role: 'Chaos specialist', drive: 7, accuracy: 4, shortGame: 5, putting: 5, focus: 4, rarity: 'Uncommon', ability: 'High risk, high reward. Finds bonus loot.', unlockLevel: 2 },
  { id: 'woodpecker', name: 'Woodpecker', fullName: 'Woody Woodpecker', role: 'Recovery pro', drive: 5, accuracy: 6, shortGame: 8, putting: 5, focus: 7, rarity: 'Uncommon', ability: 'Excellent from rough and bunkers.', unlockLevel: 3 },
  { id: 'kingfisher', name: 'Kingfisher', fullName: 'Kiki Kingfisher', role: 'Pin hunter', drive: 6, accuracy: 8, shortGame: 7, putting: 5, focus: 6, rarity: 'Rare', ability: 'Great for precise approaches.', unlockLevel: 3 },
  { id: 'flamingo', name: 'Flamingo', fullName: 'Fifi Flamingo', role: 'Stylish shotmaker', drive: 6, accuracy: 8, shortGame: 6, putting: 8, focus: 7, rarity: 'Epic', ability: 'Graceful touch on approaches and putts.', unlockLevel: 4 },
  { id: 'eagle', name: 'Eagle', fullName: 'Eddie Eagle', role: 'Power hitter', drive: 9, accuracy: 5, shortGame: 5, putting: 4, focus: 6, rarity: 'Epic', ability: 'Launches huge tee shots and eats par 5s.', unlockLevel: 5 },
  { id: 'swan', name: 'Swan', fullName: 'Serena Swan', role: 'Smooth putter', drive: 5, accuracy: 7, shortGame: 6, putting: 9, focus: 7, rarity: 'Rare', ability: 'Elegant around the greens and deadly with the putter.', unlockLevel: 5 }
];

const courses = [
  { id: 'pebblebrook', name: 'Pebblebrook Municipal', difficulty: 5, reward: 95, trait: 'Friendly parkland course', unlockLevel: 1 },
  { id: 'mossy', name: 'Mossy Meadows Pitch & Putt', difficulty: 3, reward: 55, trait: 'Short game playground', unlockLevel: 1 },
  { id: 'bramble', name: 'Bramblewood Golf Club', difficulty: 7, reward: 135, trait: 'Narrow fairways', unlockLevel: 3 },
  { id: 'clifftop', name: 'Windy Clifftop Links', difficulty: 9, reward: 185, trait: 'Windy and punishing', unlockLevel: 5 }
];

const strategies = {
  safe: { name: 'Safe', risk: 0.85, reward: 0.92 },
  balanced: { name: 'Balanced', risk: 1, reward: 1 },
  aggressive: { name: 'Aggressive', risk: 1.25, reward: 1.12 },
  glory: { name: 'Go for Glory', risk: 1.55, reward: 1.25 }
};

const clubs = [
  { id: 'driver', name: 'Driver', dist: 210, variance: 20, kind: 'long' },
  { id: 'wood5', name: '5 Wood', dist: 185, variance: 16, kind: 'long' },
  { id: 'hybrid5', name: '5 Hybrid', dist: 168, variance: 13, kind: 'mid' },
  { id: 'iron6', name: '6 Iron', dist: 150, variance: 11, kind: 'mid' },
  { id: 'iron7', name: '7 Iron', dist: 138, variance: 10, kind: 'mid' },
  { id: 'iron8', name: '8 Iron', dist: 126, variance: 9, kind: 'mid' },
  { id: 'iron9', name: '9 Iron', dist: 112, variance: 8, kind: 'short' },
  { id: 'pw', name: 'Pitching Wedge', dist: 94, variance: 7, kind: 'short' },
  { id: 'w52', name: '52°', dist: 78, variance: 6, kind: 'short' },
  { id: 'w56', name: '56°', dist: 60, variance: 5, kind: 'short' },
  { id: 'w60', name: '60°', dist: 42, variance: 4, kind: 'short' },
  { id: 'putter', name: 'Putter', dist: 18, variance: 2, kind: 'putter' }
];

const shopItems = [
  { id: 'bigDriver', name: 'Big Beak Driver', costCoins: 420, costFeathers: 0, desc: '+1 drive on all full shots.', slot: 'driver' },
  { id: 'softBalls', name: 'Soft Feel Balls', costCoins: 280, costFeathers: 12, desc: '+1 putting and +1 short game.', slot: 'ball' },
  { id: 'luckyTee', name: 'Lucky Feather Tee', costCoins: 240, costFeathers: 10, desc: 'Negates the first water penalty each round.', slot: 'tee' }
];

const defaultState = {
  coins: 650,
  feathers: 48,
  clubXp: 0,
  clubLevel: 1,
  selectedBird: 'robin',
  selectedCourse: 'pebblebrook',
  selectedStrategy: 'balanced',
  selectedClub: 'driver',
  selectedAim: 'center',
  selectedShotType: 'normal',
  selectedPlayMode: 'manual',
  power: 80,
  birdLevels: Object.fromEntries(birds.map(b => [b.id, 1])),
  upgrades: { range: 1, green: 1, workshop: 1 },
  inventory: { bigDriver: false, softBalls: false, luckyTee: false },
  activeGear: { driver: false, ball: false, tee: false },
  lastVisit: Date.now(),
  activeRound: null,
  lastRound: null,
  tournamentStamp: null,
  dailyTournamentBest: null
};

let state = loadState();
let busy = false;

function loadState() {
  const saved = localStorage.getItem('birdieClubSaveV7');
  if (!saved) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      birdLevels: { ...defaultState.birdLevels, ...(parsed.birdLevels || {}) },
      upgrades: { ...defaultState.upgrades, ...(parsed.upgrades || {}) },
      inventory: { ...defaultState.inventory, ...(parsed.inventory || {}) },
      activeGear: { ...defaultState.activeGear, ...(parsed.activeGear || {}) }
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  state.lastVisit = Date.now();
  localStorage.setItem('birdieClubSaveV7', JSON.stringify(state));
}

const $ = (id) => document.getElementById(id);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fmt = (n) => Math.round(n).toLocaleString('en-GB');
const getBird = (id = state.selectedBird) => birds.find(b => b.id === id);
const getCourse = (id = state.selectedCourse) => courses.find(c => c.id === id);
const getClub = (id = state.selectedClub) => clubs.find(c => c.id === id);
const lvl = (id) => state.birdLevels[id] || 1;
const xpNeed = () => state.clubLevel * 250;
const unlockedBird = (bird) => state.clubLevel >= bird.unlockLevel;
const unlockedCourse = (course) => state.clubLevel >= course.unlockLevel;
const todayStamp = () => new Date().toISOString().slice(0, 10);

function stat(bird, key) {
  let value = bird[key] + lvl(bird.id) - 1 + Math.floor(state.clubLevel / 3);
  if (state.activeGear.driver && key === 'drive') value += 1;
  if (state.activeGear.ball && (key === 'putting' || key === 'shortGame')) value += 1;
  if (bird.id === 'flamingo' && (key === 'accuracy' || key === 'putting')) value += 1;
  return value;
}

function idleReward() {
  const mins = Math.min(720, Math.max(0, (Date.now() - state.lastVisit) / 60000));
  const mult = state.clubLevel + state.upgrades.range + state.upgrades.green;
  return {
    coins: Math.floor(mins * (0.85 + mult * 0.1)),
    feathers: Math.floor(mins / 18 + state.upgrades.workshop * 0.06)
  };
}

function render() {
  $('coins').textContent = fmt(state.coins);
  $('feathers').textContent = fmt(state.feathers);
  $('clubLevel').textContent = state.clubLevel;
  $('xpFill').style.width = `${clamp(state.clubXp / xpNeed(), 0, 1) * 100}%`;
  $('xpText').textContent = `${Math.floor(state.clubXp)} / ${xpNeed()} XP`;
  $('birdPass').textContent = `${Math.floor(state.clubXp % 100)} / 100`;
  $('powerValue').textContent = `${state.power}%`;
  $('powerSlider').value = state.power;
  renderSelectors();
  renderBirdCards();
  renderCurrentBird();
  renderIdlePreview();
  renderRoundState();
  renderRecommendation();
  renderScorecard();
}

function renderSelectors() {
  const availableCourses = courses.filter(unlockedCourse);
  if (!availableCourses.some(c => c.id === state.selectedCourse)) state.selectedCourse = availableCourses[0].id;
  $('courseSelect').innerHTML = courses.map(c => `<option value="${c.id}" ${c.id === state.selectedCourse ? 'selected' : ''} ${unlockedCourse(c) ? '' : 'disabled'}>${c.name}${unlockedCourse(c) ? '' : ` (Lv ${c.unlockLevel})`}</option>`).join('');
  $('strategySelect').innerHTML = Object.entries(strategies).map(([key, s]) => `<option value="${key}" ${key === state.selectedStrategy ? 'selected' : ''}>${s.name}</option>`).join('');
  $('clubSelect').innerHTML = clubs.map(c => `<option value="${c.id}" ${c.id === state.selectedClub ? 'selected' : ''}>${c.name} • ${c.dist}y</option>`).join('');
  $('aimSelect').value = state.selectedAim;
  $('shotTypeSelect').value = state.selectedShotType;
  $('playModeSelect').value = state.selectedPlayMode;
}

function renderBirdCards() {
  $('birdList').innerHTML = birds.map((bird, index) => {
    const selected = state.selectedBird === bird.id;
    const unlocked = unlockedBird(bird);
    return `<article class="bird-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}" data-bird="${bird.id}">
      <span class="num">${index + 1}</span>
      <img class="sprite" src="${asset(`${bird.id}-idle`)}" alt="${bird.name} golfer sprite" />
      <h3>${bird.name}</h3>
      <p class="role">${bird.role}</p>
      ${statRow('Drive', stat(bird, 'drive'))}
      ${statRow('Accuracy', stat(bird, 'accuracy'))}
      ${statRow('Short', stat(bird, 'shortGame'))}
      ${statRow('Putting', stat(bird, 'putting'))}
      <button ${unlocked ? '' : 'disabled'}>${!unlocked ? `Unlocks Lv ${bird.unlockLevel}` : selected ? 'Selected' : 'Select'}</button>
    </article>`;
  }).join('');

  document.querySelectorAll('.bird-card').forEach(card => {
    card.addEventListener('click', () => {
      const bird = birds.find(b => b.id === card.dataset.bird);
      if (!unlockedBird(bird)) {
        toast(`Reach Club Level ${bird.unlockLevel} to unlock ${bird.name}.`);
        return;
      }
      state.selectedBird = card.dataset.bird;
      saveState();
      render();
      resetLiveStage();
    });
  });
}

function statRow(label, value) {
  return `<div class="stat"><span>${label}</span><b class="bar"><i style="width:${clamp(value, 1, 10) * 10}%"></i></b></div>`;
}

function renderCurrentBird() {
  const bird = getBird();
  const gear = [];
  if (state.activeGear.driver) gear.push('Big Beak Driver');
  if (state.activeGear.ball) gear.push('Soft Feel Balls');
  if (state.activeGear.tee) gear.push('Lucky Tee');
  $('currentBirdPanel').innerHTML = `
    <img src="${asset(`${bird.id}-idle`)}" alt="${bird.fullName}" />
    <strong>${bird.fullName}</strong>
    <p class="small">Level ${lvl(bird.id)} • ${bird.rarity}</p>
    <p class="small">${bird.ability}</p>
    <p class="small">Gear: ${gear.length ? gear.join(', ') : 'None equipped'}</p>
  `;
}

function renderIdlePreview() {
  const r = idleReward();
  $('idlePreview').textContent = `${fmt(r.coins)} coins • ${fmt(r.feathers)} feathers`;
}

function currentHole() {
  if (!state.activeRound) return null;
  return state.activeRound.holes[state.activeRound.currentHoleIndex];
}

function renderRoundState() {
  const hole = currentHole();
  if (!hole) {
    $('liveTitle').textContent = 'Start a round to begin.';
    $('liveSubtitle').textContent = 'Pick a Birdie, then start a round.';
    $('holeBadge').textContent = 'Hole -';
    $('parBadge').textContent = 'Par -';
    $('distanceToPin').textContent = '-';
    $('currentLie').textContent = '-';
    $('strokesThisHole').textContent = '0';
    $('roundProgress').textContent = '0 / 9';
    $('liveScore').textContent = 'E';
    return;
  }
  $('liveTitle').textContent = `${hole.name} • ${hole.yards}y`;
  $('liveSubtitle').textContent = `${getCourse(state.activeRound.courseId).name} • ${strategies[state.activeRound.strategy].name}${state.activeRound.mode === 'tournament' ? ' • Daily Tournament' : ''}`;
  $('holeBadge').textContent = `Hole ${state.activeRound.currentHoleIndex + 1}`;
  $('parBadge').textContent = `Par ${hole.par}`;
  $('distanceToPin').textContent = hole.holed ? 'Holed' : `${fmt(hole.distance)}y`;
  $('currentLie').textContent = hole.holed ? 'Cup' : titleCase(hole.lie);
  $('strokesThisHole').textContent = `${hole.strokes}`;
  $('roundProgress').textContent = `${state.activeRound.currentHoleIndex + 1} / ${state.activeRound.holes.length}`;
  $('liveScore').textContent = scoreToPar(state.activeRound.totalStrokes, state.activeRound.parSoFar);
  syncBallAndBird(hole);
}

function renderRecommendation() {
  const box = $('recommendationBox');
  const hole = currentHole();
  if (!hole) {
    const dailyText = state.tournamentStamp === todayStamp() ? `Today's tournament best: ${state.dailyTournamentBest ?? 'completed'}.` : 'Daily tournament ready.';
    box.innerHTML = `<strong>No round active yet.</strong><p>Start a new round to get a club and power recommendation.</p><p>${dailyText}</p>`;
    return;
  }
  const rec = recommendShot(hole);
  box.innerHTML = `<strong>Recommended</strong>
    <p><b>${clubName(rec.club)}</b> • ${titleCase(rec.aim)} • ${rec.power}% • ${titleCase(rec.shotType)}</p>
    <p>${rec.reason}</p>`;
}

function renderScorecard() {
  const container = $('scorecardWrap');
  const data = state.activeRound || state.lastRound;
  if (!data) {
    container.innerHTML = '<div style="padding:12px">No round data yet.</div>';
    return;
  }
  const holes = data.holes;
  const holeHeader = holes.map((h, i) => `<th>${i + 1}</th>`).join('');
  const pars = holes.map(h => `<td>${h.par}</td>`).join('');
  const scoreCells = holes.map(h => h.score ? `<td class="${scoreClass(h.score.relative)}">${h.score.strokes}</td>` : '<td>-</td>').join('');
  const resultCells = holes.map(h => h.score ? `<td class="${scoreClass(h.score.relative)}">${resultShort(h.score.relative)}</td>` : '<td>-</td>').join('');
  const totalPar = holes.reduce((sum, h) => sum + h.par, 0);
  const totalScore = holes.reduce((sum, h) => sum + (h.score?.strokes || 0), 0);
  const finished = holes.every(h => h.score);
  container.innerHTML = `<table class="scorecard">
    <thead><tr><th>Hole</th>${holeHeader}<th>Total</th></tr></thead>
    <tbody>
      <tr><td>Par</td>${pars}<td>${totalPar}</td></tr>
      <tr><td>Score</td>${scoreCells}<td>${finished ? totalScore : '-'}</td></tr>
      <tr><td>Result</td>${resultCells}<td class="${finished ? scoreClass(totalScore - totalPar) : ''}">${finished ? prettyScore(totalScore - totalPar) : '-'}</td></tr>
    </tbody>
  </table>`;
}

function scoreClass(relative) {
  if (relative < 0) return 'score-birdie';
  if (relative === 0) return 'score-par';
  if (relative === 1) return 'score-bogey';
  return 'score-disaster';
}

function scoreToPar(strokes, par) {
  const diff = strokes - par;
  return diff === 0 ? 'E' : (diff > 0 ? `+${diff}` : `${diff}`);
}

function prettyScore(diff) {
  return diff === 0 ? 'level par' : (diff > 0 ? `+${diff}` : `${diff}`);
}

function resultShort(relative) {
  if (relative <= -2) return 'Eagle';
  if (relative === -1) return 'Birdie';
  if (relative === 0) return 'Par';
  if (relative === 1) return 'Bogey';
  if (relative === 2) return 'Double';
  return `+${relative}`;
}

function startNewRound(mode = 'normal', forcedCourseId = null, forcedHoles = 9) {
  const course = forcedCourseId ? getCourse(forcedCourseId) : getCourse();
  if (!unlockedCourse(course)) {
    toast(`Reach Club Level ${course.unlockLevel} to unlock ${course.name}.`);
    return;
  }
  const holes = buildRoundHoles(course, forcedHoles);
  state.activeRound = {
    courseId: course.id,
    birdId: state.selectedBird,
    strategy: state.selectedStrategy,
    mode,
    holes,
    currentHoleIndex: 0,
    totalStrokes: 0,
    parSoFar: 0,
    finished: false,
    teeUsed: false
  };
  saveState();
  $('commentaryFeed').innerHTML = '';
  pushCommentary('Round', `${getBird().fullName} begins ${mode === 'tournament' ? 'today\'s tournament' : 'a round'} at ${course.name}.`);
  resetLiveStage();
  render();
  toast(mode === 'tournament' ? 'Daily tournament started!' : 'New round started!');
}

function buildRoundHoles(course, holeCount = 9) {
  const templates = course.id === 'mossy'
    ? [
        [3, 128, 'Acorn Ace'], [3, 142, 'Duck Dip'], [3, 155, 'Pebble Pop'], [3, 134, 'Short Wing'], [3, 150, 'Meadow Kick'], [3, 138, 'Tee Twig'], [3, 160, 'Nest Nudge'], [3, 146, 'Little Loop'], [3, 152, 'Final Peck']
      ]
    : course.id === 'clifftop'
    ? [
        [4, 372, 'Gale Start'], [4, 348, 'Cliff Edge'], [5, 492, 'Sea Spray'], [3, 176, 'Gust Needle'], [4, 396, 'Lighthouse Run'], [5, 521, 'Saltwind'], [3, 165, 'Breezy Drop'], [4, 388, 'Harbour Line'], [4, 410, 'Storm Finish']
      ]
    : course.id === 'bramble'
    ? [
        [4, 358, 'Bramble Bend'], [5, 485, 'Fox Burrow'], [3, 168, 'Needle Green'], [4, 371, 'Narrow Needle'], [4, 344, 'Bark Alley'], [5, 503, 'Thornway'], [3, 154, 'Fern Flick'], [4, 362, 'Timber Turn'], [4, 382, 'Woodland Gate']
      ]
    : [
        [4, 336, 'Welcome Way'], [4, 358, 'Pond View'], [3, 162, 'Red Flag'], [5, 476, 'Long Meadow'], [4, 344, 'Bunker Lane'], [4, 367, 'Willow Rise'], [3, 148, 'Parakeet Point'], [5, 489, 'Lakeside Run'], [4, 352, 'Clubhouse Home']
      ];
  return templates.slice(0, holeCount).map(([par, yards, name]) => ({
    par,
    yards,
    name,
    distance: yards,
    strokes: 0,
    lie: 'tee',
    holed: false,
    x: 46,
    y: 80,
    score: null,
    log: []
  }));
}

function recommendShot(hole) {
  const bird = getBird();
  const strategy = strategies[state.selectedStrategy];
  const distance = hole.distance;
  let club = 'driver';
  if (hole.lie === 'green') club = 'putter';
  else if (distance <= 35) club = 'w60';
  else if (distance <= 52) club = 'w56';
  else if (distance <= 72) club = 'w52';
  else if (distance <= 88) club = 'pw';
  else if (distance <= 108) club = 'iron9';
  else if (distance <= 122) club = 'iron8';
  else if (distance <= 140) club = 'iron7';
  else if (distance <= 158) club = 'iron6';
  else if (distance <= 180) club = 'hybrid5';
  else if (distance <= 200) club = 'wood5';
  else club = 'driver';

  const base = getClub(club).dist;
  const power = clamp(Math.round((distance / Math.max(base, 1)) * 100), 40, 100);
  let aim = 'center';
  if (strategy.risk > 1.2 && stat(bird, 'accuracy') >= 7) aim = pick(['center', 'right']);
  const shotType = hole.lie === 'green' ? 'normal' : strategy.risk < 1 ? 'safe' : strategy.risk > 1.2 ? 'attack' : 'normal';
  const reason = hole.lie === 'green'
    ? `You're on the green with ${fmt(distance)}y left, so this should be a gentle putt.`
    : `At ${fmt(distance)}y from a ${hole.lie}, ${clubName(club)} is the cleanest option for ${bird.name}.`;
  return { club, power, aim, shotType, reason };
}

function applyRecommendationToControls() {
  const hole = currentHole();
  if (!hole) return;
  const rec = recommendShot(hole);
  state.selectedClub = rec.club;
  state.power = rec.power;
  state.selectedAim = rec.aim;
  state.selectedShotType = rec.shotType;
  saveState();
  render();
}

async function hitShot(mode = 'manual') {
  const hole = currentHole();
  if (!hole || hole.holed || busy) return;

  if (mode === 'assisted' || state.selectedPlayMode === 'assisted') applyRecommendationToControls();
  if (mode === 'auto' || state.selectedPlayMode === 'auto') {
    const rec = recommendShot(hole);
    state.selectedClub = rec.club;
    state.power = rec.power;
    state.selectedAim = rec.aim;
    state.selectedShotType = rec.shotType;
  }

  busy = true;
  toggleActionButtons(true);
  saveState();
  render();

  const shotConfig = {
    club: state.selectedClub,
    power: state.power,
    aim: state.selectedAim,
    shotType: state.selectedShotType
  };
  const result = simulateShot(hole, shotConfig);
  await animateShot(hole, result, getBird());
  applyShotResult(hole, result);

  if (hole.holed) completeHole(hole);

  saveState();
  render();
  busy = false;
  toggleActionButtons(false);
}

function simulateShot(hole, cfg) {
  const bird = getBird();
  const course = getCourse(state.activeRound?.courseId || state.selectedCourse);
  const club = getClub(cfg.club);
  const lie = hole.lie;
  const powerMult = cfg.power / 100;
  const skillDrive = stat(bird, 'drive');
  const skillAccuracy = stat(bird, 'accuracy');
  const skillShort = stat(bird, 'shortGame');
  const skillPutting = stat(bird, 'putting');
  const skillFocus = stat(bird, 'focus');

  let lieModifier = 1;
  if (lie === 'rough') lieModifier = 0.86;
  if (lie === 'bunker') lieModifier = club.kind === 'short' ? 0.82 : 0.62;
  if (lie === 'green') lieModifier = club.kind === 'putter' ? 1 : 0.4;

  let base = club.dist * powerMult * lieModifier;
  if (club.kind === 'putter') base = Math.min(base, hole.distance + 8);
  const distanceSkill = club.kind === 'short' || lie === 'green' ? skillShort * 1.8 : skillDrive * 1.6;
  const variance = club.variance - (skillAccuracy * 0.42) - (skillFocus * 0.18) - (state.upgrades.workshop * 0.15);
  let actual = base + rand(-variance, variance) + (distanceSkill - 10);

  if (cfg.shotType === 'safe') actual *= 0.94;
  if (cfg.shotType === 'attack') actual *= 1.05;
  if (bird.id === 'eagle' && (lie === 'tee' || hole.distance > 220)) actual += 12;
  if (bird.id === 'woodpecker' && (lie === 'rough' || lie === 'bunker')) actual += 9;
  if (bird.id === 'flamingo' && (club.kind === 'short' || lie === 'green')) actual += 5;
  actual = clamp(actual, 3, hole.distance + 20);

  const aimPenalty = cfg.aim === 'center' ? 0 : 7;
  const touchStat = lie === 'green' ? skillPutting : skillShort;
  const qualityBase = (skillAccuracy + skillFocus + touchStat) / 3;
  let miss = rand(-18, 18) + aimPenalty * (cfg.aim === 'left' ? -1 : cfg.aim === 'right' ? 1 : 0) + (course.difficulty - qualityBase) * 1.6;
  if (cfg.shotType === 'safe') miss *= 0.78;
  if (cfg.shotType === 'attack') miss *= 1.2;

  let quality = 'Solid';
  const absoluteMiss = Math.abs(miss);
  if (absoluteMiss < 4) quality = 'Perfect';
  else if (absoluteMiss < 9) quality = 'Great';
  else if (absoluteMiss < 14) quality = 'Solid';
  else if (absoluteMiss < 19) quality = 'Scrappy';
  else quality = 'Wild';

  let remaining = hole.distance - actual;
  let nextLie = 'fairway';
  let penalty = 0;
  const onGreen = remaining <= 16;

  if (lie === 'green') {
    nextLie = 'green';
    let holeChance = clamp((skillPutting * 0.1) + (16 - hole.distance) * 0.03 + (cfg.shotType === 'attack' ? 0.04 : 0), 0.08, 0.72);
    if (bird.id === 'flamingo') holeChance += 0.05;
    if (hole.distance <= 6 && Math.random() < holeChance) {
      remaining = 0;
      nextLie = 'cup';
    } else {
      remaining = Math.abs(remaining) * rand(0.12, 0.5);
      nextLie = 'green';
    }
  } else if (onGreen) {
    nextLie = 'green';
    if (absoluteMiss > 12 && Math.random() < 0.25) nextLie = 'bunker';
  } else {
    if (absoluteMiss < 7) nextLie = 'fairway';
    else if (absoluteMiss < 13) nextLie = 'rough';
    else if (absoluteMiss < 18) nextLie = Math.random() < 0.5 ? 'rough' : 'bunker';
    else nextLie = Math.random() < 0.35 ? 'water' : 'rough';
  }

  const usedLuckyTee = !!(nextLie === 'water' && state.activeGear.tee && !state.activeRound.teeUsed);
  if (nextLie === 'water') {
    if (usedLuckyTee) {
      state.activeRound.teeUsed = true;
      nextLie = 'rough';
      remaining += 10;
      quality = `${quality} (Lucky Tee!)`;
    } else {
      penalty = 1;
      remaining += 18;
      nextLie = 'rough';
    }
  }

  if (remaining <= 1.5 && (nextLie === 'green' || nextLie === 'cup' || lie === 'green')) {
    remaining = 0;
    nextLie = 'cup';
  }

  const pos = positionForDistance(remaining, nextLie, hole.yards);
  const text = shotResultText(hole, cfg, actual, nextLie, penalty, remaining, quality, usedLuckyTee);

  return {
    club: club.name,
    clubId: club.id,
    carry: actual,
    penalty,
    nextLie,
    remaining: clamp(remaining, 0, hole.yards),
    x: pos.x,
    y: pos.y,
    scale: pos.scale,
    text,
    shotType: cfg.shotType,
    aim: cfg.aim,
    label: `${quality} • ${club.name} • ${cfg.power}% • ${titleCase(cfg.aim)}`
  };
}

function positionForDistance(remaining, lie, totalYards) {
  const progress = clamp(1 - (remaining / Math.max(totalYards, 1)), 0, 1);
  let x = 46;
  let y = 80 - progress * 56;
  if (lie === 'rough') x += pick([-18, 18]);
  if (lie === 'bunker') x += pick([-11, 11]);
  if (lie === 'green' || lie === 'cup') { x = 50 + rand(-5, 5); y = 25 + rand(-4, 5); }
  if (lie === 'fairway') x += rand(-4, 4);
  const scale = 1 - progress * 0.42;
  return { x: clamp(x, 16, 84), y: clamp(y, 22, 80), scale: clamp(scale, .55, 1) };
}

function shotResultText(hole, cfg, actual, nextLie, penalty, remaining, quality, usedLuckyTee) {
  const bird = getBird();
  let line = `${quality} strike! ${bird.name} hits ${clubName(cfg.club)} for ${fmt(actual)} yards.`;
  if (usedLuckyTee) line += ` The Lucky Tee keeps it out of the water.`;
  if (penalty) line += ` Penalty stroke after finding water.`;
  if (nextLie === 'green') line += ` It finishes on the green with ${fmt(remaining)}y left.`;
  else if (nextLie === 'cup') line += ` It's holed!`;
  else line += ` Next up: ${fmt(remaining)}y from the ${nextLie}.`;
  return line;
}

async function animateShot(hole, result, bird) {
  const start = { x: hole.x || 46, y: hole.y || 80 };
  $('courseRibbon').textContent = titleCase(hole.lie);
  $('shotLabel').textContent = result.label;
  $('liveSubtitle').textContent = result.text;
  pushCommentary(`Shot ${hole.strokes + 1}`, result.text);

  moveBirdTo(start.x, start.y + 2);
  setBirdFrame(bird.id, 'ready');
  await sleep(180);
  setBirdFrame(bird.id, 'backswing');
  $('liveBird').classList.remove('swinging');
  void $('liveBird').offsetWidth;
  $('liveBird').classList.add('swinging');
  await sleep(160);
  setBirdFrame(bird.id, 'swing');
  moveBallTo(result.x, result.y, result.scale);
  drawTrail(start.x, start.y, result.x, result.y, hole.strokes + 1);
  await sleep(740);
  setBirdFrame(bird.id, 'idle');
  moveBirdTo(result.x, result.y + 2);
  await sleep(220);
}

function applyShotResult(hole, result) {
  hole.strokes += 1 + result.penalty;
  hole.distance = result.remaining;
  hole.lie = result.nextLie === 'cup' ? 'green' : result.nextLie;
  hole.x = result.x;
  hole.y = result.y;
  hole.log.push(result.text);
  if (result.remaining <= 0 || result.nextLie === 'cup') {
    hole.holed = true;
    hole.distance = 0;
    hole.lie = 'cup';
  }
}

function completeHole(hole) {
  const relative = hole.strokes - hole.par;
  hole.score = { strokes: hole.strokes, relative };
  state.activeRound.totalStrokes += hole.strokes;
  state.activeRound.parSoFar += hole.par;
  pushCommentary(`Hole ${state.activeRound.currentHoleIndex + 1}`, `${getBird().fullName} makes ${hole.strokes} on the hole. ${resultShort(relative)}.`);

  if (state.activeRound.currentHoleIndex >= state.activeRound.holes.length - 1) {
    finishRound();
    return;
  }

  state.activeRound.currentHoleIndex += 1;
  const next = currentHole();
  next.x = 46; next.y = 80;
  resetLiveStage();
  $('liveTitle').textContent = `${next.name} • ${next.yards}y`;
  $('liveSubtitle').textContent = `On to the next tee.`;
}

function finishRound() {
  const round = state.activeRound;
  round.finished = true;
  const totalPar = round.holes.reduce((sum, h) => sum + h.par, 0);
  const toPar = round.totalStrokes - totalPar;
  const course = getCourse(round.courseId);
  const strategy = strategies[round.strategy];
  let coins = Math.max(30, Math.floor((course.reward + (totalPar - round.totalStrokes) * 12) * strategy.reward));
  let feathers = getBird().id === 'crow' ? Math.floor(rand(2, 8)) : Math.floor(rand(0, 4));
  let xp = Math.max(24, Math.floor(60 + (totalPar - round.totalStrokes) * 8 + course.difficulty * 6));

  if (round.mode === 'tournament') {
    coins += 120;
    feathers += 12;
    xp += 55;
    state.tournamentStamp = todayStamp();
    state.dailyTournamentBest = prettyScore(toPar);
  }

  state.coins += coins;
  state.feathers += feathers;
  state.clubXp += xp;
  state.birdLevels[getBird().id] = lvl(getBird().id) + (xp > 90 ? 1 : 0);
  levelClubIfNeeded();
  state.lastRound = JSON.parse(JSON.stringify(round));
  state.lastRound.summary = `${getBird().fullName} shot ${prettyScore(toPar)} at ${course.name}.`;
  pushCommentary('Round complete', `${state.lastRound.summary} Rewards: ${coins} coins, ${feathers} feathers, ${xp} XP.`);
  $('liveTitle').textContent = `Round complete: ${prettyScore(toPar)}`;
  $('liveSubtitle').textContent = `${coins} coins • ${feathers} feathers • ${xp} XP earned.`;
  state.activeRound = null;
  toast('Round complete!');
}

async function autoHole() {
  if (!currentHole() || busy) return;
  while (currentHole() && !currentHole().holed) {
    await hitShot('auto');
    await sleep(200);
  }
}

async function autoRound() {
  if (busy) return;
  if (!state.activeRound) startNewRound();
  while (state.activeRound) {
    await autoHole();
    await sleep(250);
  }
}

function clubName(id) {
  return clubs.find(c => c.id === id)?.name || id;
}

function titleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function levelClubIfNeeded() {
  let need = xpNeed();
  while (state.clubXp >= need) {
    state.clubXp -= need;
    state.clubLevel += 1;
    need = xpNeed();
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
  pushCommentary('Range', `Your Birdies return from the range with ${r.coins} coins and ${r.feathers} feathers.`);
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
  openModal(`<h2>Clubhouse</h2><p>Upgrade the club to improve your Birdies and range rewards.</p>
    <div class="upgrade-list">
      ${upgradeRow('range', 'Driving Range', 'Improves power development and coin rewards.')}
      ${upgradeRow('green', 'Putting Green', 'Improves touch around the green and idle gains.')}
      ${upgradeRow('workshop', 'Club Workshop', 'Improves all-round consistency and feathers.')}
    </div>`);
  document.querySelectorAll('[data-upgrade]').forEach(btn => btn.addEventListener('click', () => upgrade(btn.dataset.upgrade)));
}

function upgradeRow(key, title, desc) {
  return `<div class="upgrade-row"><div><strong>${title} Lv ${state.upgrades[key]}</strong><p>${desc}</p></div><button data-upgrade="${key}">Upgrade<br/>${upgradeCost(key)} 🪙</button></div>`;
}

function buyItem(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item) return;
  if (state.inventory[item.id]) {
    state.activeGear[item.slot] = state.activeGear[item.slot] === item.id ? false : item.id;
    saveState();
    render();
    showShop();
    toast(state.activeGear[item.slot] ? `${item.name} equipped.` : `${item.name} unequipped.`);
    return;
  }
  if (state.coins < item.costCoins || state.feathers < item.costFeathers) return toast('Not enough resources yet.');
  state.coins -= item.costCoins;
  state.feathers -= item.costFeathers;
  state.inventory[item.id] = true;
  state.activeGear[item.slot] = item.id;
  saveState();
  render();
  showShop();
  toast(`${item.name} purchased and equipped.`);
}

function showShop() {
  openModal(`<h2>Shop</h2><p>Permanent gear unlocks that actually affect gameplay.</p>
    <div class="upgrade-list">
      ${shopItems.map(item => `<div class="upgrade-row"><div><strong>${item.name}</strong><p>${item.desc}</p></div><button data-shop="${item.id}">${state.inventory[item.id] ? (state.activeGear[item.slot] === item.id ? 'Unequip' : 'Equip') : `${item.costCoins} 🪙${item.costFeathers ? ` + ${item.costFeathers} 🪶` : ''}`}</button></div>`).join('')}
    </div>`);
  document.querySelectorAll('[data-shop]').forEach(btn => btn.addEventListener('click', () => buyItem(btn.dataset.shop)));
}

function showTournaments() {
  const alreadyPlayed = state.tournamentStamp === todayStamp();
  openModal(`<h2>Tournaments</h2><p>Take on today's daily 3-hole medal for bonus rewards.</p>
    <div class="upgrade-list">
      <div class="upgrade-row"><div><strong>Daily Birdie Medal</strong><p>3 holes at Bramblewood. Bonus rewards once per day. ${alreadyPlayed ? `Today's best: ${state.dailyTournamentBest}.` : 'Not played today yet.'}</p></div><button id="dailyTournamentBtn" ${alreadyPlayed ? 'disabled' : ''}>${alreadyPlayed ? 'Completed today' : 'Start daily'}</button></div>
      <div class="upgrade-row"><div><strong>Feather Cup</strong><p>More tournament types coming soon.</p></div><button disabled>Coming soon</button></div>
    </div>`);
  const btn = $('dailyTournamentBtn');
  if (btn && !alreadyPlayed) btn.addEventListener('click', () => { $('modal').close(); startNewRound('tournament', unlockedCourse(getCourse('bramble')) ? 'bramble' : 'pebblebrook', 3); });
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

function pushCommentary(label, text) {
  const feed = $('commentaryFeed');
  const item = document.createElement('div');
  item.className = 'commentary-item';
  item.innerHTML = `<span class="commentary-badge">${label}</span><div>${text}</div>`;
  feed.appendChild(item);
  feed.scrollTop = feed.scrollHeight;
}

function setBirdFrame(id, frame) {
  $('liveBird').src = asset(`${id}-${frame}`);
}

function moveBirdTo(x, y) {
  const bird = $('liveBird');
  bird.style.left = `${x}%`;
  bird.style.top = `${y}%`;
}

function moveBallTo(x, y, scale) {
  const ball = $('liveBall');
  const shadow = $('ballShadow');
  ball.classList.remove('flying');
  void ball.offsetWidth;
  ball.classList.add('flying');
  ball.style.left = `${x}%`;
  ball.style.top = `${y}%`;
  ball.style.transform = `translate(-50%, -50%) scale(${scale})`;
  shadow.style.left = `${x}%`;
  shadow.style.top = `${y + 1.8}%`;
}

function drawTrail(x1, y1, x2, y2, shotNumber) {
  const trail = $('shotTrail');
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const line = document.createElement('i');
  line.style.left = `${x1}%`;
  line.style.top = `${y1}%`;
  line.style.width = `${distance * 5.2}px`;
  line.style.transform = `rotate(${angle}deg)`;
  trail.appendChild(line);
  const dot = document.createElement('span');
  dot.style.left = `${x2}%`;
  dot.style.top = `${y2}%`;
  dot.textContent = shotNumber;
  trail.appendChild(dot);
}

function syncBallAndBird(hole) {
  moveBirdTo(hole.x || 46, (hole.y || 80) + 2);
  moveBallTo(hole.x || 46, hole.y || 80, 1 - (1 - (hole.distance / Math.max(hole.yards,1))) * 0.42);
  $('courseRibbon').textContent = titleCase(hole.lie === 'cup' ? 'green' : hole.lie);
  $('shotLabel').textContent = hole.holed ? 'Hole complete' : `Awaiting ${titleCase(state.selectedPlayMode)} shot`;
  if (hole.holed) {
    $('liveBall').style.left = '50%';
    $('liveBall').style.top = '25%';
    $('ballShadow').style.left = '50%';
    $('ballShadow').style.top = '26.8%';
  }
}

function resetLiveStage() {
  const hole = currentHole();
  const bird = getBird();
  $('shotTrail').innerHTML = '';
  setBirdFrame(bird.id, 'idle');
  if (!hole) {
    moveBirdTo(46, 82);
    moveBallTo(46, 80, 1);
    $('courseRibbon').textContent = 'Ready';
    $('shotLabel').textContent = 'No shot yet';
    return;
  }
  moveBirdTo(hole.x || 46, (hole.y || 80) + 2);
  moveBallTo(hole.x || 46, hole.y || 80, 1);
  $('courseRibbon').textContent = titleCase(hole.lie);
  $('shotLabel').textContent = 'Ready to play';
}

function toggleActionButtons(disabled) {
  ['newRoundButton', 'hitShotButton', 'autoShotButton', 'autoHoleButton', 'autoRoundButton'].forEach(id => $(id).disabled = disabled);
}

$('courseSelect').addEventListener('change', e => { state.selectedCourse = e.target.value; saveState(); render(); });
$('strategySelect').addEventListener('change', e => { state.selectedStrategy = e.target.value; saveState(); renderRecommendation(); });
$('clubSelect').addEventListener('change', e => { state.selectedClub = e.target.value; saveState(); renderRecommendation(); });
$('aimSelect').addEventListener('change', e => { state.selectedAim = e.target.value; saveState(); });
$('shotTypeSelect').addEventListener('change', e => { state.selectedShotType = e.target.value; saveState(); });
$('playModeSelect').addEventListener('change', e => { state.selectedPlayMode = e.target.value; saveState(); renderRecommendation(); });
$('powerSlider').addEventListener('input', e => { state.power = +e.target.value; $('powerValue').textContent = `${state.power}%`; saveState(); });
$('newRoundButton').addEventListener('click', () => startNewRound());
$('hitShotButton').addEventListener('click', () => hitShot('manual'));
$('autoShotButton').addEventListener('click', () => hitShot('auto'));
$('autoHoleButton').addEventListener('click', autoHole);
$('autoRoundButton').addEventListener('click', autoRound);
$('idleButton').addEventListener('click', collectIdle);
$('clubhouseButton').addEventListener('click', showClubhouse);
$('shopButton').addEventListener('click', showShop);
$('tournamentButton').addEventListener('click', showTournaments);
$('resetButton').addEventListener('click', () => {
  if (!confirm('Reset The Birdie Club save?')) return;
  localStorage.removeItem('birdieClubSaveV7');
  state = structuredClone(defaultState);
  saveState();
  $('commentaryFeed').innerHTML = '';
  render();
  resetLiveStage();
});

document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') renderIdlePreview(); });
setInterval(renderIdlePreview, 60000);

render();
resetLiveStage();
