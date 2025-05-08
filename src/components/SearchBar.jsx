// src/components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search projects…"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="flex-1 p-2 border rounded"
    />
  );
}
