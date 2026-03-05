# 📋 Project Todo List
**Smart C&D Waste Collection Monitoring System + Fleet Management Dashboard**

> Generated from: `Smart_CD_Waste_UI_PRD.pdf` · `Fleet_Management_Dashboard_SDD.pdf` · `Smart_CD_Waste_Tech_Stack.pdf`

---

## 🏗️ PHASE 1 — Project Setup & Tech Stack Configuration

### 1.1 Repository & Folder Structure
- [ ] Create monorepo or multi-folder project root
- [ ] Create `/frontend` folder for React application
- [ ] Create `/backend` folder for FastAPI or Node.js/Express server
- [ ] Create `/ai-model` folder for YOLOv8 model scripts
- [ ] Create `/database` folder for DB schema and migration scripts
- [ ] Create `/docs` folder for project documentation
- [ ] Initialize Git repository and set up `.gitignore`

### 1.2 Frontend Setup
- [ ] Initialize React.js project inside `/frontend`
- [ ] Install and configure Tailwind CSS (or Material UI)
- [ ] Install Chart.js or Recharts for data visualization
- [ ] Install Mapbox GL JS or Google Maps API SDK
- [ ] Set up project folder structure (components, pages, hooks, services)
- [ ] Configure environment variables (`.env`) for API keys

### 1.3 Backend Setup
- [ ] Choose backend: FastAPI (Python) **or** Node.js + Express.js
- [ ] Initialize backend project inside `/backend`
- [ ] Set up project structure (routes, controllers, models, middleware)
- [ ] Install authentication dependencies (JWT / bcrypt)
- [ ] Configure CORS and HTTPS settings
- [ ] Set up environment variables for DB connection and secrets

### 1.4 Database Setup
- [ ] Choose database: PostgreSQL, MongoDB, **or** Firebase
- [ ] Create database schema with the following tables/collections:
  - [ ] `Users` — user_id, name, email, password, role
  - [ ] `Vehicles` — vehicle_id, vehicle_number, model, status, driver_id
  - [ ] `Drivers` — driver_id, name, license_number, contact
  - [ ] `GPS_Data` — gps_id, vehicle_id, latitude, longitude, timestamp
  - [ ] `Maintenance` — maintenance_id, vehicle_id, date, cost, description
  - [ ] `Revenue` — revenue_id, vehicle_id, amount, date
- [ ] Write and run initial migration/seed scripts

### 1.5 Hosting & Deployment Setup
- [ ] Configure frontend hosting on GitHub Pages or Vercel
- [ ] Configure backend hosting on Render or Railway
- [ ] Configure database hosting on Firebase or Supabase
- [ ] Set up CI/CD pipeline (GitHub Actions or equivalent)
- [ ] Configure HTTPS and domain settings

---

## 🎨 PHASE 2 — Smart C&D Waste System UI Redesign (PRD)

> ⚠️ **Constraint:** Only visual/layout changes are allowed. No functional logic, backend, routing, database, or existing features may be modified.

### 2.1 Global Design System
- [ ] Define and apply color scheme:
  - [ ] Primary: Deep Green or Teal
  - [ ] Secondary: Dark Grey
  - [ ] Background: Light Grey or White
- [ ] Select and apply a professional typography / font (e.g., Inter, Roboto)
- [ ] Define spacing scale, border radius, and shadow tokens
- [ ] Create reusable UI components: Cards, Panels, Tables, Icons
- [ ] Apply smooth CSS transitions and hover effects globally

### 2.2 Layout Restructure
- [ ] Implement new layout with:
  - [ ] Top Navigation Bar
  - [ ] Left Sidebar Menu
  - [ ] Main Dashboard Area
  - [ ] Content Display Area
- [ ] Ensure layout is responsive across screen sizes

### 2.3 Sidebar Navigation
- [ ] Build styled Left Sidebar with the following existing menu items (no additions/removals):
  - [ ] Dashboard
  - [ ] Collection Sites
  - [ ] Monitoring / Map
  - [ ] Analytics / Reports
  - [ ] Subscriptions
  - [ ] Settings
