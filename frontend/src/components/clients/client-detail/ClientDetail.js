import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import clientService from "../../../services/clients";
import projectService from "../../../services/projects";
import { AuthContext } from "../../../contexts/AuthStore";
import "./ClientDetail.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const STATE_DOT = {
  pending: "pending",
  active: "active",
  completed: "completed",
};

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [notesLen, setNotesLen] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auth: get the current user
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id ?? null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // Notes length for the character counter
  const notesValue = watch("notes", "");

  useEffect(() => {
    setNotesLen(notesValue?.length ?? 0);
  }, [notesValue]);

  useEffect(() => {
    Promise.all([
      clientService.getOne(id), 
      projectService.listByClient(id)
    ])
      .then(([clientData, projectsData]) => {
        setClient(clientData);
        setProjects(projectsData);
        reset({
          name: clientData.name ?? "",
          email: clientData.email ?? "",
          phone: clientData.phone ?? "",
          company: clientData.company ?? "",
          notes: clientData.notes ?? "",
        });
      })
      .catch((err) => {
        console.error(err);
        setFetchErr("Could not load client information.");
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const ownerId = client?.user?._id ?? client?.user ?? null;
  const isOwner =
    currentUserId && ownerId
      ? String(ownerId) === String(currentUserId)
      : false;

    async function handleDelete() {
    setDeleting(true);
    try {
      await clientService.delete(id);
      navigate("/clients");
    } catch (error) {
      setServerError(error.message ?? "Could not delete the client.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  function handleEditClick() {
    setServerError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    // Reset form to last saved values so no stale input lingers
    reset({
      name: client.name ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
      company: client.company ?? "",
      notes: client.notes ?? "",
    });
    setServerError(null);
    setIsEditing(false);
  }

  async function onSaveSubmit(formData) {
    setSaving(true);
    setServerError(null);
    try {
      const updated = await clientService.update(id, formData);
      setClient(updated);
      setIsEditing(false);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        // Map backend field errors back to react-hook-form
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
          <div className="detail-loading-icon">◈</div>
          <p>Loading client…</p>
        </div>
      </div>
    );
  }

  if (fetchErr || !client) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <div className="detail-error-icon">⚠</div>
          <p>{fetchErr ?? "Client not found."}</p>
          <Link to="/clients" className="detail-back">
            ← Back to clients
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitials(client.name);

  return (
    <div className="detail-page">
      <Link to="/clients" className="detail-back">
        ← Clients
      </Link>

      <header className="detail-header">
        <div className="detail-header-left">
          <div className="detail-avatar">{initials}</div>
          <div className="detail-title-block">
            <p className="detail-label">Client</p>
            <h1 className="detail-name">{client.name}</h1>
            {client.company && (
              <p className="detail-company">{client.company}</p>
            )}
          </div>
        </div>

        <div className="detail-actions">
          {!isEditing && isOwner && (
            <button className="btn-edit" onClick={handleEditClick}>
              <span>✎ Edit client</span>
            </button>
          )}

          {!isEditing && !isOwner && currentUserId && (
            <div className="ownership-notice">
              🔒 Only the creator can edit this client
            </div>
          )}

          {isEditing && (
            <>
              <button
                className="btn-delete"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving || deleting}
              >
                <span>✕ Delete</span>
              </button>
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

      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">✕</div>
            <h3 className="delete-modal-title">Delete client?</h3>
            <p className="delete-modal-body">
              <strong>{client.name}</strong> and all associated data will be
              permanently deleted. This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                className="btn-delete-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="detail-body">
        <div className="detail-panel">
          <h2 className="detail-panel-title">
            {isEditing ? "Edit information" : "Client information"}
          </h2>

          {!isEditing && (
            <div className="detail-fields">
              <div className="detail-field">
                <span className="detail-field-label">Email</span>
                <span
                  className={`detail-field-value ${!client.email ? "empty" : ""}`}
                >
                  {client.email || "No email provided"}
                </span>
              </div>

              <div className="detail-field">
                <span className="detail-field-label">Phone</span>
                <span
                  className={`detail-field-value ${!client.phone ? "empty" : ""}`}
                >
                  {client.phone || "No phone provided"}
                </span>
              </div>

              <div className="detail-field">
                <span className="detail-field-label">Company</span>
                <span
                  className={`detail-field-value ${!client.company ? "empty" : ""}`}
                >
                  {client.company || "No company provided"}
                </span>
              </div>

              <div className="detail-field">
                <span className="detail-field-label">Notes</span>
                {client.notes ? (
                  <span className="detail-field-value notes">
                    "{client.notes}"
                  </span>
                ) : (
                  <span className="detail-field-value empty">No notes</span>
                )}
              </div>

              <div className="detail-field">
                <span className="detail-field-label">Client since</span>
                <span className="detail-date-badge">
                  📅 {formatDate(client.createdAt)}
                </span>
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
                    placeholder="Client full name"
                    {...register("name", {
                      required: "Client name is required",
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                {errors.name && (
                  <span className="edit-error">{errors.name.message}</span>
                )}
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Email</label>
                <div className="edit-underline-wrapper">
                  <input
                    className={`edit-input ${errors.email ? "is-invalid" : ""}`}
                    placeholder="client@company.com"
                    {...register("email", {
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                {errors.email && (
                  <span className="edit-error">{errors.email.message}</span>
                )}
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Phone</label>
                <div className="edit-underline-wrapper">
                  <input
                    className={`edit-input ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="+34 600 000 000"
                    {...register("phone", {
                      pattern: {
                        value: /^[+\d\s\-()]{6,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                {errors.phone && (
                  <span className="edit-error">{errors.phone.message}</span>
                )}
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Company</label>
                <div className="edit-underline-wrapper">
                  <input
                    className="edit-input"
                    placeholder="Company name"
                    {...register("company")}
                  />
                  <span className="edit-underline" />
                </div>
              </div>

              <div className="edit-field-group">
                <label className="edit-field-label">Notes</label>
                <div className="edit-underline-wrapper">
                  <textarea
                    className={`edit-textarea ${errors.notes ? "is-invalid" : ""}`}
                    placeholder="Any relevant notes about this client…"
                    {...register("notes", {
                      maxLength: {
                        value: 350,
                        message: "You can't write more than 350 characters",
                      },
                    })}
                  />
                  <span className="edit-underline" />
                </div>
                <div
                  className={`edit-char-counter ${notesLen > 320 ? "near-limit" : ""}`}
                >
                  {notesLen} / 350
                </div>
                {errors.notes && (
                  <span className="edit-error">{errors.notes.message}</span>
                )}
              </div>
            </form>
          )}

          {!isEditing && (
            <div className="detail-meta">
              ○ Created {formatDate(client.createdAt)}
            </div>
          )}
        </div>

        <div className="detail-panel">
          <div className="detail-panel-title-row">
            <h2
              className="detail-panel-title"
              style={{ margin: 0, padding: 0, border: "none" }}
            >
              Projects
            </h2>
            {projects.length > 0 && (
              <span className="detail-projects-count">{projects.length}</span>
            )}
            {isEditing && (
              <Link
                to={`/projects/new?client=${id}`}
                className="btn-new-project-inline"
              >
                + New project
              </Link>
            )}
          </div>
          {projects.length === 0 ? (
            <p className="detail-projects-empty">
              No projects linked to this client yet.
            </p>
          ) : (
            <div className="detail-projects-list">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="detail-project-item"
                >
                  <div className="detail-project-left">
                    <span
                      className={`detail-project-dot ${STATE_DOT[project.state] ?? "pending"}`}
                    />
                    <span className="detail-project-name">{project.name}</span>
                  </div>
                  <span className="detail-project-arrow">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;
