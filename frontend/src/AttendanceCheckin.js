import { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import api from './api';

function AttendanceCheckin() {
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [manualPayload, setManualPayload] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  const handleCheckin = async (payload) => {
    setMessage('');
    setSuccess(false);
    try {
      const response = await api.post('/api/attendance/checkin', {
        email: user.email,
        payload: payload,
      });
      setMessage(response.data.message || 'Attendance marked!');
      setSuccess(true);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Check-in failed. Please try again.');
      setSuccess(false);
    }
  };

  const startScanner = async () => {
    setScanning(true);
    setMessage('');
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop().catch(() => {});
          setScanning(false);
          handleCheckin(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      setMessage('Could not access camera. Use manual entry instead.');
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(() => {});
    }
    setScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualPayload.trim()) {
      setMessage('Please enter the QR code value.');
      return;
    }
    handleCheckin(manualPayload.trim());
  };

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Attendance</p>
          <h1 className="title">Check In</h1>
          <p className="muted">Scan the event QR code or enter the code manually to mark your attendance.</p>
        </div>
        <Link className="btn ghost" to="/dashboard">Back to Dashboard</Link>
      </header>

      {message && (
        <p className="status-banner" style={success ? { background: '#e8fbe8', borderColor: '#6fcf6f', color: '#1a6e1a' } : {}}>
          {message}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '800px' }}>
        {/* QR Scanner */}
        <div className="glass card">
          <h3>📷 Scan QR Code</h3>
          <p className="muted" style={{ marginBottom: '1rem' }}>Point your camera at the event QR code.</p>
          <div id="qr-reader" ref={scannerRef} style={{ width: '100%', minHeight: scanning ? '280px' : '0' }} />
          {!scanning ? (
            <button className="btn primary" onClick={startScanner} style={{ marginTop: '0.5rem' }}>
              Start Camera
            </button>
          ) : (
            <button className="btn ghost" onClick={stopScanner} style={{ marginTop: '0.5rem' }}>
              Stop Camera
            </button>
          )}
        </div>

        {/* Manual Entry */}
        <div className="glass card">
          <h3>⌨️ Manual Entry</h3>
          <p className="muted" style={{ marginBottom: '1rem' }}>Enter the code shown below the QR image.</p>
          <form onSubmit={handleManualSubmit} className="stack">
            <input
              type="text"
              placeholder="e.g. CHECKIN:1"
              value={manualPayload}
              onChange={(e) => setManualPayload(e.target.value)}
            />
            <button type="submit" className="btn primary">Check In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AttendanceCheckin;
