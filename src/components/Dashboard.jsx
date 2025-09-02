
import React from 'react';

const Dashboard = ({ projects }) => {
  return (
    <div className="dashboard">
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div className="project-card" key={project.id}>
            <h3>{project.title}</h3>
            <p><strong>Assigned to:</strong> {project.agent}</p>
            <p>Tasks: {project.tasks?.length || 0}/{project.tasks?.length || 0}</p>
            <p><strong>Deadline:</strong> {project.deadline}</p>
            {project.tasks && project.tasks.length > 0 && (
              <ul className="task-list">
                {project.tasks.map((task, idx) => (
                  <li key={idx}>
                    <input type="checkbox" disabled checked={task.completed} />
                    {task.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="project-actions">
              <button>Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
