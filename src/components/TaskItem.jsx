// src/components/TaskItem.jsx
import React from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="mr-2"
      />
      <span className={task.completed ? 'line-through flex-1' : 'flex-1'}>
        {task.text}
      </span>
      <button onClick={onDelete} className="text-red-600 ml-2">
        ×
      </button>
    </div>
  );
}
