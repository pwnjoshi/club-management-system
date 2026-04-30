import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from './api';

function AttendanceAdmin() {
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  const loadAttendance = async (eventId) => {
    setMessage('');
    try {
      const response = await api.get(`/api/attendance/${eventId}?requesterEmail=${encodeURIComponent(user.email)}`);
      setAttendanceRecords(response.data || []);
      setSelectedEvent(events.find(e => e.id === eventId));
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not load attendance.');
    }
  };

  if (!user?.email) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Admin</p>
          <h1 className="title">Attendance Management</h1>
          <p className="muted">Generate QR codes for events and view attendance records.</p>
        </div>
        <Link className="btn ghost" to="/dashboard">Back to Dashboard</Link>
      </header>

      {message && <p className="status-banner">{message}</p>}

      {loading ? (
        <p className="muted">Loading events...</p>
      ) : (
        <section className="event-grid">
          {events.map((event, index) => (
            <article key={event.id} className={`glass card rise-up delay-${(index % 3) + 1}`}>
              <h3>{event.title}</h3>
              <p className="meta">{event.eventDate} | {event.location}</p>

              {/* QR Code for this event */}
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', display: 'inline-block', margin: '0.75rem 0' }}>
                <QRCode value={`CHECKIN:${event.id}`} size={160} />
              </div>
              <p className="meta" style={{ fontFamily: 'monospace' }}>CHECKIN:{event.id}</p>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn primary" onClick={() => loadAttendance(event.id)}>
                  View Attendance
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Attendance Records Panel */}
      {selectedEvent && (
        <section className="glass card" style={{ marginTop: '1.5rem' }}>
          <h3>Attendance — {selectedEvent.title}</h3>
          <p className="meta">{selectedEvent.eventDate} | {selectedEvent.location}</p>

          {attendanceRecords.length === 0 ? (
            <p className="muted" style={{ marginTop: '0.75rem' }}>No attendance records yet for this event.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>#</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>Email</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>Checked In At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, i) => (
                    <tr key={record.id}>
                      <td style={{ padding: '0.6rem 0' }}>{i + 1}</td>
                      <td style={{ padding: '0.6rem 0' }}>{record.email}</td>
                      <td style={{ padding: '0.6rem 0' }}>
                        {record.checkedInAt ? new Date(record.checkedInAt).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="meta" style={{ marginTop: '0.5rem' }}>Total: {attendanceRecords.length} attendee(s)</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default AttendanceAdmin;
