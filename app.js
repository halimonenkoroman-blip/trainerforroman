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

const EQUIPMENT = [
  { id: 'barbell',    name: 'Штанга',    emoji: '🏋️' },
  { id: 'dumbbell',   name: 'Гантели',   emoji: '💪' },
  { id: 'machine',    name: 'Тренажёр',  emoji: '🎛️' },
  { id: 'cable',      name: 'Блок',      emoji: '🔗' },
  { id: 'bodyweight', name: 'Вес тела',  emoji: '🤸' },
  { id: 'cardio',     name: 'Кардио',    emoji: '🏃' },
];

const EXERCISES = {
  chest: [
    { id: 'bench_press', name: 'Жим штанги лёжа', hint: '4×8-10', equipment: 'barbell',
      description: 'Лёжа на скамье, лопатки сведены, стопы на полу. Опускай штангу к середине груди, локти под ~45°. Целевые: большая грудная, передняя дельта, трицепс. Ошибки: отрыв таза, разведение локтей в стороны.' },
    { id: 'dumbbell_press', name: 'Жим гантелей лёжа', hint: '4×10-12', equipment: 'dumbbell',
      description: 'Гантели у груди, ладони смотрят вперёд. Выжимай по дуге, сводя гантели в верхней точке. Больше амплитуды, чем со штангой — хорош для проработки грудных. Ошибки: слишком широкие локти, прогиб в пояснице.' },
    { id: 'incline_press', name: 'Жим в наклоне', hint: '3×10-12', equipment: 'barbell',
      description: 'Скамья под углом 30–45°. Акцент смещается на верхнюю часть груди. Опускай к ключицам, локти под 45° к корпусу. Ошибки: слишком крутой угол (работают плечи), отрыв таза.' },
    { id: 'dips_chest', name: 'Отжимания на брусьях', hint: '3×8-12', equipment: 'bodyweight',
      description: 'Наклон корпуса вперёд, локти разведены в стороны — акцент на грудь. Опускайся до параллели плеча с полом. Ошибки: вертикальный корпус (уходит в трицепс), слишком глубоко (риск для плеч).' },
    { id: 'cable_fly', name: 'Разводка на блоке', hint: '3×12-15', equipment: 'cable',
      description: 'Стоя между блоками, руки чуть согнуты. Своди рукояти по дуге перед собой, в конце сожми грудные. Изолирующее упражнение, лёгкий вес. Ошибки: полное разгибание рук, рывки.' },
    { id: 'pushups', name: 'Отжимания от пола', hint: '3×макс', equipment: 'bodyweight',
      description: 'Корпус — прямая линия, ладони чуть шире плеч. Опускайся, пока грудь почти не коснётся пола. Можно усложнить, положив ноги на возвышение. Ошибки: провал в пояснице, разведение локтей в стороны.' },
  ],
  back: [
    { id: 'deadlift', name: 'Становая тяга', hint: '4×5-6', equipment: 'barbell',
      description: 'Штанга над серединой стопы, хват чуть шире плеч. Спина прямая, таз отведён назад, тяни ногами и спиной одновременно. Целевые: разгибатели спины, ягодицы, бицепс бедра. Ошибки: круглая спина, отрыв штанги от тела.' },
    { id: 'pullups', name: 'Подтягивания', hint: '4×6-10', equipment: 'bodyweight',
      description: 'Хват чуть шире плеч, тянись грудью к перекладине, сводя лопатки. Опускайся подконтрольно. Если тяжело — используй резинку или гравитрон. Ошибки: раскачивание, неполная амплитуда.' },
    { id: 'barbell_row', name: 'Тяга штанги в наклоне', hint: '4×8-10', equipment: 'barbell',
      description: 'Наклон корпуса ~45°, спина прямая. Тяни штангу к низу живота, сводя лопатки. Локти идут вдоль корпуса. Ошибки: округление спины, рывки корпусом.' },
    { id: 'dumbbell_row', name: 'Тяга гантели', hint: '3×10-12', equipment: 'dumbbell',
      description: 'Опора на скамью одной рукой, спина параллельна полу. Тяни гантель к поясу, локоть прижат к корпусу. Хорошо изолирует широчайшие. Ошибки: разворот корпуса, тяга рукой.' },
    { id: 'lat_pulldown', name: 'Тяга верхнего блока', hint: '3×10-12', equipment: 'cable',
      description: 'Хват чуть шире плеч, тяни рукоять к верху груди, сводя лопатки. Альтернатива подтягиваниям для тех, кто пока не может много. Ошибки: тяга за голову (травмоопасно), раскачка.' },
    { id: 'seated_row', name: 'Тяга нижнего блока', hint: '3×10-12', equipment: 'cable',
      description: 'Сидя, ноги чуть согнуты, спина прямая. Тяни рукоять к низу живота, локти вдоль корпуса. Ошибки: наклон корпуса назад, сведение плеч вперёд.' },
  ],
  legs: [
    { id: 'squat', name: 'Приседания со штангой', hint: '4×6-8', equipment: 'barbell',
      description: 'Штанга на трапециях, стопы на ширине плеч, носки чуть развёрнуты. Садись до параллели бедра с полом, колени по направлению носков. Целевые: квадрицепс, ягодицы, бицепс бедра. Ошибки: завал коленей внутрь, отрыв пяток.' },
    { id: 'leg_press', name: 'Жим ногами', hint: '4×10-12', equipment: 'machine',
      description: 'Стопы на платформе на ширине плеч. Опускай платформу до угла ~90° в колене, не отрывая таз. Безопасная альтернатива приседаниям. Ошибки: полное разгибание коленей в верхней точке, отрыв таза.' },
    { id: 'lunges', name: 'Выпады', hint: '3×10/нога', equipment: 'dumbbell',
      description: 'Шаг вперёд, опускайся до касания коленом пола (почти). Корпус вертикально. Можно с гантелями в руках. Ошибки: завал колена внутрь, слишком короткий шаг.' },
    { id: 'romanian_dl', name: 'Румынская тяга', hint: '4×8-10', equipment: 'barbell',
      description: 'Стоя, штанга в руках. Отводи таз назад, опуская штангу по ногам, спина прямая. Чувствуй растяжение в бицепсе бедра. Ошибки: круглая спина, сгибание коленей как в приседе.' },
    { id: 'leg_curl', name: 'Сгибания ног', hint: '3×12', equipment: 'machine',
      description: 'Лёжа или сидя в тренажёре, сгибай ноги, подконтрольно возвращая. Изолирует бицепс бедра. Ошибки: рывки, отрыв таза.' },
    { id: 'calf_raise', name: 'Подъёмы на носки', hint: '4×15', equipment: 'machine',
      description: 'Стоя или сидя в тренажёре, поднимайся на носки максимально высоко, задержись на секунду. Работает икроножная и камбаловидная. Ошибки: маленькая амплитуда, пружинистые движения.' },
  ],
  shoulders: [
    { id: 'ohp', name: 'Жим штанги стоя', hint: '4×6-8', equipment: 'barbell',
      description: 'Стоя, штанга у плеч, хват чуть шире плеч. Выжимай вверх, чуть отводя голову назад. Корпус напряжён, пресс работает. Ошибки: прогиб в пояснице, слишком широкий хват.' },
    { id: 'db_shoulder_press', name: 'Жим гантелей сидя', hint: '3×10-12', equipment: 'dumbbell',
      description: 'Сидя на скамье со спинкой, гантели у плеч. Выжимай вверх по дуге, сводя в верхней точке. Больше амплитуды, чем со штангой. Ошибки: прогиб, разворот гантелей внутрь в верхней точке.' },
    { id: 'lateral_raise', name: 'Махи гантелями в стороны', hint: '4×12-15', equipment: 'dumbbell',
      description: 'Стоя, гантели по бокам. Поднимай руки в стороны до уровня плеч, локти чуть согнуты. Средняя дельта. Ошибки: раскачка корпусом, подъём выше плеч с разворотом.' },
    { id: 'rear_delt', name: 'Разведения в наклоне', hint: '3×12-15', equipment: 'dumbbell',
      description: 'Наклон корпуса до параллели с полом, гантели внизу. Разводи руки в стороны, сводя лопатки. Задняя дельта. Ошибки: сгибание локтей в тягу, раскачка.' },
    { id: 'face_pull', name: 'Тяга к лицу', hint: '3×12-15', equipment: 'cable',
      description: 'Блок на уровне лица, канат. Тяни к лицу, разводя руки в стороны и сводя лопатки. Задняя дельта и вращатели плеча. Ошибки: тяга к груди, слишком большой вес.' },
  ],
  biceps: [
    { id: 'barbell_curl', name: 'Подъём штанги на бицепс', hint: '3×8-10', equipment: 'barbell',
      description: 'Стоя, хват на ширине плеч. Сгибай руки, локти прижаты к корпусу. Опускай подконтрольно. Ошибки: раскачка корпусом, отведение локтей вперёд.' },
    { id: 'db_curl', name: 'Подъём гантелей', hint: '3×10-12', equipment: 'dumbbell',
      description: 'Стоя или сидя, гантели в опущенных руках. Сгибай попеременно, разворачивая кисть наружу. Больше амплитуды, чем со штангой. Ошибки: раскачка, отведение локтя вперёд.' },
    { id: 'hammer_curl', name: 'Молотки', hint: '3×10-12', equipment: 'dumbbell',
      description: 'Нейтральный хват (ладони смотрят друг на друга). Сгибай руки, не разворачивая кисти. Акцент на брахиалис, добавляет толщину руке. Ошибки: раскачка, слишком большой вес.' },
    { id: 'preacher_curl', name: 'Скамья Скотта', hint: '3×10-12', equipment: 'barbell',
      description: 'Руки лежат на наклонной скамье. Сгибай в локтях, полностью не разгибая в нижней точке (риск для сухожилий). Изолирует бицепс. Ошибки: полное разгибание внизу, рывки.' },
  ],
  triceps: [
    { id: 'dips_triceps', name: 'Брусья (трицепс)', hint: '3×8-12', equipment: 'bodyweight',
      description: 'Корпус вертикально, локти прижаты к корпусу. Опускайся до параллели плеча с полом. Акцент на трицепс. Ошибки: наклон вперёд (уходит в грудь), слишком глубоко.' },
    { id: 'french_press', name: 'Французский жим', hint: '3×10-12', equipment: 'barbell',
      description: 'Лёжа, штанга над головой. Сгибай руки, опуская снаряд ко лбу, локти неподвижны. Изолирует трицепс. Ошибки: разведение локтей, движение плечами.' },
    { id: 'pushdown', name: 'Разгибания на блоке', hint: '3×12-15', equipment: 'cable',
      description: 'Стоя у блока, локти прижаты к корпусу. Разгибай руки вниз, полностью сокращая трицепс. Ошибки: раскачка, отведение локтей.' },
    { id: 'close_bench', name: 'Жим узким хватом', hint: '3×8-10', equipment: 'barbell',
      description: 'Хват на ширине плеч, локти прижаты к корпусу. Опускай к низу груди, выжимай вверх. Трицепс + грудь. Ошибки: слишком узкий хват (риск для кистей), разведение локтей.' },
  ],
  abs: [
    { id: 'crunches', name: 'Скручивания', hint: '3×15-20', equipment: 'bodyweight',
      description: 'Лёжа на спине, ноги согнуты. Сокращая пресс, отрывай лопатки от пола. Поясница прижата. Ошибки: тяга руками за шею, инерция.' },
    { id: 'plank', name: 'Планка', hint: '3×60 сек', equipment: 'bodyweight',
      description: 'Упор на предплечья и носки. Корпус — прямая линия, пресс и ягодицы напряжены. Держи 30–60 секунд. Ошибки: провал в пояснице, поднятый таз.' },
    { id: 'leg_raise', name: 'Подъём ног', hint: '3×12-15', equipment: 'bodyweight',
      description: 'Лёжа или вися на перекладине. Поднимай прямые (или чуть согнутые) ноги до прямого угла. Поясница прижата. Ошибки: раскачка, отрыв поясницы.' },
    { id: 'russian_twist', name: 'Русские скручивания', hint: '3×20', equipment: 'bodyweight',
      description: 'Сидя, корпус отклонён назад, ноги на весу. Поворачивай корпус в стороны, касаясь пола рукой. Косые мышцы живота. Ошибки: округление спины, слишком быстрый темп.' },
  ],
  cardio: [
    { id: 'treadmill', name: 'Беговая дорожка', hint: '20-30 мин', equipment: 'cardio',
      description: 'Ходьба в горку или бег в комфортном темпе. 20–30 минут в зоне 2 (можно говорить). Хорошо для восстановления и жиросжигания.' },
    { id: 'bike', name: 'Велотренажёр', hint: '20-30 мин', equipment: 'cardio',
      description: 'Крути педали в среднем темпе, следи за осанкой. Нагрузка на колени мягче, чем при беге. 20–30 минут в зоне 2.' },
    { id: 'rower', name: 'Гребля', hint: '15-20 мин', equipment: 'cardio',
      description: 'Толчок ногами → наклон корпуса → тяга руками. Работает всё тело. Отличная интервальная тренировка. Ошибки: тяга только руками, круглая спина.' },
    { id: 'jump_rope', name: 'Скакалка', hint: '10-15 мин', equipment: 'cardio',
      description: 'Прыжки на носках, локти прижаты к корпусу. 30 сек / 30 сек отдыха или непрерывно 10 минут. Хорошо разогревает.' },
  ],
};

