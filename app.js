// ========== Telegram init ==========
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready(); tg.expand();
  try { tg.setHeaderColor?.('secondary_bg_color'); } catch {}
}

// ========== Constants ==========
const STORAGE_KEY = 'gym_tracker_v1';

const MUSCLE_GROUPS = [
  { id: 'chest',     name: 'Грудь',    emoji: '🫁' },
  { id: 'back',      name: 'Спина',    emoji: '🪝' },
  { id: 'legs',      name: 'Ноги',     emoji: '🦵' },
  { id: 'shoulders', name: 'Плечи',    emoji: '🤸' },
  { id: 'biceps',    name: 'Бицепс',   emoji: '💪' },
  { id: 'triceps',   name: 'Трицепс',  emoji: '🦾' },
  { id: 'abs',       name: 'Пресс',    emoji: '🧘' },
  { id: 'cardio',    name: 'Кардио',   emoji: '🏃' },
];

const EXERCISES = {
  chest: [
    { id: 'bench_press',    name: 'Жим штанги лёжа',            hint: '4×8-10' },
    { id: 'dumbbell_press', name: 'Жим гантелей лёжа',          hint: '4×10-12' },
    { id: 'incline_press',  name: 'Жим в наклоне',              hint: '3×10-12' },
    { id: 'dips_chest',     name: 'Отжимания на брусьях',       hint: '3×8-12' },
    { id: 'cable_fly',      name: 'Разводка на блоке',          hint: '3×12-15' },
    { id: 'pushups',        name: 'Отжимания от пола',          hint: '3×макс' },
  ],
  back: [
    { id: 'deadlift',       name: 'Становая тяга',              hint: '4×5-6' },
    { id: 'pullups',        name: 'Подтягивания',               hint: '4×6-10' },
    { id: 'barbell_row',    name: 'Тяга штанги в наклоне',      hint: '4×8-10' },
    { id: 'dumbbell_row',   name: 'Тяга гантели',               hint: '3×10-12' },
    { id: 'lat_pulldown',   name: 'Тяга верхнего блока',        hint: '3×10-12' },
    { id: 'seated_row',     name: 'Тяга нижнего блока',         hint: '3×10-12' },
  ],
  legs: [
    { id: 'squat',          name: 'Приседания со штангой',      hint: '4×6-8' },
    { id: 'leg_press',      name: 'Жим ногами',                 hint: '4×10-12' },
    { id: 'lunges',         name: 'Выпады',                     hint: '3×10/нога' },
    { id: 'romanian_dl',    name: 'Румынская тяга',             hint: '4×8-10' },
    { id: 'leg_curl',       name: 'Сгибания ног',               hint: '3×12' },
    { id: 'calf_raise',     name: 'Подъёмы на носки',           hint: '4×15' },
  ],
  shoulders: [
    { id: 'ohp',            name: 'Жим штанги стоя',            hint: '4×6-8' },
    { id: 'db_shoulder_press', name: 'Жим гантелей сидя',       hint: '3×10-12' },
    { id: 'lateral_raise',  name: 'Махи гантелями в стороны',   hint: '4×12-15' },
    { id: 'rear_delt',      name: 'Разведения в наклоне',       hint: '3×12-15' },
    { id: 'face_pull',      name: 'Тяга к лицу',                hint: '3×12-15' },
  ],
  biceps: [
    { id: 'barbell_curl',   name: 'Подъём штанги на бицепс',    hint: '3×8-10' },
    { id: 'db_curl',        name: 'Подъём гантелей',            hint: '3×10-12' },
    { id: 'hammer_curl',    name: 'Молотки',                    hint: '3×10-12' },
    { id: 'preacher_curl',  name: 'Скамья Скотта',              hint: '3×10-12' },
  ],
  triceps: [
    { id: 'dips_triceps',   name: 'Брусья (трицепс)',           hint: '3×8-12' },
    { id: 'french_press',   name: 'Французский жим',            hint: '3×10-12' },
    { id: 'pushdown',       name: 'Разгибания на блоке',        hint: '3×12-15' },
    { id: 'close_bench',    name: 'Жим узким хватом',           hint: '3×8-10' },
  ],
  abs: [
    { id: 'crunches',       name: 'Скручивания',                hint: '3×15-20' },
    { id: 'plank',          name: 'Планка',                     hint: '3×60 сек' },
    { id: 'leg_raise',      name: 'Подъём ног',                 hint: '3×12-15' },
    { id: 'russian_twist',  name: 'Русские скручивания',        hint: '3×20' },
  ],
  cardio: [
    { id: 'treadmill',      name: 'Беговая дорожка',            hint: '20-30 мин' },
    { id: 'bike',           name: 'Велотренажёр',               hint: '20-30 мин' },
    { id: 'rower',          name: 'Гребля',                     hint: '15-20 мин' },
    { id: 'jump_rope',      name: 'Скакалка',                   hint: '10-15 мин' },
  ],
};

