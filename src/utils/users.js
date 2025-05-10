// src/utils/users.js
const KEY = 'pm-app-users';

export function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}
