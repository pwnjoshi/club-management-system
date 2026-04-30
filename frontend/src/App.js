import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Events from './Events';
import PublicHome from './PublicHome';
import AdminRegistrations from './AdminRegistrations';
import AttendanceCheckin from './AttendanceCheckin';
import AttendanceAdmin from './AttendanceAdmin';
import Certificates from './Certificates';
import CertificateAdmin from './CertificateAdmin';
import CertificateVerify from './CertificateVerify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin/registrations" element={<AdminRegistrations />} />
        <Route path="/attendance/checkin" element={<AttendanceCheckin />} />
        <Route path="/admin/attendance" element={<AttendanceAdmin />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/admin/certificates" element={<CertificateAdmin />} />
        <Route path="/verify" element={<CertificateVerify />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