const DAY_SHORT = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const DAY_FULL  = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const DIFF_EMOJI = { easy: '🟢', medium: '🟡', hard: '🔴' };

// ========== State ==========
let state;
let currentTab = 'workout';

function defaultState() {
  return {
    schedule: { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] },
    activeWorkout: null,
    history: [],
    settings: { restSeconds: 90 },
    customExercises: {},
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    const d = defaultState();
    return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
  } catch { return defaultState(); }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ========== Helpers ==========
const todayIndex = () => (new Date().getDay() + 6) % 7;
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function haptic(t = 'light') {
  try { tg?.HapticFeedback?.impactOccurred(t); } catch {}
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

const getGroup = id => MUSCLE_GROUPS.find(g => g.id === id);
const exercisesForGroup = id => [...(EXERCISES[id] || []), ...(state.customExercises[id] || [])];

function findLastSession(exerciseId) {
  for (let i = state.history.length - 1; i >= 0; i--) {
    const w = state.history[i];
    const ex = w.exercises.find(e => e.exerciseId === exerciseId);
    if (ex) {
      const done = ex.sets.filter(s => s.done);
      if (done.length) return { ...ex, sets: done };
    }
  }
  return null;
}

// ========== Render ==========
function render() {
  const view = document.getElementById('view');
  const titleEl = document.getElementById('title');
  const actionsEl = document.getElementById('headerActions');
  actionsEl.innerHTML = '';
  view.innerHTML = '';
  view.scrollTop = 0;

  const titles = { workout: 'Тренировка', schedule: 'План недели', history: 'История', settings: 'Настройки' };
  titleEl.textContent = titles[currentTab] || 'Gym Tracker';

  if (currentTab === 'workout')      renderWorkout(view, actionsEl);
  else if (currentTab === 'schedule') renderSchedule(view, actionsEl);
  else if (currentTab === 'history')  renderHistory(view, actionsEl);
  else if (currentTab === 'settings') renderSettings(view, actionsEl);

  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === currentTab)
  );
}

