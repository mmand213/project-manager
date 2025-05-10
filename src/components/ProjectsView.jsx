// src/components/ProjectsView.jsx
import React from 'react';

export default function ProjectsView({ projects, onEdit, onDelete }) {
  return (
    <table className="min-w-full bg-white shadow-lg rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Title</th>
          <th className="px-4 py-2 text-left">Agent</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Deadline</th>
          <th className="px-4 py-2 text-left">Tasks</th>
          <th className="px-4 py-2">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(p => (
          <tr key={p.id} className="border-t">
            <td className="px-4 py-2">{p.title}</td>
            <td className="px-4 py-2">{p.agent || '—'}</td>
            <td className="px-4 py-2">{p.status}</td>
            <td className="px-4 py-2">{p.deadline || '—'}</td>
            <td className="px-4 py-2">
              {`${p.tasks.filter(t => t.completed).length}/${p.tasks.length}`}
            </td>
            <td className="px-4 py-2 space-x-2">
              <button onClick={() => onEdit(p)} className="text-blue-600 hover:underline">
                Edit
              </button>
              <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
