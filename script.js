const trainingPlan = {
  monday: [
    "Run 5km",
    ["Swim 20 laps", "Cycle 10km"],
    "Stretch for 15min"
  ],
  tuesday: [
    "Yoga session",
    ["Read a fitness article", "Watch a workout video"],
    "Meditate for 10min"
  ],
  wednesday: [
    "HIIT workout",
    ["Push-ups", "Sit-ups"],
    "Drink 2L of water"
  ],
  thursday: [
    "Pilates",
    ["Jump rope", "Light jog"],
    "Healthy meal prep"
  ],
  friday: [
    "Strength training",
    ["Bench press", "Deadlift"],
    "Protein shake"
  ],
  saturday: [
    "Outdoor activity",
    ["Hiking", "Kayaking"],
    "Rest and recover"
  ],
  sunday: [
    "Light stretching",
    ["Family walk", "Easy bike ride"],
    "Plan next week"
  ]
};

function dateStr(date) {
  return date.toISOString().split('T')[0];
}

function getPlanForDate(date) {
  const key = 'plan_' + dateStr(date);
  let stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayPlan = trainingPlan[dayName] || [];
  const objectives = dayPlan.map(item => {
    if (Array.isArray(item)) {
      return item[Math.floor(Math.random() * item.length)];
    }
    return item;
  });
  const plan = { objectives };
  localStorage.setItem(key, JSON.stringify(plan));
  return plan;
}

function getProgressForDate(date, count) {
  const key = 'progress_' + dateStr(date);
  let stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  const arr = new Array(count).fill(false);
  localStorage.setItem(key, JSON.stringify(arr));
  return arr;
}

function saveProgress(date, arr) {
  const key = 'progress_' + dateStr(date);
  localStorage.setItem(key, JSON.stringify(arr));
}

function updateStreakIfNeeded() {
  const today = new Date();
  const yesterday = new Date(Date.now() - 864e5);
  const yesterdayKey = 'progress_' + dateStr(yesterday);
  const progress = JSON.parse(localStorage.getItem(yesterdayKey) || '[]');
  let streak = parseInt(localStorage.getItem('streak')) || 0;
  const last = localStorage.getItem('lastCompletionDate');

  if (dateStr(yesterday) !== last) {
    streak = 0;
  }

  if (progress.length && progress.every(v => v)) {
    if (last === dateStr(yesterday)) {
      // streak already counted
    } else {
      streak += 1;
      localStorage.setItem('lastCompletionDate', dateStr(yesterday));
    }
  }

  localStorage.setItem('streak', streak);
  return streak;
}

function setup() {
  let name = localStorage.getItem('userName');
  if (!name) {
    name = prompt('What is your name?');
    if (name) localStorage.setItem('userName', name);
  }
  const greeting = document.getElementById('greeting');
  if (name) {
    greeting.textContent = `Welcome back, ${name}!`;
  }

  const today = new Date();
  const planToday = getPlanForDate(today);
  const progress = getProgressForDate(today, planToday.objectives.length);

  const main = document.getElementById('today');
  main.innerHTML = `<h2>${today.toLocaleDateString('en-US', { weekday: 'long' })}</h2>`;

  planToday.objectives.forEach((obj, idx) => {
    const label = document.createElement('label');
    label.className = 'objective';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = progress[idx];
    checkbox.addEventListener('change', () => {
      progress[idx] = checkbox.checked;
      saveProgress(today, progress);
      checkCompletion();
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(obj));
    const div = document.createElement('div');
    div.appendChild(label);
    main.appendChild(div);
  });

  const streakElem = document.getElementById('streak');
  const streak = updateStreakIfNeeded();
  streakElem.textContent = `Daily Streak: ${streak}`;

  showSide('yesterday', new Date(Date.now() - 864e5));
  prepareTomorrow();
  showSide('tomorrow', new Date(Date.now() + 864e5));

  function checkCompletion() {
    if (progress.every(v => v)) {
      let streak = parseInt(localStorage.getItem('streak')) || 0;
      const last = localStorage.getItem('lastCompletionDate');
      const todayStrValue = dateStr(today);
      if (last !== todayStrValue) {
        streak += 1;
        localStorage.setItem('lastCompletionDate', todayStrValue);
      }
      localStorage.setItem('streak', streak);
      streakElem.textContent = `Daily Streak: ${streak}`;
    }
  }
}

function showSide(elementId, date) {
  const container = document.getElementById(elementId);
  const plan = getPlanForDate(date);
  container.innerHTML = `<h3>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>`;
  plan.objectives.forEach(obj => {
    const p = document.createElement('p');
    p.textContent = obj;
    container.appendChild(p);
  });
}

function prepareTomorrow() {
  const tomorrow = new Date(Date.now() + 864e5);
  getPlanForDate(tomorrow); // generate and store if not existing
}

document.addEventListener('DOMContentLoaded', setup);
