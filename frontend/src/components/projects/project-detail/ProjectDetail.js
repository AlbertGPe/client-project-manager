import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import projectService from "../../../services/projects";
import "./ProjectDetail.css";

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Formats a date as "YYYY-MM-DD" for <input type="date"> value
function toInputDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
}

function calcProgress(start, delivery, state) {
  if (state === "completed") return 100;
  if (!start || !delivery) return 0;
  const startDate = new Date(start).getTime();
  const deliveryDate = new Date(delivery).getTime();
  const now = Date.now();
  if (now <= startDate) return 0;
  if (now >= deliveryDate) return 99;
  return Math.round(((now - startDate) / (deliveryDate - startDate)) * 100);
}

function isOverdue(delivery, state) {
  if (state === "completed") return false;
  if (!delivery) return false;
  return Date.now() > new Date(delivery).getTime();
}

const STATE_ICONS = { pending: "◷", active: "◉", completed: "✓" };
const STATE_LABELS = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
};
const ALL_STATES = ["pending", "active", "completed"];

function ProjectDetail() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  const [selectedState, setSelectedState] = useState("pending");
  const [descLen, setDescLen] = useState(0);

  // Auth — replace with useAuth() hook once auth is wired up
  const currentUserId = null; // TODO: replace with auth user id

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const descValue = watch("description", "");
  useEffect(() => {
    setDescLen(descValue?.length ?? 0);
  }, [descValue]);

  useEffect(() => {
    projectService
      .getOne(id)
      .then((data) => {
        setProject(data);
        setSelectedState(data.state ?? "pending");
        reset({
          name: data.name ?? "",
          description: data.description ?? "",
          start: toInputDate(data.start),
          delivery: toInputDate(data.delivery),
        });
      })
      .catch((err) => {
        console.error(err);
        setFetchErr("Could not load project information.");
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  // Owner check — same pattern as ClientDetail
  const ownerId = project?.user?._id ?? project?.user ?? null;
  const isOwner =
    currentUserId && ownerId
      ? String(ownerId) === String(currentUserId)
      : false;

  function handleEditClick() {
    setServerError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    reset({
      name: project.name ?? "",
      description: project.description ?? "",
      start: toInputDate(project.start),
      delivery: toInputDate(project.delivery),
    });
    setSelectedState(project.state ?? "pending");
    setServerError(null);
    setIsEditing(false);
  }

  async function onSaveSubmit(formData) {
    setSaving(true);
    setServerError(null);
    try {
      const payload = { ...formData, state: selectedState };
      const updated = await projectService.update(id, payload);
      setProject(updated);
      setSelectedState(updated.state);
      setIsEditing(false);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        Object.keys(apiErrors).forEach((field) =>
          setError(field, { message: apiErrors[field] }),
        );
      } else {
        setServerError(
          error.message ?? "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-loading">
          <div className="detail-loading-icon">◉</div>
          <p>Loading project…</p>
        </div>
      </div>
    );
  }

  if (fetchErr || !project) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <div className="detail-error-icon">⚠</div>
          <p>{fetchErr ?? "Project not found."}</p>
          <Link to="/projects" className="detail-back">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const progress = calcProgress(project.start, project.delivery, project.state);
  const overdue = isOverdue(project.delivery, project.state);
  const clientName = project.client?.name ?? null;
  const clientId = project.client?.id ?? project.client ?? null;

  return (
    <div className="detail-page">
      <Link to="/projects" className="detail-back">
        ← Projects
      </Link>

      <header className="detail-header">
        <div className="detail-header-left">
          <div className={`detail-project-icon ${project.state}`}>
            {STATE_ICONS[project.state] ?? "◉"}
          </div>

          <div className="detail-title-block">
            <p className="detail-label">Project</p>
            <h1 className="detail-name">{project.name}</h1>
            <span className={`detail-state-badge ${project.state}`}>
              {STATE_LABELS[project.state] ?? project.state}
            </span>
          </div>
        </div>

        <div className="detail-actions">
          {!isEditing && isOwner && (
            <button className="btn-edit" onClick={handleEditClick}>
              <span>✎ Edit project</span>
            </button>
          )}

          {!isEditing && !isOwner && currentUserId && (
            <div className="ownership-notice">
              🔒 Only the creator can edit this project
            </div>
          )}

          {isEditing && (
            <>
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSubmit(onSaveSubmit)}
                disabled={saving}
              >
                <span>{saving ? "Saving…" : "✓ Save changes"}</span>
              </button>
            </>
          )}
        </div>
      </header>

      <div className="detail-body">
        <div className="detail-panel">
          <h2 className="detail-panel-title">
            {isEditing ? "Edit project" : "Project information"}
          </h2>

          {!isEditing && (
            <div className="detail-fields">
              <div className="detail-field">
                <span className="detail-field-label">Description</span>
                {project.description ? (
                  <span className="detail-field-value description">
                    {project.description}
                  </span>
                ) : (
                  <span className="detail-field-value empty">
                    No description provided
                  </span>
                )}
              </div>

              <div className="detail-field">
                <span className="detail-field-label">Client</span>
                {clientName && clientId ? (
                  <Link
                    to={`/clients/${clientId}`}
                    className="detail-client-link"
                  >
                    <span className="detail-client-link-icon">◈</span>
                    {clientName}
                    <span className="detail-client-link-arrow">→</span>
                  </Link>
                ) : (
                  <span className="detail-field-value empty">
                    No client linked
                  </span>
                )}
              </div>

              <div className="detail-field">
                <span className="detail-field-label">Timeline</span>
                <div className="detail-date-range">
                  <div className="detail-date-block">
                    <span className="detail-date-sub">Start</span>
                    <span className="detail-date-val">
                      {formatDate(project.start)}
                    </span>
                  </div>
                  <span className="detail-date-sep">→</span>
                  <div className="detail-date-block">
                    <span className="detail-date-sub">Delivery</span>
                    <span className="detail-date-val">
                      {formatDate(project.delivery)}
                    </span>
                  </div>
                </div>
                {overdue && (
                  <span
                    className="detail-overdue-badge"
                    style={{ marginTop: "0.6rem" }}
                  >
                    ⚠ Overdue
                  </span>
                )}
              </div>

              <div className="detail-progress-panel">
                <div className="detail-progress-header">
                  <span className="detail-progress-label">
                    Timeline progress
                  </span>
                  <span className="detail-progress-pct">{progress}%</span>
                </div>
                <div className="detail-progress-track">
                  <div
                    className={`detail-progress-fill ${project.state}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="detail-progress-dates">
                  <span>{formatDate(project.start)}</span>
                  <span>{formatDate(project.delivery)}</span>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleSubmit(onSaveSubmit)}>
              {serverError && (
                <div className="edit-server-error">
                  <span>⚠</span> {serverError}
                </div>
              )}

              <div className="edit-field-group">
                <label className="edit-field-label">Name *</label>
                <div className="edit-underline-wrapper">
                  <input
                    className={`edit-input ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Project name"
                    {...register("name", {
                      required: "Project name is required",
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                {errors.name && (
                  <span className="edit-error">{errors.name.message}</span>
                )}
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Description</label>
                <div className="edit-underline-wrapper">
                  <textarea
                    className={`edit-textarea ${errors.description ? "is-invalid" : ""}`}
                    placeholder="What is this project about?"
                    {...register("description", {
                      maxLength: {
                        value: 1000,
                        message: "Maximum 1000 characters",
                      },
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                <div
                  className={`edit-char-counter ${descLen > 950 ? "near-limit" : ""}`}
                >
                  {descLen} / 1000
                </div>
                {errors.description && (
                  <span className="edit-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Start date *</label>
                <div className="edit-underline-wrapper">
                  <input
                    type="date"
                    className={`edit-date-input ${errors.start ? "is-invalid" : ""}`}
                    {...register("start", {
                      required: "Start date is required",
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                {errors.start && (
                  <span className="edit-error">{errors.start.message}</span>
                )}
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Delivery date *</label>
                <div className="edit-underline-wrapper">
                  <input
                    type="date"
                    className={`edit-date-input ${errors.delivery ? "is-invalid" : ""}`}
                    {...register("delivery", {
                      required: "Delivery date is required",
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                {errors.delivery && (
                  <span className="edit-error">{errors.delivery.message}</span>
                )}
              </div>
            </form>
          )}

          <div className="detail-meta">
            ○ Created {formatDate(project.createdAt)}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="detail-panel">
            <h2 className="detail-panel-title">Status</h2>

            {!isEditing && (
              <div className="detail-fields">
                <div className="detail-field">
                  <span className="detail-field-label">Current state</span>
                  <span
                    className={`detail-state-badge ${project.state}`}
                    style={{ alignSelf: "flex-start", marginTop: "0.25rem" }}
                  >
                    {STATE_LABELS[project.state]}
                  </span>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="state-selector">
                {ALL_STATES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`state-option ${s} ${selectedState === s ? "selected" : ""}`}
                    onClick={() => setSelectedState(s)}
                  >
                    <span className="state-option-dot" />
                    {STATE_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(clientName || clientId) && (
            <div className="detail-panel">
              <h2 className="detail-panel-title">Client</h2>
              <div className="detail-fields">
                <div className="detail-field">
                  <span className="detail-field-label">Linked client</span>
                  {clientId ? (
                    <Link
                      to={`/clients/${clientId}`}
                      className="detail-client-link"
                    >
                      <span className="detail-client-link-icon">◈</span>
                      {clientName ?? "View client"}
                      <span className="detail-client-link-arrow">→</span>
                    </Link>
                  ) : (
                    <span className="detail-field-value">{clientName}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
