// src/utils/users.js
const KEY = 'pm-app-users';

export function loadUsers() {
  try {
    const raw = localStorage.getItem(KEY);
    // if nothing in storage return empty array
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // ensure it’s actually an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading users from localStorage', err);
    return [];
  }
}

export function saveUsers(users) {
  // only save if it’s an array
  if (Array.isArray(users)) {
    localStorage.setItem(KEY, JSON.stringify(users));
  } else {
    console.warn('saveUsers: expected an array, got', users);
  }
}