const DAY_SHORT = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const DAY_FULL  = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const DIFF_EMOJI = { easy: '🟢', medium: '🟡', hard: '🔴' };

// ========== State ==========
let state;
let currentTab = 'workout';

let exercisesFilter = {
  search: '',
  group: null,
  equipment: null,
  like: null,   // 'liked' | 'disliked' | null
  sort: 'group',// 'group' | 'alpha' | 'freq' | 'recent' | 'pr'
};

function defaultState() {
  return {
    schedule: { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] },
    activeWorkout: null,
    history: [],
    settings: { restSeconds: 90 },
    customExercises: {},  // { groupId: [ {id, name, hint, equipment, description, custom:true} ] }
    exerciseMeta: {},     // { exerciseId: { like: 1|-1|0, description: 'override' } }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    const d = defaultState();
    return {
      ...d, ...s,
      settings: { ...d.settings, ...(s.settings || {}) },
      customExercises: s.customExercises || {},
      exerciseMeta: s.exerciseMeta || {},
    };
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

function fmtRelativeDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((today - d) / 86400000);
  if (diff <= 0) return 'сегодня';
  if (diff === 1) return 'вчера';
  if (diff < 7) return `${diff} дн. назад`;
  if (diff < 30) return `${Math.floor(diff / 7)} нед. назад`;
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
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
const getEquip = id => EQUIPMENT.find(e => e.id === id);

const exercisesForGroup = id => [
  ...(EXERCISES[id] || []),
  ...(state.customExercises[id] || []),
];

const getAllExercises = () => {
  const list = [];
  for (const g of MUSCLE_GROUPS) {
    for (const ex of exercisesForGroup(g.id)) {
      list.push({ ...ex, groupId: g.id });
    }
  }
  return list;
};

const getExerciseById = (id) => {
  for (const g of MUSCLE_GROUPS) {
    const ex = exercisesForGroup(g.id).find(e => e.id === id);
    if (ex) return { ...ex, groupId: g.id };
  }
  return null;
};

const getExerciseMeta = (id) => state.exerciseMeta[id] || {};
const getExerciseLike = (id) => {
  const like = state.exerciseMeta[id]?.like;
  return like === 1 || like === -1 ? like : 0;
};
const getExerciseDescription = (ex) => {
  const override = state.exerciseMeta[ex.id]?.description;
  return override != null ? override : (ex.description || '');
};
const getExerciseEquipment = (ex) => ex.equipment || 'bodyweight';

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

function getExerciseStats(exerciseId) {
  const sessions = [];
  for (const w of state.history) {
    const ex = w.exercises.find(e => e.exerciseId === exerciseId);
    if (!ex) continue;
    const done = ex.sets.filter(s => s.done);
    if (!done.length) continue;
    const maxWeight = Math.max(...done.map(s => +s.weight || 0));
    const maxReps = Math.max(...done.map(s => +s.reps || 0));
    sessions.push({ date: w.date, maxWeight, maxReps });
  }
  if (!sessions.length) return { pr: 0, prReps: 0, lastDate: null, totalSessions: 0, sessions };
  return {
    pr: Math.max(...sessions.map(s => s.maxWeight)),
    prReps: Math.max(...sessions.map(s => s.maxReps)),
    lastDate: sessions[sessions.length - 1].date,
    totalSessions: sessions.length,
    sessions,
  };
}

function buildSparklineValues(stats) {
  if (stats.sessions.length < 2) return null;
  const useWeight = stats.pr > 0;
  return stats.sessions.slice(-10).map(s => useWeight ? s.maxWeight : s.maxReps);
}

function renderSparkline(values) {
  if (!values || values.length < 2) return '';
  const w = 200, h = 40, pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="sparkline" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

// ========== Render ==========
function render() {
  const view = document.getElementById('view');
  const titleEl = document.getElementById('title');
  const actionsEl = document.getElementById('headerActions');
  actionsEl.innerHTML = '';
  view.innerHTML = '';
  view.scrollTop = 0;

  const titles = {
    workout: 'Тренировка', schedule: 'План недели', history: 'История',
    exercises: 'Все упражнения', settings: 'Настройки',
  };
  titleEl.textContent = titles[currentTab] || 'Gym Tracker';

  if (currentTab === 'workout')      renderWorkout(view, actionsEl);
  else if (currentTab === 'schedule') renderSchedule(view, actionsEl);
  else if (currentTab === 'history')  renderHistory(view, actionsEl);
  else if (currentTab === 'exercises')renderExercises(view, actionsEl);
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
        return gr ? `<span class="chip">${gr.emoji} ${gr.name}</span>` : '';
      }).join('')}</div>
      <button class="btn btn-primary btn-block" onclick="startTodayWorkout()">Начать тренировку</button>`;
    } else {
      html += `<p class="muted">Мышцы на сегодня не запланированы. Отдохните или настройте план.</p>
      <button class="btn btn-secondary btn-block" onclick="switchTab('schedule')">Настроить план</button>
      <button class="btn btn-primary btn-block" onclick="startEmptyWorkout()">Тренировка без плана</button>`;
    }
    html += `</div>`;

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

  const totalSets = w.exercises.reduce((a,e) => a + e.sets.filter(s=>s.done).length, 0);
  const volume = w.exercises.reduce((a,e) =>
    a + e.sets.filter(s=>s.done).reduce((v,s) => v + (+s.weight||0)*(+s.reps||0), 0), 0);

  let html = `<div class="workout-summary" id="workoutSummary">${totalSets} подходов • ${volume} кг объём</div>`;
  html += `<div class="chips" style="margin-bottom:10px">${(w.muscleGroups||[]).map(g => {
    const gr = getGroup(g);
    return gr ? `<span class="chip">${gr.emoji} ${gr.name}</span>` : '';
  }).join('')}</div>`;

  w.exercises.forEach((ex, i) => { html += renderExerciseCard(ex, i); });

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
  const volume = w.exercises.reduce((a,e) =>
    a + e.sets.filter(s=>s.done).reduce((v,s) => v + (+s.weight||0)*(+s.reps||0), 0), 0);
  el.textContent = `${totalSets} подходов • ${volume} кг объём`;
}

// ========== Schedule tab ==========
function renderSchedule(view) {
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
    Нажмите на день, чтобы выбрать группы мышц. Приложение будет подбирать упражнения
    с учётом ваших лайков и дизлайков.
  </div>`;
  view.innerHTML = html;
}

