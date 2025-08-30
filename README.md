# 🌱 HydroGrid - Green Hydrogen Infrastructure Mapping & Optimization Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.8-blue)](https://python.org/)
[![React Version](https://img.shields.io/badge/react-%5E19.1.1-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-%5E7.1.2-646CFF)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/express-%5E5.1.0-000000)](https://expressjs.com/)

> **Accelerating the green hydrogen revolution through intelligent infrastructure planning and optimization**

HydroGrid is a comprehensive full-stack platform empowering **energy companies, governments, and stakeholders** to strategically plan, optimize, and scale green hydrogen infrastructure. The platform combines an interactive **React-based dashboard** with a **Node.js/Express backend** and a **Python-powered optimization engine** for data-driven decision-making in hydrogen facility placement, storage optimization, and pipeline routing.

---

## 🎯 Problem Statement & Solution

### **The Challenge**
The global transition to clean energy requires strategic planning of hydrogen infrastructure, presenting complex challenges:

- **🗺️ Geographic Complexity**: Mapping and visualizing hydrogen production plants, storage facilities, and pipeline networks across vast geographical areas
- **⚡ Optimization Challenges**: Determining optimal placement of new facilities considering cost efficiency, demand patterns, and environmental factors  
- **📊 Data-Driven Decisions**: Providing stakeholders with interactive tools to simulate scenarios and analyze infrastructure outcomes
- **🔄 System Integration**: Managing interconnected infrastructure components for maximum operational efficiency
- **📈 Future Planning**: Scalable solutions for expanding infrastructure based on demand growth predictions

### **Our Solution**
HydroGrid addresses these challenges through:
- **Interactive Geospatial Mapping** with real-time facility visualization
- **Advanced Python Optimization Algorithms** for facility placement and route planning
- **Comprehensive Analytics Dashboard** with performance metrics and scenario modeling
- **Role-Based Management System** for collaborative project planning
- **Scalable Architecture** supporting growth from regional to global deployments

---

## ✨ Key Features & Capabilities

### 🌍 **Interactive Infrastructure Mapping**
- **Real-time Geospatial Visualization**: Interactive maps powered by React Leaflet displaying hydrogen infrastructure
- **Multi-Layer Controls**: Toggle between production plants, storage facilities, and pipeline networks
- **Facility Status Monitoring**: Live operational status tracking with color-coded indicators
- **Location-Based Analytics**: Geospatial queries and proximity analysis for strategic planning
- **Custom Markers & Popups**: Detailed facility information with capacity, efficiency, and operational data

### 🔧 **Advanced Optimization Engine**
- **Facility Placement Optimization**: AI-powered algorithms using mathematical optimization for optimal plant locations
- **Pipeline Route Planning**: Cost-efficient pathway optimization considering terrain, regulations, and existing infrastructure
- **Demand Forecasting**: Predictive analytics for future hydrogen demand patterns using historical data
- **Multi-Objective Optimization**: Balancing cost, efficiency, environmental impact, and operational factors
- **Scenario Simulation**: Compare different infrastructure development strategies

### 📊 **Comprehensive Analytics Dashboard**
- **Real-time Performance Metrics**: KPI tracking for production rates, efficiency, and capacity utilization
- **Interactive Data Visualization**: Charts and graphs powered by Chart.js for trend analysis
- **Cost Analysis Tools**: Financial modeling with ROI calculations and investment planning
- **Comparative Analytics**: Side-by-side infrastructure scenario comparisons
- **Export & Reporting**: Generate detailed reports for stakeholder presentations

### 🛠️ **Enterprise Management System**
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Project Management**: Collaborative features for team-based infrastructure planning
- **Optimization History**: Complete audit trails of optimization runs and decisions
- **Favorites System**: Bookmark important facilities and optimization scenarios
- **Admin Dashboard**: Comprehensive system administration and user management

---

## 🏗️ System Architecture

### **Frontend Architecture (React + Vite)**
```
frontend/src/
├── components/              # Reusable UI Components
│   ├── auth/               # Authentication components (Login, Signup)
│   │   ├── Login.jsx       # Modal-based login with form validation
│   │   └── Signup.jsx      # User registration with validation
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── ProductionPlantCard.jsx    # Plant information cards
│   │   ├── PipelineCard.jsx          # Pipeline status cards
│   │   └── StorageFacilityCard.jsx   # Storage facility cards
│   ├── layout/             # Application layout components
│   │   ├── Navbar.jsx      # Navigation with authentication state
│   │   ├── Footer.jsx      # Application footer
│   │   ├── Layout.jsx      # Main application layout wrapper
│   │   └── ErrorBoundary.jsx  # Error handling component
│   └── ui/                 # Base UI components
│       ├── Button.jsx      # Reusable button component
│       ├── LoadingSpinner.jsx  # Loading indicators
│       └── Logo.jsx        # Application logo component
├── pages/                  # Application pages/routes
│   ├── Home.jsx           # Landing page with hero section
│   ├── Dashboard.jsx      # Main dashboard with metrics
│   ├── Analytics.jsx      # Advanced analytics page
│   ├── InfrastructureMap.jsx  # Interactive mapping interface
│   ├── Optimization.jsx   # Optimization tools and results
│   └── NotFound.jsx       # 404 error page
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state management
│   ├── ModalContext.jsx   # Modal state management
│   └── AppContext.jsx     # Global application state
├── utils/                 # Utility functions
│   └── ProtectedRoute.jsx # Route protection component
└── assets/                # Static assets and data
    ├── assets.js          # Mock data and constants
    └── react.svg          # React logo asset
```

### **Backend Architecture (Node.js + Express)**
```
server/src/
├── controllers/           # API route handlers
│   ├── authController.js      # Authentication endpoints
│   ├── plantController.js     # Production plant CRUD operations
│   ├── storageController.js   # Storage facility management
│   ├── pipelineController.js  # Pipeline network management
│   ├── analyticsController.js # Analytics and reporting
│   ├── optimizationLogController.js  # Optimization history
│   ├── favoriteController.js # User favorites management
│   ├── projectController.js  # Project management
│   ├── demandController.js   # Demand forecasting
│   ├── hubController.js      # Distribution hub management
│   ├── zoneController.js     # Regulatory zone management
│   ├── renewableController.js # Renewable energy sources
│   ├── systemController.js   # System-wide operations
│   └── adminController.js    # Administrative functions
├── models/                # Database schemas
│   ├── authModel.js          # User authentication model
│   ├── plantModel.js         # Production plant schema with geospatial data
│   ├── storageModel.js       # Storage facility model
│   ├── pipelineModel.js      # Pipeline network schema
│   ├── projectModel.js       # Project management model
│   ├── favoriteModel.js      # User favorites schema
│   ├── optimizationLogModel.js # Optimization run history
│   ├── demandCenterModel.js  # Demand center locations
│   ├── hubModel.js           # Distribution hub model
│   ├── renewableSourceModel.js # Renewable energy sources
│   └── regulatoryZoneModel.js # Regulatory compliance zones
├── routes/                # API route definitions
│   ├── authRoutes.js         # Authentication endpoints
│   ├── plantRoutes.js        # Plant management routes
│   ├── storageRoutes.js      # Storage facility routes
│   ├── pipelineRoutes.js     # Pipeline management routes
│   ├── analyticsRoutes.js    # Analytics endpoints
│   ├── optimizationLogRoutes.js # Optimization history routes
│   ├── favoriteRoutes.js     # Favorites management routes
│   ├── projectRoutes.js      # Project management routes
│   ├── demandRoutes.js       # Demand forecasting routes
│   ├── hubRoutes.js          # Hub management routes
│   ├── zoneRoutes.js         # Zone management routes
│   ├── renewableRoutes.js    # Renewable source routes
│   ├── systemRoutes.js       # System-wide routes
│   ├── adminRoutes.js        # Administrative routes
│   └── postgisRoutes.js      # Geospatial query routes
├── middlewares/           # Express middlewares
│   ├── authMiddleware.js     # JWT authentication middleware
│   └── roleMiddleware.js     # Role-based access control
├── config/                # Configuration files
│   ├── db.js                 # MongoDB connection configuration
│   ├── postgis.js            # PostgreSQL/PostGIS configuration
│   ├── passport.js           # Passport.js authentication strategies
│   ├── swagger.js            # API documentation configuration
│   └── logger.js             # Winston logging configuration
└── utils/                 # Backend utilities
    ├── api.js                # API response helpers and error handling
    ├── cloudinary.js         # Image upload and management
    └── sendEmail.js          # Email service integration
```

### **Optimization Engine (Python + Flask)**
```
server/python/
├── python_backend.py         # Flask API server for optimization services
├── optimized_hydrogen_system.py  # Core optimization algorithms
├── requirements.txt          # Python package dependencies
└── __pycache__/             # Python bytecode cache
    └── optimized_hydrogen_system.cpython-313.pyc
```

---

## 🛠️ Technology Stack

### **Frontend Technologies**
- **⚛️ React 19.1.1** - Modern UI framework with latest features and optimizations
- **⚡ Vite 7.1.2** - Lightning-fast build tool and development server
- **🎨 Tailwind CSS 4.1.12** - Utility-first CSS framework for responsive design
- **🎭 Framer Motion 12.23.12** - Smooth animations and micro-interactions
- **🗺️ React Leaflet 5.0.0** - Interactive mapping components with geospatial features
- **📊 Chart.js 4.5.0 + React-ChartJS-2** - Data visualization and analytics charts
- **🧭 React Router DOM 7.8.2** - Client-side routing and navigation
- **🎯 Heroicons 2.2.0** - Beautiful SVG icons for React
- **📱 Lucide React 0.542.0** - Additional icon library
- **🌐 Axios 1.11.0** - HTTP client for API communication

### **Backend Technologies**
- **🚀 Node.js 18+** - JavaScript runtime with latest ES modules support
- **🛣️ Express.js 5.1.0** - Web application framework with async/await support
- **🍃 MongoDB + Mongoose 8.18.0** - NoSQL database with ODM for application data
- **🌐 PostgreSQL + PostGIS** - Geospatial database for location-based queries
- **🔐 JWT + Passport.js** - Secure authentication with Google OAuth integration
- **📧 Nodemailer 7.0.5** - Email service for notifications
- **☁️ Cloudinary 2.7.0** - Cloud-based image management
- **📝 Winston 3.17.0** - Comprehensive logging system
- **🛡️ Helmet 8.1.0** - Security middleware for Express applications
- **📖 Swagger** - Comprehensive API documentation

### **Optimization & Analytics**
- **🐍 Python 3.8+** - High-performance optimization engine
- **🌶️ Flask + Flask-CORS** - Lightweight web framework for optimization API
- **🔢 NumPy 1.24+** - Numerical computing for mathematical optimization
- **🐼 Pandas 1.5+** - Data manipulation and analysis
- **🗺️ GeoPandas 0.10+** - Geospatial data analysis and visualization
- **📐 Shapely 2.0+** - Geometric operations for infrastructure planning

### **Development & Deployment**
- **🔨 ESLint** - JavaScript/React code linting and formatting
- **🏃‍♂️ Nodemon** - Development server with hot reloading
- **📦 npm/yarn** - Package management
- **🐳 Docker Ready** - Containerization support (configuration ready)
- **☁️ Vercel** - Frontend deployment platform
- **🔄 Concurrently** - Run multiple development servers simultaneously

---

## 🚀 Quick Start Guide

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** ≥ 18.0.0
- **Python** ≥ 3.8
- **MongoDB** (local or MongoDB Atlas)
- **PostgreSQL** with PostGIS extension (for geospatial features)
- **Git** for version control

### **1. Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/Priyanshu-2109/HackOut-25.git
cd HackOut-25

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies  
cd ../server
npm install
```

### **2. Python Environment Setup**
```bash
# Navigate to Python directory
cd server/python

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### **3. Database Configuration**

**MongoDB Setup:**
```bash
# Option 1: Local MongoDB
# Ensure MongoDB is running locally on default port 27017

# Option 2: MongoDB Atlas (recommended)
# Create account at https://cloud.mongodb.com
# Create cluster and get connection string
```

**PostgreSQL + PostGIS Setup:**
```sql
-- Create database
CREATE DATABASE hydrogrid_spatial;

-- Connect to database
\c hydrogrid_spatial;

-- Enable PostGIS extension
CREATE EXTENSION postgis;

-- Verify installation
SELECT PostGIS_Version();
```

### **4. Environment Configuration**

**Backend Environment (.env):**
```bash
cd server
cp .env.example .env  # Create from template
```

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hydrogrid
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hydrogrid

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hydrogrid_spatial
POSTGRES_USER=your_postgres_username  
POSTGRES_PASSWORD=your_postgres_password

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Python Backend
PYTHON_API_URL=http://localhost:8000

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend Environment (.env):**
```bash
cd frontend
cp .env.example .env
```

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_PYTHON_API_URL=http://localhost:8000

# Google Maps API (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### **5. Start Development Servers**

**Option 1: Start all services simultaneously (Recommended)**
```bash
cd server
npm run start:all
# This starts both Node.js server and Python optimization engine

# In a separate terminal, start frontend
cd frontend  
npm run dev
```

**Option 2: Start services individually**
```bash
# Terminal 1: Backend server
cd server
npm run dev

# Terminal 2: Python optimization engine
cd server/python
python python_backend.py

# Terminal 3: Frontend development server
cd frontend
npm run dev
```

### **6. Access the Application**
Once all servers are running:

- **🌐 Frontend Application**: http://localhost:5173
- **⚙️ Backend API**: http://localhost:5000
- **🐍 Python Optimization API**: http://localhost:8000  
- **📖 API Documentation**: http://localhost:5000/api-docs (when Swagger is configured)

### **7. Default Login Credentials**
For development and testing:
```
Username: admin
Password: admin
Email: admin@hydrogrid.com
```

---

## 📖 API Documentation

### **Authentication Endpoints**
```http
POST   /api/auth/register     # User registration with validation
POST   /api/auth/login        # JWT-based user authentication
POST   /api/auth/logout       # Secure logout with token invalidation
GET    /api/auth/profile      # Get authenticated user profile
PUT    /api/auth/profile      # Update user profile information
POST   /api/auth/forgot       # Password reset request
POST   /api/auth/reset        # Password reset confirmation
GET    /api/auth/google       # Google OAuth authentication
```

### **Infrastructure Management**
```http
# Production Plants
GET    /api/plants            # List all production plants with geolocation
POST   /api/plants            # Create new hydrogen production plant
GET    /api/plants/:id        # Get specific plant details
PUT    /api/plants/:id        # Update plant information  
DELETE /api/plants/:id        # Remove plant from system

# Storage Facilities
GET    /api/storage           # List all hydrogen storage facilities
POST   /api/storage           # Add new storage facility
GET    /api/storage/:id       # Get storage facility details
PUT    /api/storage/:id       # Update storage facility
DELETE /api/storage/:id       # Remove storage facility

# Pipeline Networks
GET    /api/pipelines         # Get all pipeline routes
POST   /api/pipelines         # Create new pipeline route
GET    /api/pipelines/:id     # Get pipeline details
PUT    /api/pipelines/:id     # Update pipeline information
DELETE /api/pipelines/:id     # Remove pipeline route

# Regulatory Zones
GET    /api/zones             # Get regulatory compliance zones
POST   /api/zones             # Create new regulatory zone
GET    /api/zones/:id         # Get zone details and regulations
PUT    /api/zones/:id         # Update zone information
```

### **Optimization Services**
```http
# Facility Optimization
POST   /api/optimize/placement    # Optimize facility placement
POST   /api/optimize/routing      # Optimize pipeline routing
POST   /api/optimize/scenario     # Run infrastructure scenario analysis
GET    /api/optimize/history      # Get optimization run history
GET    /api/optimize/results/:id  # Get specific optimization results

# Python Optimization Engine Endpoints
POST   http://localhost:8000/optimize_placement        # Advanced facility placement
POST   http://localhost:8000/optimize_routing          # Pipeline route optimization  
POST   http://localhost:8000/demand_forecasting        # Demand prediction analysis
POST   http://localhost:8000/cost_optimization         # Cost minimization analysis
```

### **Analytics & Reporting**
```http
GET    /api/analytics/dashboard     # Dashboard KPIs and metrics
GET    /api/analytics/performance   # Infrastructure performance analytics
GET    /api/analytics/costs         # Financial analysis and cost breakdown
GET    /api/analytics/efficiency    # Operational efficiency metrics
GET    /api/analytics/demand        # Demand forecasting data
GET    /api/analytics/trends        # Historical trend analysis
POST   /api/analytics/report        # Generate custom reports
```

### **Project Management**
```http
GET    /api/projects           # List user projects
POST   /api/projects           # Create new infrastructure project
GET    /api/projects/:id       # Get project details
PUT    /api/projects/:id       # Update project information
DELETE /api/projects/:id       # Delete project
POST   /api/projects/:id/share # Share project with team members
```

### **Geospatial Queries (PostGIS)**
```http
GET    /api/spatial/nearby          # Find facilities within radius
POST   /api/spatial/polygon         # Query facilities within polygon
GET    /api/spatial/distance        # Calculate distances between facilities
POST   /api/spatial/route           # Calculate optimal routes
GET    /api/spatial/elevation       # Get elevation data for locations
```

---

## 🧪 Testing

### **Frontend Testing**
```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Backend Testing**
```bash
cd server

# Run API tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration

# Generate test coverage report
npm run test:coverage
```

### **Python Testing**
```bash
cd server/python

# Run Python tests with pytest
python -m pytest

# Run tests with coverage
python -m pytest --cov=.

# Run specific test file
python -m pytest test_optimization.py
```

---

## 🚢 Production Deployment

### **Frontend Deployment (Vercel)**

**Automatic Deployment:**
1. Connect GitHub repository to Vercel
2. Configure build settings:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev"
   }
   ```
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push to main branch

**Manual Deployment:**
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### **Backend Deployment**

**Docker Deployment:**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
```

```bash
# Build and run with Docker
docker build -t hydrogrid-backend .
docker run -p 5000:5000 hydrogrid-backend
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### **Development Workflow**
1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Follow existing code style and patterns
4. **Test Thoroughly**: Ensure all tests pass
5. **Submit Pull Request**: With clear description of changes

### **Code Style Guidelines**
- Follow ESLint configuration for JavaScript/React
- Use PEP 8 for Python code
- Write meaningful commit messages
- Include tests for new features

---

## 📋 Development Roadmap

### **🚀 Version 1.0 - Current Features**
- ✅ **Interactive Infrastructure Mapping** with React Leaflet
- ✅ **Basic Optimization Algorithms** for facility placement
- ✅ **User Authentication System** with JWT and role-based access
- ✅ **Analytics Dashboard** with real-time metrics
- ✅ **Project Management** with collaborative features

### **🔄 Version 1.1 - Next Release (Q2 2025)**
- 🔄 **Advanced Optimization Engine** with machine learning integration
- 🔄 **Real-time Data Integration** with external APIs and IoT sensors  
- 🔄 **Enhanced Mobile Experience** with progressive web app features
- 🔄 **Advanced Analytics** with predictive forecasting

### **🔜 Version 2.0 - Major Release (Q4 2025)**
- 🔜 **AI-Powered Demand Forecasting** using machine learning models
- 🔜 **Advanced 3D Visualization** with WebGL integration
- 🔜 **Multi-Tenant Architecture** for enterprise customers
- 🔜 **Integration APIs** for third-party systems (ERP, GIS, IoT)

---

## 📄 License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for full details.

---

## 🙋‍♂️ Support & Community

### **Getting Help**
- **📚 Documentation**: Comprehensive guides and API reference
- **💬 GitHub Discussions**: [Community Forum](https://github.com/Priyanshu-2109/HackOut-25/discussions)
- **🐛 GitHub Issues**: [Bug Reports & Feature Requests](https://github.com/Priyanshu-2109/HackOut-25/issues)
- **📧 Email Support**: support@hydrogrid.com

---

## 🏆 Acknowledgments

### **Core Development Team**
- **Priyanshu** - Full-stack Development & Architecture
- **Contributors** - Community developers and contributors

### **Special Thanks**
- **Open Source Community** - For the amazing libraries and frameworks
- **Clean Energy Advocates** - For inspiration and domain expertise
- **Beta Testers** - For valuable feedback and bug reports

---

<div align="center">

# 🌱 **Building the Future of Green Hydrogen Infrastructure** 🌱

### *Empowering the clean energy transition through intelligent infrastructure planning*

---

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Priyanshu-2109/HackOut-25)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00C853?style=for-the-badge&logo=vercel)](https://hydrogrid.vercel.app)
[![API Documentation](https://img.shields.io/badge/API-Documentation-FF6B35?style=for-the-badge&logo=swagger)](http://localhost:5000/api-docs)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

**Made with ❤️ and sustainable energy by the HydroGrid Team**

*Accelerating the hydrogen economy, one optimization at a time*

</div>
