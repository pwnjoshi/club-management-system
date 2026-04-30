import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

function CertificateVerify() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setMessage('Please enter a certificate code.');
      setResult(null);
      return;
    }

    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const response = await api.get(`/api/certificates/verify?code=${encodeURIComponent(code.trim())}`);
      setResult(response.data);
    } catch {
      setMessage('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Verification</p>
          <h1 className="title">Verify Certificate</h1>
          <p className="muted">Enter a certificate code to check if it is genuine.</p>
        </div>
        <Link className="btn ghost" to="/">Home</Link>
      </header>

      <div style={{ maxWidth: '560px' }}>
        <div className="glass card">
          <form onSubmit={handleVerify} className="stack">
            <label>Certificate Code</label>
            <input
              type="text"
              placeholder="e.g. CERT-A1B2C3D4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>

        {message && <p className="status-banner" style={{ marginTop: '1rem' }}>{message}</p>}

        {result && (
          <div className="glass card" style={{ marginTop: '1rem' }}>
            {result.valid ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ color: '#1a6e1a' }}>Certificate is Valid</h3>
                <div style={{
                  border: '2px solid #6fcf6f',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  marginTop: '1rem',
                  background: '#f0fdf0'
                }}>
                  <p style={{ margin: '0.25rem 0', fontWeight: 700, fontSize: '1.1rem' }}>
                    {result.certificate.recipientName}
                  </p>
                  <p className="muted" style={{ margin: '0.25rem 0' }}>participated in</p>
                  <p style={{ margin: '0.25rem 0', fontWeight: 700, color: 'var(--brand)' }}>
                    {result.certificate.eventTitle}
                  </p>
                  <p className="meta" style={{ marginTop: '0.5rem' }}>
                    Issued: {new Date(result.certificate.issuedAt).toLocaleDateString()}
                  </p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Code: {result.certificate.certificateCode}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❌</div>
                <h3 style={{ color: '#c0392b' }}>Certificate Not Found</h3>
                <p className="muted">{result.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificateVerify;
