import React from 'react'
import ProjectCard from './ProjectCard'

export default function Dashboard({ projects, filter, search, onEdit, onDelete }) {
  // apply status + search filters
  const filtered = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  if (filtered.length === 0) {
    return <p className="text-gray-500">No projects found.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map(p => (
        <ProjectCard
          key={p.id}
          project={p}
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p.id)}
        />
      ))}
    </div>
  )
}
