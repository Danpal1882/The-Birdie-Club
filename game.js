const birds = [
  { id: "robin", name: "Rory Robin", icon: "🐦", role: "Balanced starter", power: 5, accuracy: 5, putting: 5, ability: "+10% XP from steady rounds" },
  { id: "duck", name: "Daisy Duck", icon: "🦆", role: "Safe grinder", power: 4, accuracy: 6, putting: 5, ability: "Disaster holes are less likely" },
  { id: "owl", name: "Oswald Owl", icon: "🦉", role: "Tactical genius", power: 4, accuracy: 7, putting: 6, ability: "Safe strategy is stronger" },
  { id: "eagle", name: "Eddie Eagle", icon: "🦅", role: "Power hitter", power: 8, accuracy: 4, putting: 4, ability: "Extra eagle chance on par 5s" }
];

const courses = [
  { id: "meadows", name: "Mossy Meadows Pitch & Putt", difficulty: 4, reward: 38, trait: "Beginner friendly" },
  { id: "bramble", name: "Bramblewood Golf Club", difficulty: 6, reward: 58, trait: "Narrow fairways" },
  { id: "cliffs", name: "Windy Clifftop Links", difficulty: 8, reward: 82, trait: "Windy and punishing" }
];

const strategies = {
  safe: { score: 0.8, variance: 0.65, reward: 0.9 },
  balanced: { score: 1, variance: 1, reward: 1 },
  aggressive: { score: 1.12, variance: 1.35, reward: 1.12 },
  glory: { score: 1.28, variance: 1.85, reward: 1.25 }
};

const defaultState = {
  coins: 80,
  clubXp: 0,
  clubLevel: 1,
  selectedBird: "robin",
  birdLevels: { robin: 1, duck: 1, owl: 1, eagle: 1 },
  lastVisit: Date.now()
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem("birdieClubSave");
  return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
}

function saveState() {
  state.lastVisit = Date.now();
  localStorage.setItem("birdieClubSave", JSON.stringify(state));
}

function clamp(num, min, max) { return Math.max(min, Math.min(max, num)); }
function rand(min, max) { return Math.random() * (max - min) + min; }

function render() {
  document.getElementById("coins").textContent = Math.floor(state.coins);
  document.getElementById("clubXp").textContent = Math.floor(state.clubXp);
  document.getElementById("clubLevel").textContent = state.clubLevel;
  document.getElementById("clubhouseCost").textContent = clubhouseCost();

  const birdList = document.getElementById("birdList");
  birdList.innerHTML = birds.map(bird => {
    const level = state.birdLevels[bird.id] || 1;
    return `<article class="bird-card ${state.selectedBird === bird.id ? "selected" : ""}" data-bird="${bird.id}">
      <div class="bird-sprite">${bird.icon}</div>
      <h3>${bird.name}</h3>
      <p class="small">${bird.role}</p>
      <div class="stat-line">Lvl ${level} | Pow ${bird.power + level - 1} | Acc ${bird.accuracy + level - 1} | Putt ${bird.putting + level - 1}</div>
      <div class="stat-line">${bird.ability}</div>
    </article>`;
  }).join("");

  document.querySelectorAll(".bird-card").forEach(card => {
    card.addEventListener("click", () => {
      state.selectedBird = card.dataset.bird;
      saveState();
      render();
    });
  });

  const courseSelect = document.getElementById("courseSelect");
  courseSelect.innerHTML = courses.map(c => `<option value="${c.id}">${c.name} - ${c.trait}</option>`).join("");
}

function clubhouseCost() { return state.clubLevel * 100; }

