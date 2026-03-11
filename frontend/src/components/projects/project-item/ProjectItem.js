import React from "react";
import { Link } from "react-router-dom";
import "./ProjectItem.css";

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function calcProgress(start, delivery, state) {
  if (state === "completed") return 100;
  if (!start || !delivery) return 0;
  const startingDate = new Date(start).getTime();
  const deliveryDate = new Date(delivery).getTime();
  const now = Date.now();
  if (now <= startingDate) return 0;
  if (now >= deliveryDate) return 99;
  return Math.round(((now - startingDate) / (deliveryDate - startingDate)) * 100);
}

function StateBadge({ state }) {
  const labels = {
    pending: "Pending",
    active: "Active",
    completed: "Completed",
  };
  return (
    <span className={`state-badge ${state}`}>{labels[state] ?? state}</span>
  );
}

export function ProjectCard({ project, index = 0 }) {
  const progress = calcProgress(project.start, project.delivery, project.state);
  const clientName = project.client?.name ?? project.client ?? null;

  return (
    <Link
      to={`/projects/${project.id}`}
      className={`project-card ${project.state}`}
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      <div className="project-card-header">
        <span className="project-card-name">{project.name}</span>
        <StateBadge state={project.state} />
      </div>

      {project.description && (
        <p className="project-card-desc">{project.description}</p>
      )}

      {clientName && (
        <span className="project-card-client">
          <span className="project-card-client-icon">◈</span>
          {clientName}
        </span>
      )}

      <div className="project-card-dates">
        <div className="project-card-date-block">
          <span className="project-card-date-label">Start</span>
          <span className="project-card-date-value">
            {formatDateShort(project.start)}
          </span>
        </div>
        <span className="project-card-date-sep">→</span>
        <div className="project-card-date-block">
          <span className="project-card-date-label">Delivery</span>
          <span className="project-card-date-value">
            {formatDateShort(project.delivery)}
          </span>
        </div>
      </div>

      <div className="project-card-progress">
        <div className="project-card-progress-header">
          <span className="project-card-progress-label">Timeline progress</span>
          <span className="project-card-progress-pct">{progress}%</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${project.state}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="project-card-arrow">→</span>
    </Link>
  );
}

export function ProjectRow({ project, index = 0 }) {
  const clientName = project.client?.name ?? project.client ?? "—";

  return (
    <Link
      to={`/projects/${project.id}`}
      className={`project-row ${project.state}`}
      style={{ animationDelay: `${0.04 * index}s` }}
    >
      <span className="project-row-name">{project.name}</span>
      <span className="project-row-cell">{clientName}</span>
      <StateBadge state={project.state} />
      <span className="project-row-cell">{formatDate(project.start)}</span>
      <span className="project-row-cell">{formatDate(project.delivery)}</span>
      <span className="project-row-arrow">→</span>
    </Link>
  );
}

function ProjectItem({ project, view = "grid", index = 0 }) {
  if (view === "list") return <ProjectRow project={project} index={index} />;
  return <ProjectCard project={project} index={index} />;
}

export default ProjectItem;