// ========== Workout tab ==========
function renderWorkout(view, actionsEl) {
  const w = state.activeWorkout;

  if (!w) {
    const di = todayIndex();
    const groups = state.schedule[di] || [];
    let html = `<div class="card">
      <div class="muted">${DAY_FULL[di]}, ${new Date().toLocaleDateString('ru-RU', {day:'numeric', month:'long'})}</div>
      <h2>${groups.length ? 'План на сегодня' : 'День отдыха'}</h2>`;

    if (groups.length) {
      html += `<div class="chips">${groups.map(g => {
        const gr = getGroup(g);
        return `<span class="chip">${gr.emoji} ${gr.name}</span>`;
      }).join('')}</div>
      <button class="btn btn-primary btn-block" onclick="startTodayWorkout()">Начать тренировку</button>`;
    } else {
      html += `<p class="muted">Мышцы на сегодня не запланированы. Отдохните или настройте план.</p>
      <button class="btn btn-secondary btn-block" onclick="switchTab('schedule')">Настроить план</button>
      <button class="btn btn-primary btn-block" onclick="startEmptyWorkout()">Тренировка без плана</button>`;
    }

    html += `</div>`;

    // Быстрый старт: если есть история — показать последние группы
    if (state.history.length) {
      const last = state.history[state.history.length - 1];
      html += `<div class="card">
        <h3>Прошлая тренировка</h3>
        <div class="muted">${fmtDate(last.date)}</div>
        <div class="chips">${(last.muscleGroups || []).map(g => {
          const gr = getGroup(g);
          return gr ? `<span class="chip">${gr.emoji} ${gr.name}</span>` : '';
        }).join('')}</div>
      </div>`;
    }

    view.innerHTML = html;
    return;
  }

  // Активная тренировка
  const totalSets = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).length, 0);
  const volume = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).reduce((v,s) => v + (+s.weight||0)*(+s.reps||0), 0), 0);

  let html = `<div class="workout-summary" id="workoutSummary">${totalSets} подходов • ${volume} кг объём</div>`;
  html += `<div class="chips" style="margin-bottom:10px">${(w.muscleGroups||[]).map(g => {
    const gr = getGroup(g);
    return gr ? `<span class="chip">${gr.emoji} ${gr.name}</span>` : '';
  }).join('')}</div>`;

  w.exercises.forEach((ex, i) => {
    html += renderExerciseCard(ex, i);
  });

  html += `<button class="btn btn-secondary btn-block" onclick="openAddExercise()">+ Добавить упражнение</button>`;
  html += `<button class="btn btn-primary btn-block" onclick="finishWorkout()">✓ Завершить тренировку</button>`;
  html += `<button class="btn btn-secondary btn-block" onclick="cancelWorkout()" style="color:var(--danger)">Отменить</button>`;

  view.innerHTML = html;
}

function renderExerciseCard(ex, idx) {
  const lastSession = findLastSession(ex.exerciseId);
  let progressionHint = '';
  if (lastSession && lastSession.sets.length) {
    const maxW = Math.max(...lastSession.sets.map(s => +s.weight || 0));
    const allEasy = lastSession.sets.every(s => s.difficulty === 'easy');
    const allHard = lastSession.sets.every(s => s.difficulty === 'hard');
    if (allEasy && maxW > 0) {
      progressionHint = `💡 Все подходы были лёгкими — попробуй +2.5 кг (${(maxW+2.5).toFixed(1)} кг)`;
    } else if (allHard) {
      progressionHint = `💡 В прошлый раз было тяжело — оставь тот же вес или чуть снизь`;
    } else {
      progressionHint = `💡 Прошлый раз: ${maxW} кг`;
    }
  }

  let html = `<div class="exercise-card">
    <div class="exercise-header">
      <div>
        <div class="exercise-title">${escapeHtml(ex.name)}</div>
        <div class="exercise-hint">${escapeHtml(ex.hint || '')}</div>
      </div>
      <button class="exercise-remove" onclick="removeExercise(${idx})" title="Удалить">×</button>
    </div>`;

  if (progressionHint) html += `<div class="progression-hint">${progressionHint}</div>`;

  ex.sets.forEach((set, si) => {
    html += `<div class="set-row ${set.done ? 'done' : ''}">
      <span class="set-num">${si+1}</span>
      <input type="number" class="set-weight" inputmode="decimal" step="0.5"
        value="${set.weight}" placeholder="кг"
        oninput="updateSetWeight(${idx},${si},this.value)">
      <span class="set-x">×</span>
      <input type="number" class="set-reps" inputmode="numeric" step="1"
        value="${set.reps}" placeholder="раз"
        oninput="updateSetReps(${idx},${si},this.value)">
      <button class="set-diff diff-${set.difficulty}"
        onclick="cycleDifficulty(${idx},${si},this)">${DIFF_EMOJI[set.difficulty]}</button>
      <button class="set-done ${set.done ? 'done' : ''}"
        onclick="toggleSetDone(${idx},${si},this)">${set.done ? '✓' : '○'}</button>
      <button class="set-remove" onclick="removeSet(${idx},${si})">×</button>
    </div>`;
  });

  html += `<div class="exercise-actions">
    <button class="btn-mini" onclick="addSet(${idx})">+ Подход</button>
    <button class="btn-mini" onclick="editNotes(${idx})">📝 Заметка</button>
  </div></div>`;

  return html;
}

