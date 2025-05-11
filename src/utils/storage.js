// src/utils/storage.js

// your “built-in” bootstrapped projects:
const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "NPS Migration",
    agent: "Manpreet",
    tasks: [{ id: 1, text: "Kickoff meeting", done: true }],
    status: "in-progress",
    deadline: "2025-10-07",
  },
  // …whatever else you had seeded originally
];

export function loadProjects() {
  const raw = localStorage.getItem("projects");
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch {}
  }
  // if nothing in localStorage, return the built-in list
  return DEFAULT_PROJECTS;
}

export function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}
