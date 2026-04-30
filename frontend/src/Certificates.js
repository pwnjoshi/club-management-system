import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from './api';

function downloadCertificate(certEl, fileName) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html>
    <head>
      <title>${fileName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; font-family: 'Segoe UI', system-ui, sans-serif; }
        .cert-frame {
          width: 720px; padding: 48px; border: 4px solid #1428a0; border-radius: 20px;
          text-align: center; background: linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%);
        }
        .cert-frame .label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #1428a0; font-weight: 700; }
        .cert-frame h2 { margin: 18px 0 6px; font-size: 28px; }
        .cert-frame .sub { color: #64748b; font-size: 15px; }
        .cert-frame h3 { color: #1428a0; margin: 6px 0 20px; font-size: 22px; }
        .cert-frame .meta { color: #64748b; font-size: 13px; }
        .cert-frame .code { font-family: monospace; font-size: 14px; background: #fff; display: inline-block; padding: 4px 14px; border-radius: 8px; border: 1px solid #dbe4ee; margin-top: 8px; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      ${certEl.innerHTML}
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}

function Certificates() {
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    const fetchCertificates = async () => {
      try {
        const response = await api.get(`/api/certificates/my?email=${encodeURIComponent(user.email)}`);
        setCertificates(response.data || []);
      } catch {
        setMessage('Could not load certificates.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [user?.email]);

  if (!user?.email) return <Navigate to="/login" replace />;

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Certificates</p>
          <h1 className="title">My Certificates</h1>
          <p className="muted">View and share your verified event certificates.</p>
        </div>
        <Link className="btn ghost" to="/dashboard">Back to Dashboard</Link>
      </header>

      {message && <p className="status-banner">{message}</p>}

      {loading ? (
        <p className="muted">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <div className="glass card">
          <h3>No certificates yet</h3>
          <p className="muted">Attend events and get your participation certificates here.</p>
        </div>
      ) : (
        <section className="event-grid">
          {certificates.map((cert, index) => (
            <article key={cert.id} className={`glass card rise-up delay-${(index % 3) + 1}`}>
              {/* Certificate visual */}
              <div
                className="cert-frame"
                id={`cert-${cert.id}`}
                style={{
                  border: '3px solid var(--brand)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%)',
                  position: 'relative'
                }}
              >
                <p className="label" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)', fontWeight: 700, margin: 0 }}>
                  Certificate of Participation
                </p>
                <h2 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1.3rem' }}>{cert.recipientName}</h2>
                <p className="sub muted" style={{ margin: '0.25rem 0' }}>has successfully participated in</p>
                <h3 style={{ color: 'var(--brand)', margin: '0.25rem 0 0.75rem' }}>{cert.eventTitle}</h3>
                <p className="meta">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                <p className="code" style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  background: '#fff',
                  display: 'inline-block',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  marginTop: '0.5rem'
                }}>
                  {cert.certificateCode}
                </p>
              </div>
              <button
                className="btn primary"
                style={{ marginTop: '0.75rem', width: '100%' }}
                onClick={() => {
                  const el = document.getElementById(`cert-${cert.id}`);
                  if (el) downloadCertificate(el, `${cert.recipientName} - ${cert.eventTitle}`);
                }}
              >
                ⬇ Download Certificate
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Certificates;
