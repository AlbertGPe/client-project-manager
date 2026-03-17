/**
 * FULL SEED SCRIPT FOR THE CUSTOMER AND PROJECT MANAGEMENT APPLICATION
 *
 * This script creates:
 * - 10 users (5 admins, 5 regular users)
 * - 25 clients (assigned to the users)
 * - 75 projects (each client has between 2 and 5 projects)
 */
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/client-project-manager";

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const User = require("../models/user.model");
const Client = require("../models/client.model");
const Project = require("../models/project.model");

const usersData = [
  // ADMINS
  {
    name: "Carlos Mendoza",
    username: "cmendoza",
    email: "carlos.mendoza@example.com",
    password: "Admin123",
    role: "admin",
  },
  {
    name: "Ana García",
    username: "agarcia",
    email: "ana.garcia@example.com",
    password: "Admin456",
    role: "admin",
  },
  {
    name: "Roberto Silva",
    username: "rsilva",
    email: "roberto.silva@example.com",
    password: "Admin789",
    role: "admin",
  },
  {
    name: "Laura Martínez",
    username: "lmartinez",
    email: "laura.martinez@example.com",
    password: "Admin321",
    role: "admin",
  },
  {
    name: "Javier Morales",
    username: "jmorales",
    email: "javier.morales@example.com",
    password: "Admin654",
    role: "admin",
  },
  // USERS
  {
    name: "María López",
    username: "mlopez",
    email: "maria.lopez@example.com",
    password: "User1234",
    role: "user",
  },
  {
    name: "Pedro Ramírez",
    username: "pramirez",
    email: "pedro.ramirez@example.com",
    password: "User5678",
    role: "user",
  },
  {
    name: "Carmen Ruiz",
    username: "cruiz",
    email: "carmen.ruiz@example.com",
    password: "User9012",
    role: "user",
  },
  {
    name: "Diego Torres",
    username: "dtorres",
    email: "diego.torres@example.com",
    password: "User3456",
    role: "user",
  },
  {
    name: "Patricia Vega",
    username: "pvega",
    email: "patricia.vega@example.com",
    password: "User7890",
    role: "user",
  },
];

