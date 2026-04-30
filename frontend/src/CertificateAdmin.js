import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from './api';

function CertificateAdmin() {
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [issuing, setIssuing] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events');
        setEvents(response.data || []);
      } catch {
        setMessage('Could not load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user?.email]);

  const issueBulkCertificates = async (eventId) => {
    setMessage('');
    setIssuing(eventId);
    try {
      const response = await api.post('/api/certificates/issue-bulk', {
        adminEmail: user.email,
        eventId: String(eventId),
      });
      setMessage(response.data.message || 'Certificates issued successfully.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to issue certificates.');
    } finally {
      setIssuing(null);
    }
  };

  if (!user?.email) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Admin</p>
          <h1 className="title">Certificate Management</h1>
          <p className="muted">Issue certificates to all attendees of an event in one click.</p>
        </div>
        <Link className="btn ghost" to="/dashboard">Back to Dashboard</Link>
      </header>

      {message && <p className="status-banner">{message}</p>}

      {loading ? (
        <p className="muted">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="glass card">
          <h3>No events found</h3>
          <p className="muted">Create events first, then issue certificates to attendees.</p>
        </div>
      ) : (
        <section className="event-grid">
          {events.map((event, index) => (
            <article key={event.id} className={`glass card rise-up delay-${(index % 3) + 1}`}>
              <h3>{event.title}</h3>
              <p className="meta">{event.eventDate} | {event.location}</p>
              <p className="muted" style={{ margin: '0.5rem 0' }}>{event.description}</p>
              <button
                className="btn primary"
                onClick={() => issueBulkCertificates(event.id)}
                disabled={issuing === event.id}
                style={{ marginTop: '0.5rem' }}
              >
                {issuing === event.id ? 'Issuing...' : 'Issue Certificates to All Attendees'}
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default CertificateAdmin;