function updateWorkoutSummary() {
  const el = document.getElementById('workoutSummary');
  if (!el || !state.activeWorkout) return;
  const w = state.activeWorkout;
  const totalSets = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).length, 0);
  const volume = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).reduce((v,s) => v + (+s.weight||0)*(+s.reps||0), 0), 0);
  el.textContent = `${totalSets} подходов • ${volume} кг объём`;
}

// ========== Schedule tab ==========
function renderSchedule(view, actionsEl) {
  let html = '';
  const di = todayIndex();
  for (let d = 0; d < 7; d++) {
    const groups = state.schedule[d] || [];
    html += `<div class="day-card ${d === di ? 'today' : ''}" onclick="openScheduleEditor(${d})">
      <div class="day-name">${DAY_SHORT[d]}</div>
      <div class="day-groups">${groups.length
        ? groups.map(g => {
            const gr = getGroup(g);
            return gr ? `<span class="chip">${gr.emoji} ${gr.name}</span>` : '';
          }).join('')
        : '<span class="empty-label">—</span>'}</div>
      <div>✏️</div>
    </div>`;
  }
  html += `<div class="card muted" style="text-align:center;font-size:12px">
    Нажмите на день, чтобы выбрать группы мышц. Приложение будет подбирать упражнения на тренировку.
  </div>`;
  view.innerHTML = html;
}

// ========== History tab ==========
function renderHistory(view, actionsEl) {
  if (!state.history.length) {
    view.innerHTML = `<div class="card" style="text-align:center;padding:40px 16px">
      <div style="font-size:40px;margin-bottom:8px">📊</div>
      <p class="muted">Здесь появится история ваших тренировок</p>
    </div>`;
    return;
  }

  let html = '';
  for (let i = state.history.length - 1; i >= 0; i--) {
    const w = state.history[i];
    const totalSets = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).length, 0);
    const volume = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).reduce((v,s) => v + (+s.weight||0)*(+s.reps||0), 0), 0);

    html += `<div class="card history-item" onclick="toggleHistory(${i}, this)">
      <div class="history-header">
        <div>
          <div class="history-date">${fmtDate(w.date)}</div>
          <div class="history-meta">${totalSets} подходов • ${volume} кг</div>
        </div>
        <div>▾</div>
      </div>
      <div class="chips">${(w.muscleGroups||[]).map(g => {
        const gr = getGroup(g);
        return gr ? `<span class="chip">${gr.emoji} ${gr.name}</span>` : '';
      }).join('')}</div>
      <div class="history-details">
        ${w.exercises.filter(e => e.sets.some(s => s.done)).map(e => `
          <div class="history-exercise">
            <b>${escapeHtml(e.name)}</b>
            ${e.sets.filter(s=>s.done).map((s, j) =>
              `<div class="history-set-line">Подход ${j+1}: ${s.weight||0} кг × ${s.reps||0} ${DIFF_EMOJI[s.difficulty]}</div>`
            ).join('')}
          </div>
        `).join('')}
      </div>
    </div>`;
  }
  view.innerHTML = html;
}

window.toggleHistory = (i, el) => {
  el.classList.toggle('expanded');
  haptic('light');
};

