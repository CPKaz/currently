// Week: Monday 00:00:00 to Sunday 23:59:59 (local time)
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getWeekId(date = new Date()) {
  const monday = getMonday(date);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeekLabel(date = new Date()) {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const fmt = (x) => x.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const STORAGE_PREFIX = 'board_';

export function loadBoard(weekId) {
  try {
    const raw = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_PREFIX + weekId);
    if (!raw) return { todo: [], inProgress: [], done: [] };
    const data = JSON.parse(raw);
    return {
      todo: Array.isArray(data.todo) ? data.todo : [],
      inProgress: Array.isArray(data.inProgress) ? data.inProgress : [],
      done: Array.isArray(data.done) ? data.done : []
    };
  } catch {
    return { todo: [], inProgress: [], done: [] };
  }
}

export function saveBoard(weekId, board) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_PREFIX + weekId, JSON.stringify(board));
    }
  } catch (e) {
    console.warn('Could not save board', e);
  }
}

export function createTicket(title = '', description = '') {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: String(title).trim() || 'Untitled',
    description: String(description).trim()
  };
}