- [ ] Add hover effects on sidebar menu items
- [ ] Add active/selected state indicator for current page

### 2.4 Top Navigation Bar
- [ ] Style the top navigation bar with:
  - [ ] System title / branding
  - [ ] User Profile / Info section
  - [ ] Notifications icon/indicator
  - [ ] Search bar (existing functionality preserved)

### 2.5 Dashboard Page Redesign
- [ ] Replace plain metrics with styled KPI cards showing:
  - [ ] Total Units
  - [ ] Active Units
  - [ ] Pending Collections
  - [ ] Completed Collections
- [ ] Add visual tiles for status indicators
- [ ] Apply hover effects on KPI cards
- [ ] Improve visual hierarchy with clear headings and spacing

### 2.6 Monitoring / Map Page Redesign
- [ ] Increase map display size to be the primary focal element
- [ ] Style map markers with color-coded status:
  - [ ] 🟢 Green — Active
  - [ ] 🟡 Yellow — Idle
  - [ ] 🔴 Red — Maintenance
- [ ] Ensure all existing map interactions remain unchanged

### 2.7 Other Pages — Visual Polish
- [ ] Apply consistent card/panel styling to Collection Sites page
- [ ] Apply consistent styling to Analytics / Reports page
- [ ] Apply consistent styling to Subscriptions page
- [ ] Apply consistent styling to Settings page

### 2.8 Quality Assurance (UI Only)
- [ ] Verify no features have been added or removed
- [ ] Verify no backend or routing logic was changed
- [ ] Verify no database queries or data structures were modified
- [ ] Test all existing workflows still function correctly
- [ ] Review visual consistency across all pages

---

## 🚗 PHASE 3 — Fleet Management Dashboard (SDD)

### 3.1 Authentication Module
- [ ] Build Login page (email + password form)
- [ ] Implement JWT-based authentication
- [ ] Implement Logout functionality
- [ ] Implement Role-Based Access Control (RBAC)
- [ ] Create API endpoints:
  - [ ] `POST /api/login`
  - [ ] `POST /api/logout`
- [ ] Protect all dashboard routes with auth middleware

### 3.2 Fleet Dashboard (Main Overview)
- [ ] Build main Dashboard page with:
  - [ ] Fleet summary widget (Total / Active / Idle vehicles count)
  - [ ] Real-time map widget for vehicle tracking
  - [ ] Maintenance cost analytics widget
  - [ ] Revenue analytics widget
  - [ ] Vehicle status table
- [ ] Integrate Chart.js / Recharts for analytics charts
- [ ] Connect widgets to live backend data

### 3.3 Vehicle Management Module
- [ ] Build Vehicles list page with search and filter
- [ ] Implement Add Vehicle form (vehicle number, model, status, driver assignment)
- [ ] Implement Edit Vehicle functionality
- [ ] Implement Delete Vehicle functionality
- [ ] Display vehicle status (Active / Idle / Maintenance)
- [ ] Create API endpoints:
  - [ ] `GET /api/vehicles`
  - [ ] `POST /api/vehicles`
  - [ ] `PUT /api/vehicles/{id}`
  - [ ] `DELETE /api/vehicles/{id}`

### 3.4 Driver Management Module
- [ ] Build Drivers list page
- [ ] Implement Add Driver form (name, license number, contact)
- [ ] Implement Assign Driver to Vehicle functionality
- [ ] Display driver status and vehicle assignment

### 3.5 GPS Real-Time Tracking Module
- [ ] Integrate Mapbox or Google Maps API
- [ ] Display real-time vehicle locations on map
- [ ] Implement route history visualization per vehicle
- [ ] Set up real-time data polling or WebSocket connection
- [ ] Create API endpoints:
  - [ ] `GET /api/gps/{vehicle_id}`
  - [ ] `POST /api/gps/update`

### 3.6 Maintenance Management Module
- [ ] Build Maintenance list page (all scheduled/completed records)
- [ ] Implement Schedule Maintenance form (vehicle, date, cost, description)
- [ ] Implement Track / Update maintenance records
- [ ] Display maintenance cost analytics chart
- [ ] Create API endpoints:
  - [ ] `GET /api/maintenance`
  - [ ] `POST /api/maintenance`