// ========== Settings tab ==========
function renderSettings(view, actionsEl) {
  let html = `<div class="card">
    <h3>Настройки</h3>
    <div class="settings-row">
      <span>Отдых между подходами (сек)</span>
      <input type="number" id="setRest" value="${state.settings.restSeconds}" min="0" max="600" step="15"
        onchange="updateRestSetting(this.value)">
    </div>
  </div>

  <div class="card">
    <h3>Экспорт данных</h3>
    <p class="muted" style="font-size:12px">Скопируйте JSON ниже, чтобы сохранить историю, или вставьте для импорта.</p>
    <textarea id="exportArea" readonly>${escapeHtml(JSON.stringify(state))}</textarea>
    <div class="exercise-actions">
      <button class="btn-mini" onclick="copyExport()">📋 Копировать</button>
      <button class="btn-mini" onclick="importData()">📥 Импорт из текста</button>
    </div>
  </div>

  <div class="card">
    <h3 style="color:var(--danger)">Опасная зона</h3>
    <button class="btn btn-danger btn-block" onclick="resetAll()">Сбросить все данные</button>
  </div>

  <div class="card" style="text-align:center">
    <div class="muted" style="font-size:12px">Gym Tracker v1 • данные хранятся локально</div>
  </div>`;
  view.innerHTML = html;
}

// ========== Workout actions ==========
window.startTodayWorkout = () => {
  const di = todayIndex();
  const groups = state.schedule[di] || [];
  if (!groups.length) return startEmptyWorkout();
  startWorkout(groups);
};

window.startEmptyWorkout = () => {
  openMuscleGroupPicker((selected) => {
    if (selected.length) startWorkout(selected);
  });
};

function startWorkout(groups) {
  const exercises = [];
  const seen = new Set();
  for (const g of groups) {
    for (const ex of exercisesForGroup(g).slice(0, 3)) {
      if (seen.has(ex.id)) continue;
      seen.add(ex.id);
      exercises.push(makeExerciseEntry(ex, g));
    }
  }
  if (!exercises.length) { toast('Нет доступных упражнений'); return; }
  state.activeWorkout = {
    startedAt: Date.now(),
    date: todayKey(),
    muscleGroups: [...groups],
    exercises,
  };
  saveState();
  render();
  haptic('medium');
}

function makeExerciseEntry(ex, groupId) {
  const last = findLastSession(ex.id);
  let sets;
  if (last) {
    sets = last.sets.map(s => ({ weight: s.weight, reps: s.reps, difficulty: 'medium', done: false }));
  } else {
    sets = Array.from({ length: 3 }, () => ({ weight: '', reps: '', difficulty: 'medium', done: false }));
  }
  return { exerciseId: ex.id, groupId, name: ex.name, hint: ex.hint, sets, notes: '' };
}

window.addSet = (idx) => {
  const ex = state.activeWorkout.exercises[idx];
  const last = ex.sets[ex.sets.length - 1] || { weight: '', reps: '' };
  ex.sets.push({ weight: last.weight, reps: last.reps, difficulty: 'medium', done: false });
  saveState(); render();
};

window.removeSet = (idx, si) => {
  const ex = state.activeWorkout.exercises[idx];
  ex.sets.splice(si, 1);
  if (!ex.sets.length) state.activeWorkout.exercises.splice(idx, 1);
  saveState(); render();
};

window.removeExercise = (idx) => {
  if (!confirm('Удалить упражнение из тренировки?')) return;
  state.activeWorkout.exercises.splice(idx, 1);
  saveState(); render();
};

window.updateSetWeight = (idx, si, val) => {
  state.activeWorkout.exercises[idx].sets[si].weight = val;
  saveState(); updateWorkoutSummary();
};

window.updateSetReps = (idx, si, val) => {
  state.activeWorkout.exercises[idx].sets[si].reps = val;
  saveState(); updateWorkoutSummary();
};