// ========== History tab ==========
function renderHistory(view) {
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
    const volume = w.exercises.reduce((a,e) =>
      a + e.sets.filter(s=>s.done).reduce((v,s) => v + (+s.weight||0)*(+s.reps||0), 0), 0);

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

// ========== Exercises tab ==========
function renderExercises(view) {
  const wasSearchFocused = document.activeElement?.id === 'exSearch';
  const all = getAllExercises();
  const f = exercisesFilter;

  let filtered = all;
  if (f.search) {
    const q = f.search.toLowerCase();
    filtered = filtered.filter(ex => ex.name.toLowerCase().includes(q));
  }
  if (f.group)     filtered = filtered.filter(ex => ex.groupId === f.group);
  if (f.equipment) filtered = filtered.filter(ex => getExerciseEquipment(ex) === f.equipment);
  if (f.like === 'liked')    filtered = filtered.filter(ex => getExerciseLike(ex.id) === 1);
  if (f.like === 'disliked') filtered = filtered.filter(ex => getExerciseLike(ex.id) === -1);

  if (f.sort === 'alpha') {
    filtered.sort((a,b) => a.name.localeCompare(b.name, 'ru'));
  } else if (f.sort === 'freq') {
    filtered.sort((a,b) =>
      getExerciseStats(b.id).totalSessions - getExerciseStats(a.id).totalSessions);
  } else if (f.sort === 'recent') {
    filtered.sort((a,b) =>
      (getExerciseStats(b.id).lastDate || '').localeCompare(getExerciseStats(a.id).lastDate || ''));
  } else if (f.sort === 'pr') {
    filtered.sort((a,b) => getExerciseStats(b.id).pr - getExerciseStats(a.id).pr);
  }

  const totalLiked    = all.filter(ex => getExerciseLike(ex.id) === 1).length;
  const totalDisliked = all.filter(ex => getExerciseLike(ex.id) === -1).length;

  let html = `<div class="ex-counter">Всего: ${all.length} • 👍 ${totalLiked} • 👎 ${totalDisliked}</div>`;

  html += `<input type="text" class="ex-search" id="exSearch" placeholder="🔍 Поиск упражнения..."
    value="${escapeHtml(f.search)}"
    oninput="updateExFilter('search', this.value)">`;

  // Фильтр групп
  html += `<div class="filters-row">`;
  html += `<button class="filter-chip ${!f.group ? 'active' : ''}"
    onclick="updateExFilter('group', null)">Все группы</button>`;
  for (const g of MUSCLE_GROUPS) {
    html += `<button class="filter-chip ${f.group === g.id ? 'active' : ''}"
      onclick="updateExFilter('group', '${g.id}')">${g.emoji} ${g.name}</button>`;
  }
  html += `</div>`;

  // Фильтр инвентаря
  html += `<div class="filters-row">`;
  html += `<button class="filter-chip ${!f.equipment ? 'active' : ''}"
    onclick="updateExFilter('equipment', null)">Любой</button>`;
  for (const e of EQUIPMENT) {
    html += `<button class="filter-chip ${f.equipment === e.id ? 'active' : ''}"
      onclick="updateExFilter('equipment', '${e.id}')">${e.emoji} ${e.name}</button>`;
  }
  html += `</div>`;

  // Фильтр лайков
  html += `<div class="filters-row">`;
  html += `<button class="filter-chip ${f.like === 'liked' ? 'active' : ''}"
    onclick="updateExFilter('like', 'liked')">👍 Любимые</button>`;
  html += `<button class="filter-chip ${f.like === 'disliked' ? 'active' : ''}"
    onclick="updateExFilter('like', 'disliked')">👎 Скрытые</button>`;
  html += `</div>`;

  // Сортировка
  html += `<div class="filters-row">`;
  html += `<span class="filter-label">Сортировка:</span>`;
  const sortOpts = [
    ['group','По группам'],['alpha','А-Я'],['freq','По частоте'],
    ['recent','По дате'],['pr','По PR'],
  ];
  for (const [val, label] of sortOpts) {
    html += `<button class="filter-chip ${f.sort === val ? 'active' : ''}"
      onclick="updateExFilter('sort', '${val}')">${label}</button>`;
  }
  html += `</div>`;

  html += `<button class="btn btn-primary btn-block" onclick="openExerciseEditor()">+ Создать упражнение</button>`;

  if (!filtered.length) {
    html += `<div class="card" style="text-align:center;padding:30px 16px">
      <p class="muted">Ничего не найдено</p>
    </div>`;
  } else if (f.sort === 'group') {
    for (const g of MUSCLE_GROUPS) {
      const list = filtered.filter(ex => ex.groupId === g.id);
      if (!list.length) continue;
      html += `<div class="ex-group-title">${g.emoji} ${g.name}</div>`;
      html += list.map(renderExerciseCardLib).join('');
    }
  } else {
    html += filtered.map(renderExerciseCardLib).join('');
  }

  view.innerHTML = html;

  if (wasSearchFocused) {
    const inp = document.getElementById('exSearch');
    if (inp) {
      inp.focus();
      const len = inp.value.length;
      inp.setSelectionRange(len, len);
    }
  }
}

function renderExerciseCardLib(ex) {
  const like = getExerciseLike(ex.id);
  const stats = getExerciseStats(ex.id);
  const desc = getExerciseDescription(ex);
  const equip = getExerciseEquipment(ex);
  const eq = getEquip(equip);
  const isCustom = ex.custom === true;

  let statsLine;
  if (stats.totalSessions === 0) {
    statsLine = '<span class="muted">Нет истории</span>';
  } else {
    const useWeight = stats.pr > 0;
    const prStr = useWeight ? `🏆 ${stats.pr} кг` : `🏆 ${stats.prReps} повт.`;
    statsLine = `${prStr} • последний: ${fmtRelativeDate(stats.lastDate)} • всего: ${stats.totalSessions}`;
  }

  const sparkVals = buildSparklineValues(stats);
  const spark = sparkVals ? renderSparkline(sparkVals) : '';

  const addBtn = state.activeWorkout
    ? `<button class="btn-xs btn-xs-primary" onclick="addToActiveWorkout('${ex.id}')">+ В тренировку</button>`
    : '';

  const deleteBtn = isCustom
    ? `<button class="btn-xs btn-xs-danger" onclick="deleteCustomExercise('${ex.id}')">🗑</button>`
    : '';

  return `<div class="exercise-card-lib">
    <div class="ex-header">
      <div class="ex-title-block">
        <div class="ex-name">${escapeHtml(ex.name)}</div>
        <div class="ex-hint">${escapeHtml(ex.hint || '')}${eq ? ' • ' + eq.emoji + ' ' + eq.name : ''}</div>
      </div>
      <div class="ex-like-block">
        <button class="ex-like-btn ${like === 1 ? 'active' : ''}"
          onclick="cycleLike('${ex.id}', 1)" title="Любимое">👍</button>
        <button class="ex-like-btn ${like === -1 ? 'active' : ''}"
          onclick="cycleLike('${ex.id}', -1)" title="Скрыть из автоподбора">👎</button>
      </div>
    </div>
    ${desc ? `<div class="ex-desc">${escapeHtml(desc)}</div>` : ''}
    <div class="ex-stats">${statsLine}</div>
    ${spark}
    <div class="ex-actions">
      ${addBtn}
      <button class="btn-xs" onclick="openExerciseEditor('${ex.id}')">✏️</button>
      ${deleteBtn}
    </div>
  </div>`;
}

window.updateExFilter = (key, value) => {
  if (key === 'like' && exercisesFilter.like === value) {
    exercisesFilter.like = null;
  } else if ((key === 'group' || key === 'equipment') && value === null) {
    exercisesFilter[key] = null;
  } else {
    exercisesFilter[key] = value;
  }
  render();
};

window.cycleLike = (exerciseId, direction) => {
  const current = getExerciseLike(exerciseId);
  const next = current === direction ? 0 : direction;
  if (!state.exerciseMeta[exerciseId]) state.exerciseMeta[exerciseId] = {};
  state.exerciseMeta[exerciseId].like = next;
  saveState();
  haptic('light');
  render();
};

window.addToActiveWorkout = (exerciseId) => {
  if (!state.activeWorkout) { toast('Сначала начните тренировку'); return; }
  const ex = getExerciseById(exerciseId);
  if (!ex) return;
  const w = state.activeWorkout;
  if (w.exercises.some(e => e.exerciseId === exerciseId)) {
    toast('Упражнение уже добавлено'); return;
  }
  w.exercises.push(makeExerciseEntry(ex, ex.groupId));
  if (!w.muscleGroups.includes(ex.groupId)) w.muscleGroups.push(ex.groupId);
  saveState();
  toast(`${ex.name} добавлено`);
  haptic('light');
};

// ========== Exercise editor ==========
window.openExerciseEditor = (exerciseId = null) => {
  const isNew = !exerciseId;
  const ex = isNew ? null : getExerciseById(exerciseId);
  if (!isNew && !ex) return;
  const isCustom = ex ? ex.custom === true : false;
  const canEditAll = isNew || isCustom;

  const currentName  = ex ? ex.name : '';
  const currentHint  = ex ? (ex.hint || '') : '';
  const currentEquip = ex ? getExerciseEquipment(ex) : 'barbell';
  const currentGroup = ex ? ex.groupId : MUSCLE_GROUPS[0].id;
  const currentDesc  = ex ? getExerciseDescription(ex) : '';

  const groupOptions = MUSCLE_GROUPS.map(g =>
    `<option value="${g.id}" ${g.id === currentGroup ? 'selected' : ''}>${g.emoji} ${g.name}</option>`
  ).join('');

  const equipOptions = EQUIPMENT.map(e =>
    `<option value="${e.id}" ${e.id === currentEquip ? 'selected' : ''}>${e.emoji} ${e.name}</option>`
  ).join('');

  let html = `<h3>${isNew ? 'Новое упражнение' : (isCustom ? 'Редактировать упражнение' : 'Описание упражнения')}</h3>`;

  if (canEditAll) {
    html += `
      <label class="form-label">Название
        <input type="text" id="exName" class="form-input" value="${escapeHtml(currentName)}">
      </label>
      <label class="form-label">Группа мышц
        <select id="exGroup" class="form-input">${groupOptions}</select>
      </label>
      <label class="form-label">Инвентарь
        <select id="exEquip" class="form-input">${equipOptions}</select>
      </label>
      <label class="form-label">Схема (например, 4×8-10)
        <input type="text" id="exHint" class="form-input" value="${escapeHtml(currentHint)}">
      </label>
    `;
  } else {
    html += `<div class="muted" style="margin-bottom:8px">${escapeHtml(ex.name)}</div>`;
  }

  html += `
    <label class="form-label">Описание
      <textarea id="exDesc" class="form-input" rows="5">${escapeHtml(currentDesc)}</textarea>
    </label>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="saveExercise(${isNew ? 'null' : `'${exerciseId}'`})">Сохранить</button>
    </div>
  `;
  openModal(html);
};

window.saveExercise = (exerciseId) => {
  const isNew = !exerciseId;
  const isCustom = !isNew && getExerciseById(exerciseId)?.custom === true;
  const desc = document.getElementById('exDesc').value.trim();

  // Встроенное — только описание
  if (!isNew && !isCustom) {
    if (!state.exerciseMeta[exerciseId]) state.exerciseMeta[exerciseId] = {};
    state.exerciseMeta[exerciseId].description = desc;
    saveState();
    closeModal();
    render();
    toast('Описание сохранено');
    return;
  }

  const name = (document.getElementById('exName')?.value || '').trim();
  if (!name) { toast('Введите название'); return; }
  const groupId   = document.getElementById('exGroup').value;
  const equipment = document.getElementById('exEquip').value;
  const hint      = document.getElementById('exHint').value.trim();

  if (isNew) {
    const id = 'custom_' + Date.now();
    if (!state.customExercises[groupId]) state.customExercises[groupId] = [];
    state.customExercises[groupId].push({
      id, name, hint, equipment, description: desc, custom: true,
    });
    saveState();
    closeModal();
    render();
    toast('Упражнение создано');
    return;
  }

  // Редактирование своего
  let oldGroup = null;
  for (const g of MUSCLE_GROUPS) {
    if ((state.customExercises[g.id] || []).some(e => e.id === exerciseId)) {
      oldGroup = g.id; break;
    }
  }
  if (!oldGroup) { toast('Не найдено'); return; }

  state.customExercises[oldGroup] =
    state.customExercises[oldGroup].filter(e => e.id !== exerciseId);
  if (!state.customExercises[groupId]) state.customExercises[groupId] = [];
  state.customExercises[groupId].push({
    id: exerciseId, name, hint, equipment, description: desc, custom: true,
  });
  saveState();
  closeModal();
  render();
  toast('Сохранено');
};

window.deleteCustomExercise = (exerciseId) => {
  if (!confirm('Удалить это упражнение? Оно пропадёт из библиотеки и из истории упоминаний.')) return;
  for (const g of MUSCLE_GROUPS) {
    const arr = state.customExercises[g.id] || [];
    if (arr.some(e => e.id === exerciseId)) {
      state.customExercises[g.id] = arr.filter(e => e.id !== exerciseId);
      delete state.exerciseMeta[exerciseId];
      saveState();
      render();
      toast('Удалено');
      return;
    }
  }
};

// ========== Settings tab ==========
function renderSettings(view) {
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
    <div class="muted" style="font-size:12px">Gym Tracker v2 • данные хранятся локально</div>
  </div>`;
  view.innerHTML = html;
}

// ========== Workout actions ==========
function pickExercisesForGroups(groups, perGroup = 3) {
  const result = [];
  const seen = new Set();
  for (const g of groups) {
    const pool = exercisesForGroup(g).filter(ex => {
      if (seen.has(ex.id)) return false;
      return getExerciseLike(ex.id) !== -1;
    });
    pool.sort((a, b) => {
      const la = getExerciseLike(a.id) === 1 ? 1 : 0;
      const lb = getExerciseLike(b.id) === 1 ? 1 : 0;
      return lb - la;
    });
    const picked = pool.slice(0, perGroup);
    for (const ex of picked) {
      seen.add(ex.id);
      result.push({ ex, groupId: g });
    }
  }
  return result;
}

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
  const picks = pickExercisesForGroups(groups, 3);
  if (!picks.length) {
    toast('Все упражнения этих групп скрыты. Снимите дизлайки в «Упражнениях».');
    return;
  }
  state.activeWorkout = {
    startedAt: Date.now(),
    date: todayKey(),
    muscleGroups: [...groups],
    exercises: picks.map(({ ex, groupId }) => makeExerciseEntry(ex, groupId)),
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

// ========== Add exercise to workout (modal) ==========
window.openAddExercise = () => {
  let html = `<h3>Добавить упражнение</h3>`;
  for (const g of MUSCLE_GROUPS) {
    const list = exercisesForGroup(g.id);
    if (!list.length) continue;
    html += `<div class="pick-group-title">${g.emoji} ${g.name}</div>`;
    html += list.map(ex => {
      const like = getExerciseLike(ex.id);
      const badge = like === 1 ? ' 👍' : like === -1 ? ' 👎' : '';
      return `
      <div class="exercise-pick-item">
        <div>
          <div>${escapeHtml(ex.name)}${badge}</div>
          <div class="muted" style="font-size:12px">${escapeHtml(ex.hint || '')}</div>
        </div>
        <button onclick="addExerciseToWorkout('${g.id}','${ex.id}')">+</button>
      </div>`;
    }).join('');
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
  if (!w) return;
  if (w.exercises.some(e => e.exerciseId === exId)) {
    toast('Упражнение уже добавлено'); return;
  }
  w.exercises.push(makeExerciseEntry(ex, groupId));
  if (!w.muscleGroups.includes(groupId)) w.muscleGroups.push(groupId);
  saveState();
  render();
  toast(`${ex.name} добавлено`);
  haptic('light');
};

// ========== Muscle group picker (empty workout) ==========
function openMuscleGroupPicker(onSave) {
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
    state = {
      ...d, ...parsed,
      settings: { ...d.settings, ...(parsed.settings || {}) },
      customExercises: parsed.customExercises || {},
      exerciseMeta: parsed.exerciseMeta || {},
    };
    saveState();
    render();
    toast('Импорт выполнен');
  } catch {
    toast('Ошибка: некорректный JSON');
  }
};

window.resetAll = () => {
  if (!confirm('Удалить ВСЕ данные (история, план, тренировка, лайки, свои упражнения)? Это необратимо.')) return;
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
