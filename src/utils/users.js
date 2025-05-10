// src/utils/users.js
import { sha256 } from 'js-sha256'

const USERS_KEY = 'pm-users'

// one “Admin” user, ready to log in immediately
const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash: sha256('1234'),
  },
]

/**
 * Always returns an array of users. 
 * If none in storage, seed DEFAULT_USERS.
 */
export function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS
  }
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/**
 * Add a new user (called by your SignupModal).
 * Returns the updated list.
 */
export function saveUsers(newUser) {
  const existing = loadUsers()
  const updated  = [...existing, newUser]
  localStorage.setItem(USERS_KEY, JSON.stringify(updated))
  return updated
}
