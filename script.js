import monday from './monday.js';
import tuesday from './tuesday.js';
import wednesday from './wednesday.js';
import thursday from './thursday.js';
import friday from './friday.js';
import saturday from './saturday.js';
import sunday from './sunday.js';

const trainingPlan = {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
};

function dateStr(date) {
  return date.toISOString().split('T')[0];
}

function getPlanForDate(date) {
  const key = 'plan_' + dateStr(date);
  const stored = localStorage.getItem(key);

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayPlan = trainingPlan[dayName] || [];

  if (stored) {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed.objectives) && parsed.objectives.length === dayPlan.length) {
      return parsed;
    }
  }

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
  const yesterdayStr = dateStr(yesterday);
  const todayStr = dateStr(today);
  const yesterdayKey = 'progress_' + yesterdayStr;
  const progress = JSON.parse(localStorage.getItem(yesterdayKey) || '[]');
  let streak = parseInt(localStorage.getItem('streak')) || 0;
  const last = localStorage.getItem('lastCompletionDate');

  if (last && last !== todayStr && last !== yesterdayStr) {
    // User missed at least a day
    streak = 0;
  }

  if (progress.length && progress.every(v => v)) {
    if (last !== yesterdayStr && last !== todayStr) {
      streak += 1;
      localStorage.setItem('lastCompletionDate', yesterdayStr);
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
  startCountdown();

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

function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  let currentDay = dateStr(new Date());

  function update() {
    const now = new Date();
    const todayStr = dateStr(now);
    if (todayStr !== currentDay) {
      location.reload();
      return;
    }

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    let diff = midnight - now;
    if (diff < 0) diff = 0;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    el.textContent = `Next day in ${hours}h ${minutes}m ${seconds}s`;
  }

  update();
  setInterval(update, 1000);
}

document.addEventListener('DOMContentLoaded', setup);
