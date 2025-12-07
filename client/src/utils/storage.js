export const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
  remove: (k) => { try { localStorage.removeItem(k) } catch {} }
}
