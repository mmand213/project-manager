// src/components/ProjectModal.jsx
import React, { useState } from 'react';
import TaskItem from './TaskItem';

export default function ProjectModal({ project, onSave, onCancel }) {
  const [title, setTitle] = useState(project.title);
  const [deadline, setDeadline] = useState(project.deadline);
  const [status, setStatus] = useState(project.status);
  const [tasks, setTasks] = useState(project.tasks);

  const addTask = () => {
    const text = prompt('New task:');
    if (text) setTasks([...tasks, { id: Date.now(), text, completed: false }]);
  };
  const toggleTask = (id) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) =>
    setTasks(tasks.filter(t => t.id !== id));

  const handleSubmit = () => onSave({ ...project, title, deadline, status, tasks });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="text-2xl mb-4">Edit Project</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <label className="block mb-1">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Tasks */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl">Tasks</h3>
            <button onClick={addTask} className="text-green-600">
              + Add
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {tasks.map(t => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={() => toggleTask(t.id)}
                onDelete={() => deleteTask(t.id)}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
