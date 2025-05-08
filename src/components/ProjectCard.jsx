import React from 'react';
import clsx from 'clsx';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const total = project.tasks.length;
  const done = project.tasks.filter((t) => t.completed).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <div
 className="
 bg-cardBg shadow-lg rounded-2xl p-6
 transform transition hover:-translate-y-1 hover:shadow-2xl"
 >
      <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
      <div className="h-2 bg-gray-200 rounded mb-2">
        <div
          className={clsx('h-full bg-blue-600 rounded')}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm mb-2">Tasks: {done}/{total}</p>
      <p className="text-sm mb-4">Deadline: {project.deadline || '—'}</p>
      <button onClick={() => onEdit(project)} className="text-blue-600 mr-2">
        Edit
      </button>
      <button onClick={() => onDelete(project.id)} className="text-red-600">
        Delete
      </button>
    </div>
  );
}
