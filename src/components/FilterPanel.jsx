// src/components/FilterPanel.jsx
import React from 'react';

const options = [
  { key: 'all', label: 'All' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'upcoming', label: 'Upcoming' },
];

export default function FilterPanel({ filter, onChange }) {
  return (
    <div className="space-x-2">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`px-3 py-1 rounded ${filter === o.key ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
