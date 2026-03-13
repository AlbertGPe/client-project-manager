import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import clientService from "../../services/clients";
import projectService from '../../services/projects'

const QUICK_ACTIONS = [
  { id: "new-client", label: "Add new client", icon: "◈", to: "/clients/new" },
  { id: "new-project", label: "Create project", icon: "◉", to: "/projects/new" },
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

function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getClientStatus(client) {
  const projectCount = client.projects || 0;

  if (projectCount === 0) return 'inactive';
  if (projectCount >= 2) return 'active';
  return 'pending';
}

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  
  //IF MORE THAN 1 WEEK
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

function HomePage() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    clientService
      .list()
      .then((clients) => {
        console.log('Clients received:', clients);
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
  let active = 0;
  projects.forEach((project) => {
    if (project.state === 'pending') {
      pending += 1;
    } else if (project.state === 'active') {
      active += 1;
    }
  })
  
  const topClients = clients.sort((a, b) => (b.projects || 0) - (a.projects || 0)).slice(0, 5);
  const recentClients = clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const KPI_DATA = [
    {
      id: "clients",
      title: "Total Clients",
      value: clients.length,
      icon: "◈",
      color: "gold",
    },
    {
      id: "projects",
      title: "Active Projects",
      value: projects.length,
      icon: "◉",
      color: "green",
    },
    {
      id: "pending",
      title: "Pending Projects",
      value: pending,
      icon: "◷",
      color: "orange",
    },
    {
      id: "active",
      title: "Active Projects",
      value: active,
      icon: "◈",
      color: "blue",
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
          </div>
        ))}
      </div>

      <p className="section-label">Workspace</p>
      <div className="home-grid">
        <div className="panel activity-panel">
          <div className="panel-header">
            <h2 className="panel-title">Latest new clients</h2>
          </div>
          <ul className="activity-list">
           {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <li key={client.id} className="activity-item">
                  <span className="activity-dot green" />
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{client.name}</strong> was added as a new client.
                    </p>
                    <span className="activity-time">
                      {getRelativeTime(client.createdAt)}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="activity-item">
                <span className="activity-dot blue" />
                <div className="activity-content">
                  <p className="activity-text">
                    No recent activity yet.
                  </p>
                </div>
              </li>
            )}
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
           {topClients.length > 0 ? (
              topClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-cell">
                      <div className="client-avatar">
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <div className="client-name">{client.name}</div>
                        <div className="client-company">
                          {client.company || 'No company'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getClientStatus(client)}`}>
                      {getClientStatus(client)}
                    </span>
                  </td>
                  <td>
                    <span className="projects-count">
                      {client.projects || 0}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                  No clients yet. Add your first client to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
