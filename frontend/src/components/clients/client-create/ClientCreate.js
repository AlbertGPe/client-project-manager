import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import clientService from "../../../services/clients";
import "./ClientCreate.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function ClientCreate() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [notesLen, setNotesLen] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const nameValue = watch("name", "");
  const notesValue = watch("notes", "");

  const currentNotesLen = notesValue?.length ?? 0;

  const initials = getInitials(nameValue);

  async function onSubmit(formData) {
    setSaving(true);
    setServerError(null);
    try {
      const created = await clientService.create(formData);
      navigate(`/clients/${created.id}`);
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

  return (
    <div className="create-page">
      <Link to="/clients" className="detail-back">
        ← Clients
      </Link>

      <header className="create-header">
        <div className={`create-avatar ${!initials ? "empty" : ""}`}>
          {initials || "+"}
        </div>
        <div>
          <p className="create-label">New client</p>
          <h1 className="create-title">
            {nameValue.trim() ? <em>{nameValue}</em> : "Client information"}
          </h1>
        </div>
      </header>

      <div className="create-body">
        <div className="detail-panel">
          <h2 className="detail-panel-title">Client details</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
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
                  autoFocus
                  {...register("name", { required: "Client name is required" })}
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
                className={`edit-char-counter ${currentNotesLen > 320 ? "near-limit" : ""}`}
              >
                {currentNotesLen} / 350
              </div>
              {errors.notes && (
                <span className="edit-error">{errors.notes.message}</span>
              )}
            </div>

            <div className="create-form-actions">
              <button type="submit" className="btn-create" disabled={saving}>
                {saving ? "Creating…" : "✓ Create client"}
              </button>
              <Link to="/clients" className="btn-cancel">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <div className="detail-panel">
          <h2 className="detail-panel-title">Quick tips</h2>
          <div className="create-tip">
            <div className="create-tip-item">
              <span className="create-tip-icon">◈</span>
              <p className="create-tip-text">
                <strong>Name is the only required field.</strong> You can always
                fill in the rest later from the client's detail page.
              </p>
            </div>
            <div className="create-tip-item">
              <span className="create-tip-icon">◈</span>
              <p className="create-tip-text">
                <strong>Once created</strong>, you'll be taken directly to the
                client's detail page where you can link projects to them.
              </p>
            </div>
            <div className="create-tip-item">
              <span className="create-tip-icon">◈</span>
              <p className="create-tip-text">
                <strong>Notes</strong> are a good place to store context — how
                you met, their preferences, or anything useful for the
                relationship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientCreate;
