import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import clientService from "../../../services/clients";
import projectService from "../../../services/projects";
import { AuthContext } from "../../../contexts/AuthStore";
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

  const [clientSearch, setClientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useContext(AuthContext);
  const currentUserId = user?.id ?? null;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const dropdownRef = useRef(null);

  const isOwnerOf = (client) =>
    String(client.user) === currentUserId ||
    String(client.user?.id) === currentUserId;

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q),
    );
  }, [clients, clientSearch]);

  const myClients = filteredClients.filter(isOwnerOf);
  const otherClients = filteredClients.filter((c) => !isOwnerOf(c));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClientSelect(client) {
    setSelectedClientId(client.id);
    setClientSearch(
      client.name + (client.company ? ` — ${client.company}` : ""),
    );
    setShowDropdown(false);
  }

  function handleClientInputChange(e) {
    setClientSearch(e.target.value);
    setSelectedClientId(""); // reset selection when typing
    setOwnershipStatus(null);
    setShowDropdown(true);
  }

  function handleClientInputFocus() {
    setShowDropdown(true);
  }

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
        const allowed = String(client.user) === currentUserId;
        setOwnershipStatus(allowed ? "allowed" : "forbidden");
      })
      .catch(() => setOwnershipStatus("forbidden"));
  }, [selectedClientId, currentUserId]);

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
              <div className="client-combobox" ref={dropdownRef}>
                <div className="client-select-wrapper">
                  <input
                    type="text"
                    className="client-search-input"
                    placeholder={
                      clientsLoading
                        ? "Loading clients…"
                        : "Search or select a client…"
                    }
                    value={clientSearch}
                    onChange={handleClientInputChange}
                    onFocus={handleClientInputFocus}
                    disabled={clientsLoading}
                    autoComplete="off"
                  />
                  <span className="client-select-arrow">
                    {showDropdown ? "▴" : "▾"}
                  </span>
                </div>

                {showDropdown && filteredClients.length > 0 && (
                  <div className="client-dropdown">
                    {myClients.length > 0 && (
                      <>
                        <div className="client-dropdown-group-label">
                          ◈ My clients
                        </div>
                        {myClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            className="client-dropdown-option mine"
                            onMouseDown={() => handleClientSelect(client)}
                          >
                            <span className="client-dropdown-mark">◈</span>
                            <span className="client-dropdown-name">
                              {client.name}
                            </span>
                            {client.company && (
                              <span className="client-dropdown-company">
                                {client.company}
                              </span>
                            )}
                          </button>
                        ))}
                      </>
                    )}
                    {otherClients.length > 0 && (
                      <>
                        <div className="client-dropdown-group-label">
                          Other clients
                        </div>
                        {otherClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            className="client-dropdown-option"
                            onMouseDown={() => handleClientSelect(client)}
                          >
                            <span className="client-dropdown-name">
                              {client.name}
                            </span>
                            {client.company && (
                              <span className="client-dropdown-company">
                                {client.company}
                              </span>
                            )}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {showDropdown &&
                  clientSearch &&
                  filteredClients.length === 0 && (
                    <div className="client-dropdown">
                      <div className="client-dropdown-empty">
                        No clients match "{clientSearch}"
                      </div>
                    </div>
                  )}
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
