import React, { useContext, useEffect, useState, useMemo } from "react";
import clientService from "../../../services/clients";
import ClientItem from "../client-item/ClientItem";
import "./ClientsList.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthStore";

// Users visual feedback that content is loading
function SkeletonCards() {
  return (
    <div className="skeleton-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div
            style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div className="skeleton-line medium" />
              <div className="skeleton-line short" />
            </div>
          </div>
          <div className="skeleton-line long" />
          <div className="skeleton-line medium" />
          <div style={{ marginTop: "1rem" }}>
            <div className="skeleton-line full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientsList() {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id ?? null;

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [view, setView] = useState("grid");

  useEffect(() => {
    clientService
      .list()
      .then((data) => setClients(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // useMemo ensures not re-filter on every unrelated re-render.
  const filtered = useMemo(() => {
    let result = clients;

    if (onlyMine && currentUserId) {
      result = result.filter(
        (client) =>
          String(client.user) === currentUserId ||
          String(client.user?.id) === currentUserId,
      );
    }

    const searched = search.toLowerCase().trim();
    if (searched) {
      result = result.filter(
        (client) =>
          client.name?.toLowerCase().includes(searched) ||
          client.email?.toLowerCase().includes(searched) ||
          client.company?.toLowerCase().includes(searched),
      );
    }
    return result;
  }, [clients, search, onlyMine, currentUserId]);

  return (
    <div className="clients-page">
      <header className="clients-header">
        <div className="clients-header-left">
          <p className="clients-header-label">Management</p>
          <h1 className="clients-header-title">
            <em>Clients</em>
          </h1>
          {!loading && (
            <span className="clients-count-badge">
              ◈ {clients.length} {clients.length === 1 ? "client" : "clients"}
            </span>
          )}
        </div>
        <Link to="/clients/new" className="btn-new-client">
          <span className="btn-new-client-icon">+</span>
          <span>New client</span>
        </Link>
      </header>

      <div className="clients-toolbar">
        <div className="clients-search-wrapper">
          <span className="clients-search-icon">⌕</span>
          <input
            type="text"
            className="clients-search"
            placeholder="Search by name, email or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="clients-search-underline" />
        </div>

        <button
          className={`mine-filter-btn ${onlyMine ? "active-filter" : ""}`}
          onClick={() => setOnlyMine((v) => !v)}
          title="Show only your clients"
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

      {!loading && clients.length === 0 && (
        <div className="clients-empty">
          <div className="clients-empty-icon">◈</div>
          <h2 className="clients-empty-title">No clients yet</h2>
          <p className="clients-empty-sub">
            Add your first client to get started.
          </p>
        </div>
      )}

      {!loading && clients.length > 0 && filtered.length === 0 && (
        <div className="clients-empty">
          <div className="clients-empty-icon">⌕</div>
          <h2 className="clients-empty-title">No results for "{search}"</h2>
          <p className="clients-empty-sub">
            Try a different name, email or company.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && view === "grid" && (
        <div className="clients-grid">
          {filtered.map((client, i) => (
            <ClientItem key={client.id} client={client} view="grid" index={i} />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && view === "list" && (
        <div className="clients-list-view">
          <div className="clients-list-header">
            <span>Client</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Company</span>
            <span style={{ textAlign: "right" }}>Projects</span>
          </div>
          {filtered.map((client, i) => (
            <ClientItem key={client.id} client={client} view="list" index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientsList;
