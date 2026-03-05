import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import CollectionSites from './pages/CollectionSites';
import MonitoringMap from './pages/MonitoringMap';
import VehiclesRegistry from './pages/VehiclesRegistry';
import Analytics from './pages/Analytics';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sites" element={<CollectionSites />} />
          <Route path="monitoring" element={<MonitoringMap />} />
          <Route path="vehicles" element={<VehiclesRegistry />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
