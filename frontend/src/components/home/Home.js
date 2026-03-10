import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import clientService from "../../services/clients";
import projectService from '../../services/projects'

// ── Mock data — replace with real API calls once backend is ready ──────────

const ACTIVITY = [
  {
    id: 1,
    dot: "green",
    text: (
      <>
        <strong>Marta Sánchez</strong> was added as a new client.
      </>
    ),
    time: "2 minutes ago",
  },
  {
    id: 2,
    dot: "gold",
    text: (
      <>
        Project <strong>Brand Redesign</strong> moved to{" "}
        <strong>In Review</strong>.
      </>
    ),
    time: "1 hour ago",
  },
  {
    id: 3,
    dot: "blue",
    text: (
      <>
        <strong>Tech Solutions SL</strong> updated their contact information.
      </>
    ),
    time: "3 hours ago",
  },
  {
    id: 4,
    dot: "orange",
    text: (
      <>
        Deadline approaching: <strong>API Integration</strong> is due in 2 days.
      </>
    ),
    time: "Yesterday, 18:40",
  },
  {
    id: 5,
    dot: "green",
    text: (
      <>
        Project <strong>Mobile App v2</strong> marked as{" "}
        <strong>Completed</strong>.
      </>
    ),
    time: "Yesterday, 11:15",
  },
];

const QUICK_ACTIONS = [
  { id: "new-client", label: "Add new client", icon: "◈", to: "/clients" },
  { id: "new-project", label: "Create project", icon: "◉", to: "/projects" },
];

const TOP_CLIENTS = [
  {
    id: 1,
    initials: "TS",
    name: "Tech Solutions SL",
    company: "Software & Consulting",
    status: "active",
    projects: 6,
  },
  {
    id: 2,
    initials: "AM",
    name: "Arkadia Media",
    company: "Creative Agency",
    status: "active",
    projects: 4,
  },
  {
    id: 3,
    initials: "NV",
    name: "Nova Ventures",
    company: "Investment Group",
    status: "pending",
    projects: 2,
  },
  {
    id: 4,
    initials: "PL",
    name: "Pulse Labs",
    company: "Biotech Startup",
    status: "active",
    projects: 5,
  },
  {
    id: 5,
    initials: "EG",
    name: "Evergreen Group",
    company: "Real Estate",
    status: "inactive",
    projects: 1,
  },
];

const now = new Date();
const DAY = now.getDate();
const MONTH = now.toLocaleString("en-GB", { month: "long" });
const YEAR = now.getFullYear();

function getGreeting() {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    clientService
      .list()
      .then((clients) => {
        setClients(clients);
      })
      .catch((error) => console.error(error));
    projectService
      .list()
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => console.error(error));
  }, []);

  let pending = 0;
  let completed = 0;
  projects.map((project) => {
    if (project.state === 'pending') {
      pending += 1;
    } else if (project.state === 'completed') {
      completed += 1;
    }
    return null
  })
  
  const KPI_DATA = [
    {
      id: "clients",
      title: "Total Clients",
      value: clients.length,
      icon: "◈",
      delta: "+3",
      deltaType: "up",
      deltaLabel: "this month",
      color: "gold",
    },
    {
      id: "projects",
      title: "Active Projects",
      value: projects.length,
      icon: "◉",
      delta: "+5",
      deltaType: "up",
      deltaLabel: "vs last month",
      color: "green",
    },
    {
      id: "pending",
      title: "Pending Projects",
      value: pending,
      icon: "◷",
      delta: "-2",
      deltaType: "down",
      deltaLabel: "since yesterday",
      color: "orange",
    },
    {
      id: "completed",
      title: "Completed Projects",
      value: completed,
      icon: "◈",
      delta: "-2",
      deltaType: "down",
      deltaLabel: "since yesterday",
      color: "orange",
    },
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <p className="home-greeting-label">{getGreeting()}</p>
          <h1 className="home-greeting-title">
            Here's your
            <br />
            <em>overview for today.</em>
          </h1>
        </div>
        <div className="home-date">
          <div className="home-date-day">{DAY}</div>
          <div className="home-date-month">
            {MONTH} · {YEAR}
          </div>
        </div>
      </header>

      <p className="section-label">At a glance</p>
      <div className="kpi-grid">
        {KPI_DATA.map((kpi) => (
          <div key={kpi.id} className={`kpi-card ${kpi.color}`}>
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <span className="kpi-icon">{kpi.icon}</span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-footer">
              <span className={`kpi-delta ${kpi.deltaType}`}>
                {kpi.deltaType === "up" ? "↑" : "↓"} {kpi.delta}
              </span>
              <span className="kpi-delta-label">{kpi.deltaLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="section-label">Workspace</p>
      <div className="home-grid">
        <div className="panel activity-panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent activity</h2>
            <button className="panel-action">View all</button>
          </div>
          <ul className="activity-list">
            {ACTIVITY.map((item) => (
              <li key={item.id} className="activity-item">
                <span className={`activity-dot ${item.dot}`} />
                <div className="activity-content">
                  <p className="activity-text">{item.text}</p>
                  <span className="activity-time">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel actions-panel">
          <div className="panel-header">
            <h2 className="panel-title">Quick actions</h2>
          </div>
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.id} to={action.to} className="action-btn">
              <span className="action-btn-icon">{action.icon}</span>
              <span className="action-btn-label">{action.label}</span>
              <span className="action-btn-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="section-label">Top clients</p>
      <div className="panel clients-panel" style={{ marginBottom: "2.5rem" }}>
        <div className="panel-header">
          <h2 className="panel-title">Client roster</h2>
          <Link to="/clients" className="panel-action">
            See all clients →
          </Link>
        </div>
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Status</th>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            {TOP_CLIENTS.map((client) => (
              <tr key={client.id}>
                <td>
                  <div className="client-cell">
                    <div className="client-avatar">{client.initials}</div>
                    <div>
                      <div className="client-name">{client.name}</div>
                      <div className="client-company">{client.company}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${client.status}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <span className="projects-count">{client.projects}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="quote-banner">
        <p className="quote-text">
          "The secret of getting ahead is getting started.
          <span>
            {" "}
            The secret of getting started is breaking your complex, overwhelming
            tasks into small manageable tasks.
          </span>
          "
        </p>
        <span className="quote-author">Mark Twain</span>
      </div>
    </div>
  );
}

export default HomePage;
