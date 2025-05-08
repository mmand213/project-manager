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
  const toggleTask = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const handleSubmit = () => {
    onSave({ ...project, title, deadline, status, tasks });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="text-2xl mb-4">Edit Project</h2>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
