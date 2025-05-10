// src/components/ProjectModal.jsx
import React, { useState } from 'react';
import TaskItem from './TaskItem';

export default function ProjectModal({ project, onSave, onCancel, users }) {
  const [title, setTitle]       = useState(project.title);
  const [agent, setAgent]       = useState(project.agent || '');
  const [deadline, setDeadline] = useState(project.deadline);
  const [status, setStatus]     = useState(project.status);
  const [tasks, setTasks]       = useState(project.tasks);
  const [newTaskText, setNewTaskText] = useState('');

  // Add a new task to state
  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    setNewTaskText('');
  };

  // Toggle a task’s completed flag
  const toggleTask = id =>
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

  // Remove a task
  const deleteTask = id =>
    setTasks(tasks.filter(t => t.id !== id));

  // Submit handler
  const handleSubmit = () => {
    onSave({ 
      ...project, 
      title, 
      agent, 
      deadline, 
      status, 
      tasks 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Agent Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Agent</label>
          <select
            className="w-full p-2 border rounded"
            value={agent}
            onChange={e => setAgent(e.target.value)}
          >
            <option value="">— Unassigned —</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Status</label>
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

        {/* Tasks List & Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Tasks</label>
          <div className="flex mb-2">
            <input
              type="text"
              placeholder="New task…"
              className="flex-1 p-2 border rounded mr-2"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add
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
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
