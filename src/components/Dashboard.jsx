import React, { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal.jsx";
import AddAgentModal from "./AddAgentModal.jsx";
import { loadProjects, saveProjects } from "../utils/storage.js";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);

  useEffect(() => {
    try {
      setProjects(loadProjects() || []);
    } catch (err) {
      console.error("Error loading projects:", err);
      setProjects([]);
    }
  }, []);

  const handleDelete = (id) => {
    try {
      const updated = projects.filter((p) => p.id !== id);
      saveProjects(updated);
      setProjects(updated);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found. Add one to get started!</p>
        ) : (
          projects.map((project) => (
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

              {/* Tasks */}
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
              // update existing
              updated = projects.map((p) =>
                p.id === newProject.id ? newProject : p
              );
            } else {
              // add new
              updated = [...projects, newProject];
            }
            saveProjects(updated);
            setProjects(updated); // ✅ refresh immediately
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