const clientsData = [
  {
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone: "+34-912-345-001",
    company: "TechCorp Inc.",
    notes:
      "Cliente premium con altos requerimientos técnicos. Preferencia por desarrollo en React y Node.js.",
    userIndex: 0,
  },
  {
    name: "Digital Innovations",
    email: "info@digitalinno.com",
    phone: "+34-912-345-002",
    company: "Digital Innovations Ltd.",
    notes:
      "Startup de IA con presupuesto ajustado pero gran potencial de crecimiento futuro.",
    userIndex: 1,
  },
  {
    name: "Global Marketing Agency",
    email: "hello@globalmarketing.com",
    phone: "+34-912-345-003",
    company: "GMA Worldwide",
    notes:
      "Agencia creativa que necesita dashboards de analytics en tiempo real.",
    userIndex: 2,
  },
  {
    name: "HealthTech Partners",
    email: "info@healthtech.com",
    phone: "+34-912-345-004",
    company: "HealthTech Partners LLC",
    notes:
      "Sector salud. CRÍTICO: Cumplimiento estricto HIPAA y GDPR obligatorio.",
    userIndex: 0,
  },
  {
    name: "EduLearn Platform",
    email: "contact@edulearn.com",
    phone: "+34-912-345-005",
    company: "EduLearn Inc.",
    notes:
      "Plataforma educativa. Necesitan LMS personalizado con gamificación.",
    userIndex: 3,
  },
  {
    name: "FinanceHub Analytics",
    email: "info@financehub.com",
    phone: "+34-912-345-006",
    company: "FinanceHub Corp.",
    notes: "Fintech. Requieren seguridad máxima y uptime 99.9%. SLA estricto.",
    userIndex: 4,
  },
  {
    name: "RetailMax Systems",
    email: "contact@retailmax.com",
    phone: "+34-912-345-007",
    company: "RetailMax S.A.",
    notes:
      "Retail multicanal. Integración POS con e-commerce y gestión de inventario.",
    userIndex: 5,
  },
  {
    name: "CloudStorage Pro",
    email: "info@cloudpro.com",
    phone: "+34-912-345-008",
    company: "CloudStorage Pro LLC",
    notes:
      "Proveedor cloud. Dashboard administrativo para gestión de usuarios y storage.",
    userIndex: 1,
  },
  {
    name: "SmartHome Devices",
    email: "hello@smarthome.com",
    phone: "+34-912-345-009",
    company: "SmartHome GmbH",
    notes: "IoT y domótica. App mobile + backend para dispositivos conectados.",
    userIndex: 6,
  },
  {
    name: "FoodDelivery Express",
    email: "info@foodexpress.com",
    phone: "+34-912-345-010",
    company: "FoodDelivery Express Inc.",
    notes:
      "Delivery de comida. Sistema de tracking GPS en tiempo real crítico.",
    userIndex: 7,
  },
  {
    name: "AutoParts Marketplace",
    email: "contact@autoparts.com",
    phone: "+34-912-345-011",
    company: "AutoParts S.L.",
    notes: "Marketplace B2B de repuestos. Catálogo de 50K+ productos.",
    userIndex: 2,
  },
  {
    name: "TravelBooking Portal",
    email: "info@travelbooking.com",
    phone: "+34-912-345-012",
    company: "TravelBooking Ltd.",
    notes: "Portal de viajes. Integración con APIs de aerolíneas y hoteles.",
    userIndex: 8,
  },
  {
    name: "SocialMedia Analytics",
    email: "hello@socialmedia.com",
    phone: "+34-912-345-013",
    company: "SocialMedia Analytics Inc.",
    notes:
      "Análisis de redes sociales. Visualización de datos con gráficos interactivos.",
    userIndex: 3,
  },
  {
    name: "RealEstate Connect",
    email: "info@realestate.com",
    phone: "+34-912-345-014",
    company: "RealEstate Connect Corp.",
    notes:
      "Inmobiliaria. Tours virtuales 3D y VR. Proyecto ambicioso a largo plazo.",
    userIndex: 9,
  },
  {
    name: "FitnessTracker App",
    email: "contact@fitnesstracker.com",
    phone: "+34-912-345-015",
    company: "FitnessTracker S.L.",
    notes: "App fitness con gamificación. Integración con wearables.",
    userIndex: 4,
  },
  {
    name: "LegalTech Solutions",
    email: "info@legaltech.com",
    phone: "+34-912-345-016",
    company: "LegalTech Solutions",
    notes: "Software para bufetes de abogados. Gestión de casos y documentos.",
    userIndex: 0,
  },
  {
    name: "EcoEnergy Systems",
    email: "contact@ecoenergy.com",
    phone: "+34-912-345-017",
    company: "EcoEnergy Systems",
    notes: "Energías renovables. Monitoreo de paneles solares en tiempo real.",
    userIndex: 5,
  },
  {
    name: "Gaming Studios Plus",
    email: "hello@gamingstudios.com",
    phone: "+34-912-345-018",
    company: "Gaming Studios Plus",
    notes:
      "Desarrollo de juegos mobile. Backend para matchmaking y leaderboards.",
    userIndex: 1,
  },
  {
    name: "Fashion Retail Online",
    email: "info@fashionretail.com",
    phone: "+34-912-345-019",
    company: "Fashion Retail Online",
    notes: "E-commerce de moda. Personalización con IA y recomendaciones.",
    userIndex: 6,
  },
  {
    name: "Construction Management",
    email: "contact@constructmgmt.com",
    phone: "+34-912-345-020",
    company: "Construction Mgmt Co.",
    notes: "Gestión de obras. Tracking de proyectos y presupuestos.",
    userIndex: 2,
  },
  {
    name: "Pet Care Services",
    email: "info@petcare.com",
    phone: "+34-912-345-021",
    company: "Pet Care Services",
    notes:
      "App para cuidado de mascotas. Reservas de veterinarios y peluquerías.",
    userIndex: 7,
  },
  {
    name: "Music Streaming App",
    email: "hello@musicstream.com",
    phone: "+34-912-345-022",
    company: "Music Streaming Inc.",
    notes:
      "Plataforma de música. Streaming de alta calidad y playlists personalizadas.",
    userIndex: 3,
  },
  {
    name: "Restaurant Chain Manager",
    email: "info@restaurantchain.com",
    phone: "+34-912-345-023",
    company: "Restaurant Chain Inc.",
    notes:
      "Cadena de restaurantes. Sistema de gestión centralizado multi-local.",
    userIndex: 8,
  },
  {
    name: "Event Planning Pro",
    email: "contact@eventplanning.com",
    phone: "+34-912-345-024",
    company: "Event Planning Pro",
    notes:
      "Organización de eventos. CRM especializado para bodas y eventos corporativos.",
    userIndex: 4,
  },
  {
    name: "Logistics Transport Hub",
    email: "info@logisticshub.com",
    phone: "+34-912-345-025",
    company: "Logistics Transport",
    notes: "Transporte y logística. Optimización de rutas y gestión de flotas.",
    userIndex: 9,
  },
];

