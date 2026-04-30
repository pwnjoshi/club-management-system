import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from './api';

function AdminRegistrations() {
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, regsRes] = await Promise.all([
          api.get('/api/events'),
          api.get(`/api/events/registrations?requesterEmail=${encodeURIComponent(user.email)}`)
        ]);

        setEvents(eventsRes.data || []);
        setRegistrations(regsRes.data || []);
      } catch (error) {
        setMessage('Could not load registrations right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  const groupedByEvent = useMemo(() => {
    const eventMap = new Map(events.map((event) => [event.id, event]));
    const grouped = {};

    registrations.forEach((registration) => {
      const event = eventMap.get(registration.eventId);
      const eventKey = String(registration.eventId);

      if (!grouped[eventKey]) {
        grouped[eventKey] = {
          eventId: registration.eventId,
          title: event?.title || `Unknown Event (#${registration.eventId})`,
          eventDate: event?.eventDate || 'Unknown Date',
          location: event?.location || 'Unknown Location',
          attendees: []
        };
      }

      grouped[eventKey].attendees.push(registration);
    });

    return Object.values(grouped).sort((a, b) => a.title.localeCompare(b.title));
  }, [events, registrations]);

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Admin View</p>
          <h1 className="title">Event Registrations</h1>
          <p className="muted">See who registered for each event.</p>
        </div>
        <Link className="btn ghost" to="/dashboard">Back to Dashboard</Link>
      </header>

      {message && <p className="status-banner">{message}</p>}

      {loading ? (
        <p className="muted">Loading registrations...</p>
      ) : groupedByEvent.length === 0 ? (
        <div className="glass card">
          <h3>No registrations yet</h3>
          <p className="muted">Once users register, they will appear here by event.</p>
        </div>
      ) : (
        <section className="stack" style={{ gap: '1rem' }}>
          {groupedByEvent.map((group) => (
            <article key={group.eventId} className="glass card">
              <h3>{group.title}</h3>
              <p className="meta">
                {group.eventDate} | {group.location} | Total registered: {group.attendees.length}
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>Email</th>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.attendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <td style={{ padding: '0.6rem 0' }}>{attendee.email}</td>
                        <td style={{ padding: '0.6rem 0' }}>
                          {attendee.registeredAt
                            ? new Date(attendee.registeredAt).toLocaleString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default AdminRegistrations;
