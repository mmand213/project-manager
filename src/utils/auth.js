// src/utils/auth.js
import { sha256 } from 'js-sha256';

const USERS_KEY      = 'pm-app-users';
const CURRENT_KEY    = 'pm-app-current';

export function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadCurrentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY)) || null; }
  catch { return null; }
}
export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

// helper to create a new user object
export function makeUser({ name, email, password }) {
  return {
    id: Date.now(),
    name,
    email,
    passwordHash: sha256(password),
    createdAt: new Date().toISOString(),
    role: 'agent',
  };
}

// verify login credentials
export function verifyLogin(email, password) {
  const users = loadUsers();
  const hash  = sha256(password);
  return users.find(u => u.email === email && u.passwordHash === hash) || null;
}
