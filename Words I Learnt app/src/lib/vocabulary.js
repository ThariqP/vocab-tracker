export const DAILY_LIMIT = 20;

const STORAGE_KEY = 'vocab-tracker-state-v1';

export function todayKey(date = new Date()) {
  const value = new Date(date);
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

export function loadStoredState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function definitionsFor(words, queue) {
  const fetched = {};
  words.forEach((entry) => {
    fetched[entry.word] = entry.definition;
  });
  const definitions = {};
  queue.forEach((word) => {
    definitions[word] = fetched[word] || '';
  });
  return definitions;
}

export function startSession(state, today = todayKey()) {
  return {
    ...state,
    lastPlayedDate: today,
    sessionDate: today,
    sessionWords: state.master.slice(0, DAILY_LIMIT),
    sessionIndex: 0,
    sessionKnown: 0,
  };
}

/**
 * Merges the freshly fetched list with whatever is stored locally.
 * Stored order (and progress) wins for words that still exist; words new to
 * the sheet are unseen, so they go to the front of the queue.
 */
export function createState(fetched, stored) {
  const today = todayKey();

  if (!stored || !Array.isArray(stored.master) || !stored.master.length) {
    const master = fetched.map((entry) => entry.word);
    return {
      master,
      definitions: definitionsFor(fetched, master),
      progress: {},
      lastPlayedDate: today,
      sessionDate: today,
      sessionWords: master.slice(0, DAILY_LIMIT),
      sessionIndex: 0,
      sessionKnown: 0,
    };
  }

  const available = new Set(fetched.map((entry) => entry.word));
  const storedWords = new Set(stored.master);
  const fresh = fetched
    .filter((entry) => !storedWords.has(entry.word))
    .map((entry) => entry.word);
  const master = [...fresh, ...stored.master.filter((word) => available.has(word))];

  const base = {
    ...stored,
    master,
    definitions: definitionsFor(fetched, master),
  };

  if (stored.sessionDate === today && Array.isArray(stored.sessionWords)) {
    const sessionWords = stored.sessionWords.filter((word) => available.has(word));
    return {
      ...base,
      sessionWords,
      sessionIndex: Math.min(stored.sessionIndex || 0, sessionWords.length),
      sessionKnown: stored.sessionKnown || 0,
    };
  }

  return startSession(base, today);
}

/**
 * Knew it → the word goes to the very back of the queue (it cycles back later).
 * Didn't know → the word goes to the front of the queue (seen again tomorrow).
 */
export function answerCard(state, knewIt) {
  const word = state.sessionWords[state.sessionIndex];
  if (!word) return state;

  const previous = state.progress[word] || { seen: 0, known: 0 };
  const progress = {
    ...state.progress,
    [word]: {
      seen: previous.seen + 1,
      known: previous.known + (knewIt ? 1 : 0),
      lastResult: knewIt ? 'knew-it' : 'didnt-know',
    },
  };

  const remaining = state.master.filter((item) => item !== word);
  const master = knewIt ? [...remaining, word] : [word, ...remaining];

  return {
    ...state,
    master,
    progress,
    sessionIndex: state.sessionIndex + 1,
    sessionKnown: (state.sessionKnown || 0) + (knewIt ? 1 : 0),
    lastPlayedDate: state.sessionDate,
  };
}