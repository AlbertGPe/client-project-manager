# Client Project Manager – Fullstack CRM Application

A **fullstack CRM-style application** built with the **MERN stack** that allows users to manage clients and their associated projects in a structured way.

The platform includes **user authentication, email verification, project ownership permissions, and a dashboard with key metrics**, simulating a real internal tool used by companies to organize their work and client relationships.

This project focuses on demonstrating **fullstack architecture, REST API design, authentication, database relationships, and role-based data ownership.**

---

# Project Overview

Many small businesses manage clients and projects using spreadsheets or scattered tools.
This application centralizes that workflow into a single platform where users can:

* Register and verify their account via email
* Manage clients and their related projects
* Track project status
* View key business metrics in a dashboard

The application also includes **data ownership permissions**, ensuring that only the user who created a client can manage its projects.

---

# Tech Stack

## Frontend

* React
* JavaScript
* HTML
* CSS

## Backend

* Node.js
* Express

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JSON Web Tokens (JWT)
* Email account verification
* Protected routes with authentication middleware
* CORS configuration

---

# Key Features

## User Authentication

* User registration
* Email account confirmation
* Secure login
* JWT-based authentication
* Protected routes across the application

Users must be authenticated to access any page.
Unauthorized users attempting to access protected routes are redirected to the login page.

---

## Client Management

Users can:

* Create new clients
* View all clients stored in the database
* Access detailed information for each client
* Update client information
* Delete clients

Each client can have **multiple associated projects**.

---

## Project Management

Projects are linked to clients and include:

* Project creation
* Viewing all projects
* Detailed project pages
* Updating project information
* Deleting projects

Projects can have different statuses:

* Active
* Pending
* Completed

Projects can also be **sorted and filtered by status**.

---

## Ownership-Based Permissions

The application implements a **basic ownership system**:

* Any authenticated user can create a client.
* Only the **user who created the client** can:

  * Create projects for that client
  * Edit client information
  * Edit projects
  * Delete clients or projects

This simulates **real-world data ownership control in business applications**.

---

## Dashboard

The main page provides a dashboard with useful insights.

### Key Metrics (KPIs)

* Total clients
* Total projects
* Pending projects
* Active projects

### Additional Information

* Latest clients added to the database
* Top 5 clients with the most projects
* Current weekday
* Dynamic greeting message depending on the time of day:

  * Good morning
  * Good afternoon
  * Good evening

---

# What I Learned

This project helped me strengthen my fullstack development skills, including:

* Building a **complete MERN stack application**
* Designing and structuring a **RESTful API**
* Implementing **JWT authentication**
* Protecting routes using **authentication middleware**
* Designing **data relationships with MongoDB and Mongoose**
* Implementing **resource ownership permissions**
* Managing application state and routing in **React**
* Building dashboards with **data-driven metrics**
* Implementing **email confirmation flows**

---

# Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/AlbertGPe/client-project-manager.git
```

---

## 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

---

## 3. Environment variables

Create a `.env` file in the backend root with the following variables:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 4. Run the backend

```
cd backend
npm run dev
```

---

## 5. Run the frontend

```
cd frontend
npm start
```

---

# Screenshots / Demo

Suggested screenshots to include:

* Login page
  
<img width="1918" height="944" alt="Login" src="https://github.com/user-attachments/assets/0cfd4db5-d109-4498-81f7-02db2393097f" />


* Dashboard with KPIs
  
<img width="2796" height="1266" alt="Home" src="https://github.com/user-attachments/assets/fd400bce-0c2d-44b8-b2a3-5638b22ccd1e" />


* Clients list page

<img width="2396" height="1251" alt="Clients" src="https://github.com/user-attachments/assets/58f075c7-549a-4fa6-bc56-47bda8af4539" />

<img width="2396" height="1250" alt="Clients2" src="https://github.com/user-attachments/assets/e73c306d-c310-40ef-a45b-d8d6dacea83a" />


* Client detail page with projects

<img width="2813" height="1268" alt="ClientDetail" src="https://github.com/user-attachments/assets/6ac923d4-97d0-44fa-a8e9-4b8cc1c4e641" />


* Projects page with filters

<img width="2396" height="1245" alt="Projects" src="https://github.com/user-attachments/assets/91c8fe9c-8ec2-4955-96c2-9f6c6037707e" />

<img width="2627" height="1276" alt="Projects" src="https://github.com/user-attachments/assets/92906de3-67d5-4282-a115-fbbda07c67da" />


* Project detail page

<img width="2812" height="1262" alt="ProjectDetail" src="https://github.com/user-attachments/assets/f4b598f9-3d22-4f1a-8eb3-475d1b6ac6ef" />

* Edit page

<img width="2491" height="1271" alt="Modify" src="https://github.com/user-attachments/assets/59f67e85-8e6a-4a5d-b19c-887209cd8a2f" />

---

# Author

Albert Garcia Pedrosa
Fullstack Web Developer

GitHub:
https://github.com/AlbertGPe