function playRound() {
  const bird = birds.find(b => b.id === state.selectedBird);
  const course = courses.find(c => c.id === document.getElementById("courseSelect").value);
  const strategyKey = document.getElementById("strategySelect").value;
  const strategy = strategies[strategyKey];
  const level = state.birdLevels[bird.id] || 1;

  const power = bird.power + level - 1 + Math.floor(state.clubLevel / 2);
  const accuracy = bird.accuracy + level - 1 + Math.floor(state.clubLevel / 2);
  const putting = bird.putting + level - 1 + Math.floor(state.clubLevel / 2);
  const skill = (power * 0.28 + accuracy * 0.42 + putting * 0.3) * strategy.score;

  const pars = [4, 3, 5, 4, 4, 3, 5, 4, 4];
  let total = 0;
  let log = [];
  let birdies = 0;

  pars.forEach((par, index) => {
    const challenge = course.difficulty + rand(-1.5, 2.5) * strategy.variance;
    let diff = challenge - skill;
    if (bird.id === "duck") diff -= 0.35;
    if (bird.id === "owl" && strategyKey === "safe") diff -= 0.75;
    if (bird.id === "eagle" && par === 5) diff -= 0.6;

    let relative;
    if (diff < -4.5 && Math.random() > 0.55) relative = -2;
    else if (diff < -2.1) relative = -1;
    else if (diff < 1.5) relative = 0;
    else if (diff < 3.2) relative = 1;
    else if (diff < 5.3) relative = 2;
    else relative = 3;

    if (strategyKey === "glory" && Math.random() < 0.1) relative += Math.random() > 0.45 ? -2 : 2;
    relative = clamp(relative, -2, 3);
    total += relative;
    if (relative < 0) birdies++;

    const terms = { "-2": "Eagle!", "-1": "Birdie!", "0": "Par", "1": "Bogey", "2": "Double bogey", "3": "Disaster triple" };
    const flavour = relative <= -1 ? "A proper highlight for the clubhouse wall." : relative === 0 ? "Stress-free golf. Lovely stuff." : relative === 1 ? "A little wobble, but no meltdown." : "The rough has claimed another victim.";
    log.push(`Hole ${index + 1} · Par ${par} · ${terms[relative]} ${flavour}`);
  });

  const coinsEarned = Math.max(15, Math.round((course.reward - total * 5 + birdies * 8) * strategy.reward));
  const xpEarned = Math.max(8, Math.round(22 - total + birdies * 4));
  state.coins += coinsEarned;
  state.clubXp += xpEarned;

  const levelUpCost = level * 55;
  if (state.clubXp >= levelUpCost) {
    state.clubXp -= levelUpCost;
    state.birdLevels[bird.id] = level + 1;
  }

  document.getElementById("roundSummary").innerHTML = `<strong>${bird.name}</strong> played ${course.name}. Final score: <strong>${total >= 0 ? "+" + total : total}</strong>. Earned <strong>${coinsEarned}</strong> coins and <strong>${xpEarned}</strong> XP.`;
  document.getElementById("holeLog").innerHTML = log.map(item => `<li>${item}</li>`).join("");
  saveState();
  render();
}

function collectIdle() {
  const minutesAway = Math.max(1, Math.floor((Date.now() - state.lastVisit) / 60000));
  const cappedMinutes = Math.min(minutesAway, 240);
  const coins = Math.floor(cappedMinutes * (2 + state.clubLevel * 0.5));
  state.coins += coins;
  document.getElementById("roundSummary").innerHTML = `Your Birdies practised while you were away and found <strong>${coins}</strong> coins. Idle rewards are capped at 4 hours in this prototype.`;
  document.getElementById("holeLog").innerHTML = "";
  saveState();
  render();
}

function upgradeClubhouse() {
  const cost = clubhouseCost();
  if (state.coins < cost) {
    document.getElementById("roundSummary").textContent = `Not enough coins. You need ${cost} coins for the next clubhouse upgrade.`;
    return;
  }
  state.coins -= cost;
  state.clubLevel += 1;
  document.getElementById("roundSummary").innerHTML = `Clubhouse upgraded to level <strong>${state.clubLevel}</strong>. All Birdies get a tiny performance boost.`;
  saveState();
  render();
}

document.getElementById("playRound").addEventListener("click", playRound);
document.getElementById("idleButton").addEventListener("click", collectIdle);
document.getElementById("upgradeClubhouse").addEventListener("click", upgradeClubhouse);
document.getElementById("resetButton").addEventListener("click", () => {
  if (confirm("Reset your Birdie Club save?")) {
    localStorage.removeItem("birdieClubSave");
    state = { ...defaultState };
    document.getElementById("roundSummary").textContent = "Save reset. Fresh start!";
    document.getElementById("holeLog").innerHTML = "";
    render();
  }
});

render();
