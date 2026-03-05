import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ClientPortalLayout from './components/ClientPortalLayout'
import Dashboard from './pages/Dashboard'
import CollectionSites from './pages/CollectionSites'
import Monitoring from './pages/Monitoring'
import Analytics from './pages/Analytics'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Maintenance from './pages/Maintenance'
import Subscriptions from './pages/Subscriptions'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ClientDashboard from './pages/portal/ClientDashboard'
import ClientLiveMap from './pages/portal/ClientLiveMap'
import ClientActivityLog from './pages/portal/ClientActivityLog'
import ClientSLAReports from './pages/portal/ClientSLAReports'
import ClientBilling from './pages/portal/ClientBilling'
import ClientComplaints from './pages/portal/ClientComplaints'
import ClientProfile from './pages/portal/ClientProfile'
import ClientNotifications from './pages/portal/ClientNotifications'
import ClientEPRScorecard from './pages/portal/ClientEPRScorecard'
import ClientCollectionRequest from './pages/portal/ClientCollectionRequest'
import './index.css'

export default function App() {
  return (
    <BrowserRouter basename="/Greenie-Fleet-Intelligence">
      <Routes>
        {/* Root → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Standalone */}
        <Route path="/login" element={<Login />} />

        {/* Client Portal */}
        <Route path="/portal/*" element={
          <ClientPortalLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/portal/dashboard" replace />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/map" element={<ClientLiveMap />} />
              <Route path="/activity" element={<ClientActivityLog />} />
              <Route path="/sla" element={<ClientSLAReports />} />
              <Route path="/billing" element={<ClientBilling />} />
              <Route path="/complaints" element={<ClientComplaints />} />
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/notifications" element={<ClientNotifications />} />
              <Route path="/epr" element={<ClientEPRScorecard />} />
              <Route path="/request" element={<ClientCollectionRequest />} />
            </Routes>
          </ClientPortalLayout>
        } />

        {/* Admin layout */}
        <Route path="/*" element={
          <div className="app-layout">
            <Sidebar />
            <div className="main-area">
              <TopBar />
              <main className="page-content">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/collection-sites" element={<CollectionSites />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/drivers" element={<Drivers />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
