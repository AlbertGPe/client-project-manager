import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import projectService from "../../../services/projects";
import ProjectItem from "../project-item/ProjectItem";
import { AuthContext } from "../../../contexts/AuthStore";
import "./ProjectsList.css";

const STATE_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

function SkeletonCards() {
  return (
    <div className="skeleton-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div className="skeleton-line medium" style={{ marginBottom: 0 }} />
            <div
              style={{
                width: 64,
                height: 20,
                borderRadius: 2,
                background: "rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}
            />
          </div>
          <div className="skeleton-line long" />
          <div className="skeleton-line short" />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <div
              className="skeleton-line medium"
              style={{ marginBottom: 0, flex: 1 }}
            />
            <div
              className="skeleton-line medium"
              style={{ marginBottom: 0, flex: 1 }}
            />
          </div>
          <div
            className="skeleton-line full"
            style={{ marginTop: "1.25rem" }}
          />
        </div>
      ))}
    </div>
  );
}

function ProjectsList() {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id ?? null;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const [view, setView] = useState("grid");

  useEffect(() => {
    projectService
      .list()
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = projects;

    if (onlyMine && currentUserId) {
      result = result.filter(
        (project) =>
          String(project.user) === currentUserId ||
          String(project.user?.id) === currentUserId,
      );
    }

    if (stateFilter !== "all") {
      result = result.filter((project) => project.state === stateFilter);
    }

    const searchValue = search.toLowerCase().trim();
    if (searchValue) {
      result = result.filter(
        (project) =>
          project.name?.toLowerCase().includes(searchValue) ||
          project.description?.toLowerCase().includes(searchValue) ||
          project.client?.name?.toLowerCase().includes(searchValue),
      );
    }

    return result;
  }, [projects, search, stateFilter, onlyMine, currentUserId]);

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <p className="projects-header-label">Management</p>
          <h1 className="projects-header-title">
            <em>Projects</em>
          </h1>
          {!loading && (
            <span className="projects-count-badge">
              ◉ {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>

        <Link to="/projects/new" className="btn-new-project">
          <span className="btn-new-project-icon">+</span>
          <span>New project</span>
        </Link>
      </header>

      <div className="projects-toolbar">
        <div className="projects-search-wrapper">
          <span className="projects-search-icon">⌕</span>
          <input
            type="text"
            className="projects-search"
            placeholder="Search by name, description or client…"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
          <span className="projects-search-underline" />
        </div>

        <div className="state-filters">
          {STATE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`state-filter-btn ${stateFilter === filter.value ? "active-filter" : ""}`}
              onClick={() => setStateFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

         <button
          className={`mine-filter-btn ${onlyMine ? "active-filter" : ""}`}
          onClick={() => setOnlyMine((v) => !v)}
          title="Show only your projects"
        >
          ◈ Mine
        </button>

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            className={`view-toggle-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {loading && <SkeletonCards />}

      {!loading && projects.length === 0 && (
        <div className="projects-empty">
          <div className="projects-empty-icon">◉</div>
          <h2 className="projects-empty-title">No projects yet</h2>
          <p className="projects-empty-sub">
            Create your first project to get started.
          </p>
        </div>
      )}

      {!loading && projects.length > 0 && filtered.length === 0 && (
        <div className="projects-empty">
          <div className="projects-empty-icon">⌕</div>
          <h2 className="projects-empty-title">No results found</h2>
          <p className="projects-empty-sub">
            {search
              ? `Nothing matched "${search}"${stateFilter !== "all" ? ` in ${stateFilter} projects` : ""}.`
              : `No ${stateFilter} projects yet.`}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && view === "grid" && (
        <div className="projects-grid">
          {filtered.map((project, i) => (
            <ProjectItem
              key={project.id}
              project={project}
              view="grid"
              index={i}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && view === "list" && (
        <div className="projects-list-view">
          <div className="projects-list-header">
            <span>Project</span>
            <span>Client</span>
            <span>State</span>
            <span>Start</span>
            <span>Delivery</span>
            <span></span>
          </div>
          {filtered.map((project, i) => (
            <ProjectItem
              key={project.id}
              project={project}
              view="list"
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsList;
