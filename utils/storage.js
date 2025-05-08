export function loadProjects() {
  return JSON.parse(localStorage.getItem('projects') || '[]');
}
export function saveProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}