window.cycleDifficulty = (idx, si, btn) => {
  const set = state.activeWorkout.exercises[idx].sets[si];
  const order = ['easy', 'medium', 'hard'];
  set.difficulty = order[(order.indexOf(set.difficulty) + 1) % 3];
  saveState();
  btn.textContent = DIFF_EMOJI[set.difficulty];
  btn.className = 'set-diff diff-' + set.difficulty;
  haptic('light');
};

window.toggleSetDone = (idx, si, btn) => {
  const set = state.activeWorkout.exercises[idx].sets[si];
  set.done = !set.done;
  saveState();
  btn.classList.toggle('done', set.done);
  btn.textContent = set.done ? '✓' : '○';
  btn.closest('.set-row').classList.toggle('done', set.done);
  if (set.done) { haptic('medium'); startRest(); }
  updateWorkoutSummary();
};

window.editNotes = (idx) => {
  const ex = state.activeWorkout.exercises[idx];
  const notes = prompt(`Заметка к упражнению "${ex.name}":`, ex.notes || '');
  if (notes !== null) {
    ex.notes = notes;
    saveState();
    toast('Заметка сохранена');
  }
};

window.finishWorkout = () => {
  const w = state.activeWorkout;
  if (!w) return;
  const doneSets = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).length, 0);
  if (doneSets === 0) {
    if (!confirm('Ни один подход не отмечен. Завершить без сохранения?')) return;
    state.activeWorkout = null;
    saveState(); render();
    return;
  }
  const workout = {
    ...w,
    finishedAt: Date.now(),
    duration: Math.round((Date.now() - w.startedAt) / 60000),
  };
  state.history.push(workout);
  state.activeWorkout = null;
  saveState();
  toast('Тренировка сохранена! 💪');
  haptic('success');
  render();
};

window.cancelWorkout = () => {
  if (!confirm('Отменить тренировку? Данные не сохранятся.')) return;
  state.activeWorkout = null;
  saveState(); render();
};

// ========== Rest timer ==========
let restInterval = null;
function startRest() {
  const sec = +state.settings.restSeconds;
  if (!sec || sec <= 0) return;
  stopRest();
  let remaining = sec;
  const bar = document.getElementById('restBar');
  bar.classList.add('show');
  const update = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    document.getElementById('restTime').textContent = `${m}:${String(s).padStart(2,'0')}`;
  };
  update();
  restInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      stopRest();
      haptic('heavy');
      toast('Отдых закончен! 💪');
    } else update();
  }, 1000);
}

window.stopRest = () => {
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
  document.getElementById('restBar').classList.remove('show');
};

// ========== Schedule editor ==========
window.openScheduleEditor = (dayIdx) => {
  const current = new Set(state.schedule[dayIdx] || []);
  const chips = MUSCLE_GROUPS.map(g =>
    `<button class="chip-toggle ${current.has(g.id) ? 'active' : ''}"
      data-group="${g.id}" onclick="toggleScheduleChip(this)">${g.emoji} ${g.name}</button>`
  ).join('');

  openModal(`
    <h3>${DAY_FULL[dayIdx]}</h3>
    <div class="chips" style="margin-bottom:16px">${chips}</div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="saveSchedule(${dayIdx})">Сохранить</button>
    </div>
  `);
};

window.toggleScheduleChip = (btn) => {
  btn.classList.toggle('active');
  haptic('light');
};

window.saveSchedule = (dayIdx) => {
  const selected = [...document.querySelectorAll('.chip-toggle.active')]
    .map(el => el.dataset.group);
  state.schedule[dayIdx] = selected;
  saveState();
  closeModal();
  render();
  haptic('light');
};

