import React from 'react';
import ProjectCard from './ProjectCard';

export default function Dashboard({ projects, filter, search, onEdit, onDelete }) {
  const filtered = projects.filter((p) => {
    if (filter === 'completed' && p.status !== 'completed') return false;
    if (filter === 'in-progress' && p.status !== 'in-progress') return false;
    if (filter === 'upcoming' && p.status !== 'upcoming') return false;
    return p.title.toLowerCase().includes(search.toLowerCase());
  });

  const stats = {
    all: projects.length,
    'in-progress': projects.filter((p) => p.status === 'in-progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    upcoming: projects.filter((p) => p.status === 'upcoming').length,
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">All Projects: {stats.all}</div>
        <div className="p-4 bg-white rounded shadow">In Progress: {stats['in-progress']}</div>
        <div className="p-4 bg-white rounded shadow">Completed: {stats.completed}</div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}
