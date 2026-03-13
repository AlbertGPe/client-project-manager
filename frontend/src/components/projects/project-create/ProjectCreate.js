import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import clientService from "../../../services/clients";
import projectService from "../../../services/projects";
import "./ProjectCreate.css";

const STATE_LABELS = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
};
const ALL_STATES = ["pending", "active", "completed"];

function ProjectCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  const [ownershipStatus, setOwnershipStatus] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(
    searchParams.get("client") ?? "",
  );

  const [selectedState, setSelectedState] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [descLen, setDescLen] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const nameValue = watch("name", "");
  const descValue = watch("description", "");
  const currentDescLen = descValue?.length ?? 0;

  useEffect(() => {
    clientService
      .list()
      .then((data) => setClients(data))
      .catch((err) => console.error(err))
      .finally(() => setClientsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClientId) {
      setOwnershipStatus(null);
      return;
    }
    setOwnershipStatus("checking");
    clientService
      .getOne(selectedClientId)
      .then((client) => {
        const currentUserId = "69b0032837853eefcffdfd62"; // TODO: auth context
        const allowed = String(client.user) === currentUserId;
        setOwnershipStatus(allowed ? "allowed" : "forbidden");
      })
      .catch(() => setOwnershipStatus("forbidden"));
  }, [selectedClientId]);

  useEffect(() => {
    const preselected = searchParams.get("client");
    if (preselected) setSelectedClientId(preselected);
  }, []); // eslint-disable-line

  async function onSubmit(formData) {
    if (ownershipStatus !== "allowed") return;
    setSaving(true);
    setServerError(null);
    try {
      const payload = {
        ...formData,
        state: selectedState,
        client: selectedClientId,
      };
      const created = await projectService.create(payload);
      navigate(`/projects/${created.id}`);
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

  const formUnlocked = ownershipStatus === "allowed";
  const backTo = selectedClientId
    ? `/clients/${selectedClientId}`
    : "/projects";

  return (
    <div className="create-page">
      <Link to={backTo} className="detail-back">
        {selectedClientId ? "← Client" : "← Projects"}
      </Link>

      <header className="create-header">
        <div className={`create-project-icon ${formUnlocked ? "ready" : ""}`}>
          {formUnlocked ? "◉" : "+"}
        </div>
        <div>
          <p className="create-label">New project</p>
          <h1 className="create-title">
            {nameValue.trim() ? <em>{nameValue}</em> : "Project information"}
          </h1>
        </div>
      </header>

      <div className="create-body">
        <div className="detail-panel">
          <h2 className="detail-panel-title">Project details</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="edit-server-error">
                <span>⚠</span> {serverError}
              </div>
            )}

            <div className="edit-field-group">
              <label className="edit-field-label">Client *</label>
              <div className="client-select-wrapper">
                <select
                  className="client-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  disabled={clientsLoading}
                >
                  <option value="">
                    {clientsLoading ? "Loading clients…" : "Select a client…"}
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.company ? ` — ${c.company}` : ""}
                    </option>
                  ))}
                </select>
                <span className="client-select-arrow">▾</span>
              </div>

              {ownershipStatus === "checking" && (
                <div className="client-ownership-feedback checking">
                  ◌ Checking permissions…
                </div>
              )}
              {ownershipStatus === "allowed" && (
                <div className="client-ownership-feedback allowed">
                  ✓ You own this client — you can create a project
                </div>
              )}
              {ownershipStatus === "forbidden" && (
                <div className="client-ownership-feedback forbidden">
                  🔒 Only the creator of this client can add projects to it
                </div>
              )}
            </div>

            {formUnlocked && (
              <>
                <hr className="create-form-divider" />

                <div className="edit-field-group">
                  <label className="edit-field-label">Name *</label>
                  <div className="edit-underline-wrapper">
                    <input
                      className={`edit-input ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Project name"
                      autoFocus
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
                    className={`edit-char-counter ${currentDescLen > 950 ? "near-limit" : ""}`}
                  >
                    {currentDescLen} / 1000
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
                    <span className="edit-error">
                      {errors.delivery.message}
                    </span>
                  )}
                </div>

                <div className="create-form-actions">
                  <button
                    type="submit"
                    className="btn-create"
                    disabled={saving}
                  >
                    {saving ? "Creating…" : "✓ Create project"}
                  </button>
                  <Link to={backTo} className="btn-cancel">
                    Cancel
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>

        <div
          className="detail-sidebar"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {formUnlocked && (
            <div className="detail-panel">
              <h2 className="detail-panel-title">Initial status</h2>
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
            </div>
          )}

          <div className="detail-panel">
            <h2 className="detail-panel-title">Quick tips</h2>
            <div className="create-tip">
              <div className="create-tip-item">
                <span className="create-tip-icon">◈</span>
                <p className="create-tip-text">
                  <strong>Select a client first.</strong> You can only create
                  projects for clients you own.
                </p>
              </div>
              <div className="create-tip-item">
                <span className="create-tip-icon">◈</span>
                <p className="create-tip-text">
                  <strong>Name, start and delivery dates</strong> are required.
                  Description and status can always be updated later.
                </p>
              </div>
              <div className="create-tip-item">
                <span className="create-tip-icon">◈</span>
                <p className="create-tip-text">
                  <strong>Once created</strong> you'll land directly on the
                  project detail page where you can track its progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCreate;