### 3.7 Reports Module
- [ ] Build Reports page with the following report types:
  - [ ] Fleet Summary Report
  - [ ] Revenue Report
  - [ ] Maintenance Cost Report
- [ ] Implement report generation (date range filters)
- [ ] Add export functionality (PDF / CSV)

### 3.8 Settings Module
- [ ] Build Settings page
- [ ] Implement user profile management
- [ ] Implement notification preferences
- [ ] Implement system configuration options

### 3.9 Sidebar Navigation (Fleet Dashboard)
- [ ] Build styled Sidebar with:
  - [ ] Dashboard
  - [ ] Vehicles
  - [ ] Drivers
  - [ ] Maintenance
  - [ ] Reports
  - [ ] Settings

---

## 🤖 PHASE 4 — AI Integration (Optional)

### 4.1 YOLOv8 Waste Detection Setup
- [ ] Set up Python environment inside `/ai-model`
- [ ] Install YOLOv8 (Ultralytics), OpenCV, and PyTorch
- [ ] Obtain or prepare C&D waste image dataset
- [ ] Train / fine-tune YOLOv8 model on waste categories
- [ ] Evaluate model accuracy (mAP, precision, recall)

### 4.2 Waste Classification API
- [ ] Create inference script for YOLOv8 model
- [ ] Build REST API endpoint to receive image input and return classifications
- [ ] Integrate AI detection results into the monitoring dashboard
- [ ] Test with sample C&D waste images

---

## 📡 PHASE 5 — IoT Integration (Optional)

### 5.1 Hardware Setup
- [ ] Configure ESP32 or Raspberry Pi hardware units
- [ ] Flash firmware with REST API or MQTT communication
- [ ] Test hardware connectivity and data transmission

### 5.2 Real-Time Data Pipeline
- [ ] Set up MQTT broker (e.g., Mosquitto) or REST polling
- [ ] Build backend handler to receive IoT location/status data
- [ ] Store incoming IoT data into GPS_Data table
- [ ] Connect live IoT data to the monitoring map

---

## 🧪 PHASE 6 — Testing & Quality Assurance

### 6.1 Frontend Testing
- [ ] Write unit tests for key React components
- [ ] Test all UI interactions and hover effects
- [ ] Validate responsive design on mobile, tablet, and desktop
- [ ] Run accessibility checks (contrast, font sizes)

### 6.2 Backend Testing
- [ ] Write unit tests for all API endpoints
- [ ] Test authentication and RBAC rules
- [ ] Test data validation and error handling
- [ ] Perform load testing (target: 1000+ vehicles supported)

### 6.3 Integration Testing
- [ ] Test full user flows end-to-end (login → dashboard → vehicle management)
- [ ] Validate real-time GPS tracking data flow
- [ ] Validate report generation accuracy

### 6.4 Non-Functional Requirements Validation
- [ ] Verify real-time updates respond within seconds
- [ ] Confirm HTTPS is enforced across all endpoints
- [ ] Validate system uptime target (99.9%)

---

## 🚀 PHASE 7 — Deployment & Launch

- [ ] Build optimized production frontend bundle
- [ ] Deploy frontend to GitHub Pages or Vercel
- [ ] Deploy backend to Render or Railway
- [ ] Deploy database to Firebase or Supabase
- [ ] Run smoke tests on deployed production environment
- [ ] Configure monitoring/logging (e.g., Sentry, LogRocket)
- [ ] Document deployment steps in `/docs`

---

## 🔮 PHASE 8 — Future Enhancements (Backlog)

- [ ] Predictive maintenance using AI/ML models
- [ ] Fuel optimization algorithms
- [ ] Driver behavior analytics module
- [ ] Mobile app support (React Native)
- [ ] Full IoT integration with live hardware sensors

---

*Last updated: 2026-02-21 | Sources: Smart_CD_Waste_UI_PRD.pdf · Fleet_Management_Dashboard_SDD.pdf · Smart_CD_Waste_Tech_Stack.pdf*