// ========== Add exercise modal ==========
window.openAddExercise = () => {
  let html = `<h3>Добавить упражнение</h3>`;
  for (const g of MUSCLE_GROUPS) {
    const list = exercisesForGroup(g.id);
    if (!list.length) continue;
    html += `<div class="pick-group-title">${g.emoji} ${g.name}</div>`;
    html += list.map(ex => `
      <div class="exercise-pick-item">
        <div>
          <div>${escapeHtml(ex.name)}</div>
          <div class="muted" style="font-size:12px">${escapeHtml(ex.hint || '')}</div>
        </div>
        <button onclick="addExerciseToWorkout('${g.id}','${ex.id}')">+</button>
      </div>
    `).join('');
  }
  html += `<div class="modal-actions">
    <button class="btn btn-secondary" onclick="closeModal()">Готово</button>
  </div>`;
  openModal(html);
};

window.addExerciseToWorkout = (groupId, exId) => {
  const ex = exercisesForGroup(groupId).find(e => e.id === exId);
  if (!ex) return;
  const w = state.activeWorkout;
  if (w.exercises.some(e => e.exerciseId === exId)) {
    toast('Упражнение уже добавлено');
    return;
  }
  w.exercises.push(makeExerciseEntry(ex, groupId));
  if (!w.muscleGroups.includes(groupId)) w.muscleGroups.push(groupId);
  saveState();
  render();
  toast(`${ex.name} добавлено`);
  haptic('light');
};

// ========== Muscle group picker (for empty workout) ==========
function openMuscleGroupPicker(onSave) {
  const selected = new Set();
  const chips = MUSCLE_GROUPS.map(g =>
    `<button class="chip-toggle" data-group="${g.id}" onclick="togglePickerChip(this)">${g.emoji} ${g.name}</button>`
  ).join('');
  openModal(`
    <h3>Какие группы тренируем?</h3>
    <div class="chips" style="margin-bottom:16px">${chips}</div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="__pickerSave()">Начать</button>
    </div>
  `);
  window.togglePickerChip = (btn) => {
    btn.classList.toggle('active');
    haptic('light');
  };
  window.__pickerSave = () => {
    const sel = [...document.querySelectorAll('.chip-toggle.active')].map(el => el.dataset.group);
    closeModal();
    onSave(sel);
  };
}

// ========== Settings actions ==========
window.updateRestSetting = (val) => {
  state.settings.restSeconds = Math.max(0, +val || 0);
  saveState();
  toast('Сохранено');
};

window.copyExport = async () => {
  const text = JSON.stringify(state);
  try {
    await navigator.clipboard.writeText(text);
    toast('Скопировано в буфер');
  } catch {
    const ta = document.getElementById('exportArea');
    ta.select();
    document.execCommand('copy');
    toast('Скопировано');
  }
};

window.importData = () => {
  const text = prompt('Вставьте JSON с данными для импорта:');
  if (!text) return;
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') throw new Error('bad');
    if (!confirm('Заменить текущие данные импортированными?')) return;
    const d = defaultState();
    state = { ...d, ...parsed, settings: { ...d.settings, ...(parsed.settings || {}) } };
    saveState();
    render();
    toast('Импорт выполнен');
  } catch {
    toast('Ошибка: некорректный JSON');
  }
};

window.resetAll = () => {
  if (!confirm('Удалить ВСЕ данные (история, план, тренировка)? Это необратимо.')) return;
  if (!confirm('Точно? Восстановить будет нельзя.')) return;
  state = defaultState();
  saveState();
  render();
  toast('Данные сброшены');
};

// ========== Modal ==========
window.openModal = (html) => {
  const root = document.getElementById('modalRoot');
  root.innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
    <div class="modal">${html}</div>
  </div>`;
};

window.closeModal = () => {
  document.getElementById('modalRoot').innerHTML = '';
};

// ========== Tab switching ==========
window.switchTab = (tab) => {
  currentTab = tab;
  haptic('light');
  render();
};

// ========== Init ==========
state = loadState();
render();

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTab = btn.dataset.tab;
    haptic('light');
    render();
  });
});
