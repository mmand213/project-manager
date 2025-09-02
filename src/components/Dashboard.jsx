import React, { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal.jsx";   // ✅ correct filename
import AddAgentModal from "./AddAgentModal.jsx"; // ✅ added .jsx extension
import { getProjects, deleteProject, clearProjects } from "../utils/localStorage";

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
    setProjects(getProjects() || []);
  };

  const handleDelete = (id) => {
    deleteProject(id);
    refreshProjects();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all projects?")) {
      clearProjects();
      setProjects([]);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "All") return true;
    return project.status === filter
