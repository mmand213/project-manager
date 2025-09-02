import React, { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal.jsx";
import AddAgentModal from "./AddAgentModal.jsx";
import { loadProjects, saveProjects } from "../utils/storage.js";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showAgentModal, setShowAgentModal] = useState(false);

  useEffect(() => {
    refreshProjects();
  }, []);

  const refreshProjects = () => {
    setProjects(loadProjects() || []);
  };

  const handleDelete = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all projects?")) {
      saveProjects([]); // clears everything
      setProjects([]);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "All") return true;
    return project.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            New Project
          </button>
          <button
            onClick={() => setShowAgentModal(true)}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
          >
            Add Agent
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "In Progress", "Completed", "Upcoming"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={handleClearAll}
          className="ml-auto text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
        >
          Clear All
        </button>
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h2>
            <p className="text-sm mb-1">
              <strong>Assigned to:</strong> {project.agent}
            </p>
            <p className="text-sm mb-1">
              <strong>Tasks:</strong>{" "}
              {project.tasks?.filter((t) => t.text?.trim() !== "").length || 0}/
              {project.tasks?.length || 0}
            </p>
            <p className="text-sm mb-4">
              <strong>Deadline:</strong> {project.deadline}
            </p>

            {/* Tasks under project */}
            {project.tasks && project.tasks.length > 0 && (
              <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
                {project.tasks.map((task, index) =>
                  task.text?.trim() !== "" ? (
                    <li key={task.id || index}>
                      {task.text} {task.done ? "✔" : ""}
                    </li>
                  ) : null
                )}
              </ul>
            )}

            <div className="flex gap-3 text-sm">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project modal */}
      {showModal && (
        <ProjectModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
            refreshProjects();
          }}
          editingProject={editingProject}
        />
      )}

      {/* Agent modal */}
      {showAgentModal && (
        <AddAgentModal
          isOpen={showAgentModal}
          onClose={() => setShowAgentModal(false)}
        />
      )}
    </div>
  );
}
