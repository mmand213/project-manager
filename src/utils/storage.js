// src/utils/storage.js

const PROJECTS_KEY = 'pm-projects'

// an initial set of shared demo projects
const DEMO_PROJECTS = [
  {
    id: 1,
    title: 'NPS Migration',
    agent: 'Admin',
    tasks: [{ id: 1, text: 'Plan rollout', done: true }],
    status: 'completed',
    deadline: '2025-10-07',
  },
  {
    id: 2,
    title: 'UI Redesign',
    agent: null,
    tasks: [
      { id: 1, text: 'Wireframes', done: false },
      { id: 2, text: 'Prototype', done: false },
    ],
    status: 'in-progress',
    deadline: '2025-05-22',
  },
]

export function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY)
  if (!raw) {
    // first‐time: seed the demo
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(DEMO_PROJECTS))
    return DEMO_PROJECTS
  }
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}
