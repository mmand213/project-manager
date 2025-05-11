// src/utils/users.js
import { sha256 } from "js-sha256";

// your “built-in” user list:
const DEFAULT_USERS = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    passwordHash: sha256("password123"),  // whatever your original password was
  },
  // …any other pre-created accounts
];

export function loadUsers() {
  const raw = localStorage.getItem("users");
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch {}
  }
  return DEFAULT_USERS;
}

export function saveUsers(newUser) {
  const existing = loadUsers();
  const updated = [...existing, newUser];
  localStorage.setItem("users", JSON.stringify(updated));
  return updated;
}
