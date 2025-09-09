// src/components/Dashboard.jsx
import React from "react";

function prettyStatus(s = "") {
  const map = {
    "in-progress": "In Progress",
    completed: "Completed",
    upcoming: "Upcoming",
  };
  return map[s] || s;
}

export default function Dashboard({
  projects = [],
  filter = "all",          // 'all' | 'in-progress' | 'completed' | 'upcoming'
  search = "",             // string
  onEdit = () => {},       // (project) => void
  onDelete = () => {},     // (id) => void
}) {
  const q = search.trim().toLowerCase();

  const visible = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.agent?.toLowerCase().includes(q) ||
      p.tasks?.some((t) => t.text?.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {visible.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        visible.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h2>

            <p className="text-sm mb-1">
              <strong>Assigned to:</strong> {project.agent || "—"}
            </p>
            <p className="text-sm mb-1">
              <strong>Status:</strong> {prettyStatus(project.status)}
            </p>
            <p className="text-sm mb-1">
              <strong>Tasks:</strong>{" "}
              {project.tasks?.filter((t) => t.text?.trim()).length || 0}/
              {project.tasks?.length || 0}
            </p>
            <p className="text-sm mb-4">
              <strong>Deadline:</strong> {project.deadline || "—"}
            </p>

            {project.tasks?.length > 0 && (
              <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
                {project.tasks.map((t) =>
                  t.text?.trim() ? (
                    <li key={t.id}>
                      {t.text} {t.completed ? "✔" : ""}
                    </li>
                  ) : null
                )}
              </ul>
            )}

            <div className="flex gap-3 text-sm">
              <button
                onClick={() => onEdit(project)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