const projectTemplates = [
  {
    names: [
      "Corporate Website Redesign",
      "Landing Page Optimization",
      "Brand Portal Development",
      "Marketing Website v2",
      "Company Site Revamp",
    ],
    descriptions: [
      "Complete redesign of corporate website with modern UI/UX. Responsive design for all devices. Integration with CMS and SEO optimization.",
      "Development of high-converting landing page with A/B testing capabilities. Focus on mobile-first approach and fast loading times.",
      "Creation of brand portal for partners and distributors. Includes asset management and download center.",
    ],
  },
  {
    names: [
      "Mobile App Development",
      "iOS Application",
      "Android App Build",
      "Cross-platform App",
      "Native Mobile Solution",
    ],
    descriptions: [
      "Native mobile application with offline capabilities. Push notifications and real-time synchronization with backend.",
      "Cross-platform mobile app using React Native. Integration with device features like camera and GPS.",
      "iOS app with SwiftUI and modern architecture. Focus on smooth animations and excellent UX.",
    ],
  },
  {
    names: [
      "API Development",
      "Backend Integration",
      "Microservices Architecture",
      "RESTful API Build",
      "GraphQL Implementation",
    ],
    descriptions: [
      "Development of scalable REST API with authentication and rate limiting. Comprehensive documentation with Swagger.",
      "Microservices architecture implementation. Container orchestration with Docker and Kubernetes.",
      "GraphQL API development with real-time subscriptions. Optimized queries and efficient data loading.",
    ],
  },
  {
    names: [
      "Dashboard Development",
      "Analytics Platform",
      "Admin Panel Build",
      "Business Intelligence Tool",
      "Reporting System",
    ],
    descriptions: [
      "Interactive dashboard with real-time data visualization. Multiple chart types and custom filtering options.",
      "Business intelligence platform with advanced analytics. Export capabilities and scheduled reports.",
      "Admin panel with role-based access control. Comprehensive user management and audit logs.",
    ],
  },
  {
    names: [
      "E-commerce Platform",
      "Online Store Build",
      "Shopping Cart System",
      "Marketplace Development",
      "Payment Integration",
    ],
    descriptions: [
      "Full-featured e-commerce platform with product catalog, shopping cart, and secure checkout process.",
      "Marketplace with vendor management, commission tracking, and multi-payment gateway support.",
      "Online store with inventory management, order tracking, and customer relationship features.",
    ],
  },
  {
    names: [
      "CRM System",
      "Customer Management Tool",
      "Sales Pipeline Software",
      "Client Portal",
      "Support Ticketing System",
    ],
    descriptions: [
      "Custom CRM with lead management, email integration, and sales pipeline visualization.",
      "Client portal with ticketing system, knowledge base, and live chat support.",
      "Sales automation tool with email campaigns, contact management, and analytics.",
    ],
  },
  {
    names: [
      "Database Migration",
      "System Upgrade",
      "Infrastructure Modernization",
      "Cloud Migration",
      "Performance Optimization",
    ],
    descriptions: [
      "Migration from legacy database to modern cloud infrastructure. Zero-downtime deployment strategy.",
      "System upgrade with performance optimization and security enhancements. Comprehensive testing.",
      "Cloud migration to AWS/Azure with auto-scaling and disaster recovery implementation.",
    ],
  },
  {
    names: [
      "Security Audit",
      "Penetration Testing",
      "GDPR Compliance",
      "Security Hardening",
      "Vulnerability Assessment",
    ],
    descriptions: [
      "Comprehensive security audit with penetration testing. Detailed report with remediation recommendations.",
      "GDPR compliance implementation including data privacy controls and user consent management.",
      "Security hardening with encryption, authentication improvements, and security monitoring.",
    ],
  },
];

// Helper function for generating random dates
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

