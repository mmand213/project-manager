// src/utils/users.js

const KEY = 'pm-app-users';

// Return array of { id, name, email, passwordHash }
export function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Save array of users
export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}
