import React from 'react'
import clsx from 'clsx'

export default function ProjectCard({ project, onEdit, onDelete }) {
  const { title, agent, tasks, status, deadline } = project
  const completedCount = tasks.filter(t => t.completed).length
  const totalCount     = tasks.length
  const progressPct    = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // pick a bar color by status
  const barColor = {
    upcoming:    'bg-gray-300',
    'in-progress': 'bg-blue-500',
    completed:   'bg-green-500',
  }[status] || 'bg-gray-300'

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-1">{title}</h3>

      {/* Assigned Agent */}
      <p className="text-sm text-gray-600 mb-3">
        <strong>Assigned to:</strong> {agent || <span className="text-gray-400">Unassigned</span>}
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={clsx(barColor, 'h-full')}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Stats */}
      <p className="text-sm mb-1">
        Tasks: {completedCount}/{totalCount}
      </p>
      <p className="text-sm mb-4">
        Deadline: {deadline || '—'}
      </p>

      {/* Actions */}
      <div className="mt-auto flex space-x-4">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
