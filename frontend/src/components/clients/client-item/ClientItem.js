import React from "react";
import { Link } from "react-router-dom";
import "./ClientItem.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Formats a MongoDB timestamp into a readable short date.
// "2024-03-15T10:30:00.000Z" → "Mar 2024"
function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function ClientCard({ client, index = 0 }) {
  const initials = getInitials(client.name);
  const joinDate = formatDate(client.createdAt);

  return (
    <Link
      to={`/clients/${client.id}`}
      className="client-card"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      <div className="client-card-top">
        <div className="client-card-avatar">{initials}</div>
        <div className="client-card-identity">
          <div className="client-card-name">{client.name}</div>
          {client.company && (
            <div className="client-card-company">{client.company}</div>
          )}
        </div>
        <span className="client-card-arrow">→</span>
      </div>

      <div className="client-card-details">
        {client.email && (
          <div className="client-card-detail">
            <span className="client-card-detail-icon">✉</span>
            {client.email}
          </div>
        )}
        {client.phone && (
          <div className="client-card-detail">
            <span className="client-card-detail-icon">◌</span>
            {client.phone}
          </div>
        )}
      </div>

      {client.notes && <p className="client-card-notes">"{client.notes}"</p>}

      <div className="client-card-footer">
        <span className="client-card-date">Since {joinDate}</span>
        {client.projects != null && (
          <span className="client-card-projects">
            ◉ {client.projects} {client.projects === 1 ? "project" : "projects"}
          </span>
        )}
      </div>
    </Link>
  );
}

export function ClientRow({ client, index = 0 }) {
  const initials = getInitials(client.name);

  return (
    <Link
      to={`/clients/${client.id}`}
      className="client-row"
      style={{ animationDelay: `${0.04 * index}s` }}
    >
      <div className="client-row-name-cell">
        <div className="client-row-avatar">{initials}</div>
        <span className="client-row-name">{client.name}</span>
      </div>

      <span className="client-row-cell">{client.email || "—"}</span>

      <span className="client-row-cell">{client.phone || "—"}</span>

      <span className="client-row-cell">{client.company || "—"}</span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
        }}
      >
        {client.projects != null && (
          <span className="client-row-projects">{client.projects}p</span>
        )}
        <span className="client-row-arrow">→</span>
      </div>
    </Link>
  );
}

function ClientItem({ client, view = "grid", index = 0 }) {
  if (view === "list") {
    return <ClientRow client={client} index={index} />;
  }
  return <ClientCard client={client} index={index} />;
}

export default ClientItem;