// Helper function to retrieve a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connection to MongoDB successful");

    console.log("\n🧹 Cleaning up existing collections...");
    await User.deleteMany({});
    await Client.deleteMany({});
    await Project.deleteMany({});
    console.log("✅ Cleared collections");

    // STEP 1: Create users
    console.log("\n👥 Creating 10 users...");
    const createdUsers = [];
    for (let i = 0; i < usersData.length; i++) {
      const user = new User(usersData[i]);
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(
        `   ✓ User ${i + 1}/10: ${savedUser.name} (${savedUser.role})`,
      );
    }
    console.log(`✅ ${createdUsers.length} users created`);

    // STEP 2: Create customers (linked to users)
    console.log("\n🏢 Creating 25 clients...");
    const createdClients = [];
    for (let i = 0; i < clientsData.length; i++) {
      const clientData = { ...clientsData[i] };
      clientData.user = createdUsers[clientData.userIndex]._id;
      delete clientData.userIndex;

      const client = new Client(clientData);
      const savedClient = await client.save();
      createdClients.push(savedClient);
      console.log(`   ✓ Client ${i + 1}/25: ${savedClient.name}`);
    }
    console.log(`✅ ${createdClients.length} customers created`);

    // STEP 3: Create projects (each client has between 2 and 5 projects)
    console.log("\n📊 Creating projects (2–5 per client)...");
    const createdProjects = [];
    let projectCounter = 0;

    for (let i = 0; i < createdClients.length; i++) {
      const client = createdClients[i];
      const numProjects = getRandomNumber(2, 5);

      console.log(`   Client: ${client.name} → ${numProjects} projects`);

      for (let j = 0; j < numProjects; j++) {
        projectCounter++;

        // Select a random template
        const template = getRandomElement(projectTemplates);
        const projectName = getRandomElement(template.names);
        const description = getRandomElement(template.descriptions);

        // Generate realistic dates
        const startDate = getRandomDate(
          new Date(2024, 0, 1),
          new Date(2024, 11, 31),
        );
        const deliveryDate = new Date(startDate);
        deliveryDate.setMonth(deliveryDate.getMonth() + getRandomNumber(1, 6)); // 1–6 months later

        // Determine status based on dates
        let state;
        const now = new Date();
        if (deliveryDate < now) {
          state = Math.random() > 0.3 ? "completed" : "active"; // 70% completed, 30% active if the deadline has passed
        } else if (startDate > now) {
          state = "pending";
        } else {
          state = "active";
        }

        const projectData = {
          name: `${projectName} - ${client.name.split(" ")[0]} ${j + 1}`,
          description: description,
          state: state,
          start: startDate,
          delivery: deliveryDate,
          client: client._id,
          user: client.user,
        };

        const project = new Project(projectData);
        const savedProject = await project.save();
        createdProjects.push(savedProject);
        console.log(
          `      ✓ Project ${projectCounter}: ${savedProject.name.substring(0, 40)}... (${savedProject.state})`,
        );
      }
    }
    console.log(`✅ ${createdProjects.length} projects created`);

    console.log("\n" + "=".repeat(70));
    console.log("🎉 DATABASE SUCCESSFULLY POPULATED");
    console.log("=".repeat(70));

    // User statistics
    const adminCount = createdUsers.filter((u) => u.role === "admin").length;
    const userCount = createdUsers.filter((u) => u.role === "user").length;

    // Project statistics
    const pendingProjects = createdProjects.filter(
      (p) => p.state === "pending",
    ).length;
    const activeProjects = createdProjects.filter(
      (p) => p.state === "active",
    ).length;
    const completedProjects = createdProjects.filter(
      (p) => p.state === "completed",
    ).length;

    console.log(`\n📊 SUMMARY:`);
    console.log(`   • Users created: ${createdUsers.length}`);
    console.log(`     - Admins: ${adminCount}`);
    console.log(`     - Users: ${userCount}`);
    console.log(`   • Clients created: ${createdClients.length}`);
    console.log(`   • Projects created: ${createdProjects.length}`);
    console.log(`     - Pending: ${pendingProjects}`);
    console.log(`     - Active: ${activeProjects}`);
    console.log(`     - Completed: ${completedProjects}`);

    console.log(`\n🔑 ACCESS CREDENTIALS:`);
    console.log(`   All users have passwords in the format:`);
    console.log(
      `   - Admins: Admin123, Admin456, Admin789, Admin321, Admin654`,
    );
    console.log(`   - Users: User1234, User5678, User9012, User3456, User7890`);
    console.log(`\n   Example of a login:`);
    console.log(`   - Username: cmendoza`);
    console.log(`   - Password: Admin123`);

    console.log("\n✨ ¡Ready to get started with your app!");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit();
  }
}

// Run the script
seedDatabase();
