import React, { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal.jsx";
import AddAgentModal from "./AddAgentModal.jsx";
import { loadProjects, saveProjects } from "../utils/storage.js";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setProjects(loadProjects() || []);
  }, []);

  const handleDelete = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleClearAll = () => {
    saveProjects([]);
    setProjects([]);
  };

  // Filtering + searching
  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      filter === "All" || p.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.agent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Search + Filters + Clear */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          filteredProjects.map((project) => (
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

              {project.tasks && project.tasks.length > 0 && (
                <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
                  {project.tasks.map((task, index) =>
                    task.text?.trim() !== "" ? (
                      <li key={task.id || index}>
                        {task.text} {task.completed ? "✔" : ""}
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
          ))
        )}
      </div>

      {/* Project modal */}
      {showModal && (
        <ProjectModal
          project={
            editingProject || {
              id: Date.now(),
              title: "",
              agent: "",
              deadline: "",
              status: "upcoming",
              tasks: [],
            }
          }
          onSave={(newProject) => {
            let updated;
            if (projects.some((p) => p.id === newProject.id)) {
              updated = projects.map((p) =>
                p.id === newProject.id ? newProject : p
              );
            } else {
              updated = [...projects, newProject];
            }
            saveProjects(updated);
            setProjects(updated);
            setShowModal(false);
            setEditingProject(null);
          }}
          onCancel={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
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
