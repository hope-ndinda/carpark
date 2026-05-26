import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ParkingList from './pages/parkings/ParkingList';
import RegisterParking from './pages/parkings/RegisterParking';
import CarEntry from './pages/cars/CarEntry';
import CarExit from './pages/cars/CarExit';
import CarList from './pages/cars/CarList';
import TicketView from './pages/cars/TicketView';
import BillView from './pages/cars/BillView';
import Reports from './pages/reports/Reports';

const Layout = ({ children }) => (
  <div className="flex h-screen overflow-hidden bg-app-bg">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '10px',
              border: '1px solid #E2E8F2',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />

          <Route path="/parkings" element={
            <ProtectedRoute><Layout><ParkingList /></Layout></ProtectedRoute>
          } />

          <Route path="/parkings/new" element={
            <ProtectedRoute roles={['ADMIN']}><Layout><RegisterParking /></Layout></ProtectedRoute>
          } />

          <Route path="/cars/entry" element={
            <ProtectedRoute><Layout><CarEntry /></Layout></ProtectedRoute>
          } />

          <Route path="/cars/exit" element={
            <ProtectedRoute><Layout><CarExit /></Layout></ProtectedRoute>
          } />

          <Route path="/cars" element={
            <ProtectedRoute><Layout><CarList /></Layout></ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute roles={['ADMIN']}><Layout><Reports /></Layout></ProtectedRoute>
          } />

          {/* Full Page Print Views */}
          <Route path="/ticket/:id" element={
            <ProtectedRoute><TicketView /></ProtectedRoute>
          } />
          <Route path="/bill/:id" element={
            <ProtectedRoute><BillView /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
