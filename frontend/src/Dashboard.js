import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');
  const isAdmin = user?.role === 'ADMIN';

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, regsRes, attendanceRes, certsRes] = await Promise.all([
          api.get('/api/events'),
          isAdmin
            ? api.get(`/api/events/registrations?requesterEmail=${encodeURIComponent(user.email)}`)
            : api.get(`/api/events/registrations?email=${encodeURIComponent(user.email)}`),
          api.get(`/api/attendance/my?email=${encodeURIComponent(user.email)}`),
          api.get(`/api/certificates/my?email=${encodeURIComponent(user.email)}`),
        ]);

        const allEvents = eventsRes.data;
        const userRegs = regsRes.data;

        const enrichedEvents = userRegs.map(reg => {
          const eventDetails = allEvents.find(e => e.id === reg.eventId) || {};
          return {
            ...reg,
            eventTitle: eventDetails.title || 'Unknown Event',
            eventDate: eventDetails.eventDate || 'Unknown Date'
          };
        });

        setRegisteredEvents(enrichedEvents);
        setAttendanceRecords(attendanceRes.data || []);
        setCertificates(certsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, isAdmin]);

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('clubUser');
    navigate('/login');
  };

  /* ─── ADMIN DASHBOARD ─── */
  if (isAdmin) {
    return (
      <div className="page shell-bg home-page">
        <header className="topbar">
          <div>
            <p className="badge">Admin Dashboard</p>
            <h1 className="title">Welcome back, {user.name || user.email}</h1>
            <p className="muted">Monitor registrations, attendance, certificates, and manage campus participation.</p>
          </div>
          <button className="btn ghost" onClick={handleLogout}>Logout</button>
        </header>

        <section className="hero-grid">
          <article className="glass card hero-main rise-up delay-1">
            <p className="hero-kicker">Admin control center</p>
            <h2 className="hero-heading">Manage events, attendance, and certificates from one place.</h2>
            <p className="hero-copy">Generate QR codes for attendance, issue certificates to attendees, and track all campus activity.</p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => navigate('/admin/registrations')}>View Registrations</button>
              <button className="btn ghost" onClick={() => navigate('/admin/attendance')}>Attendance &amp; QR</button>
              <button className="btn ghost" onClick={() => navigate('/admin/certificates')}>Issue Certificates</button>
            </div>
            <div className="hero-stats">
              <div>
                <p className="metric">{registeredEvents.length}</p>
                <p className="meta">Registrations</p>
              </div>
              <div>
                <p className="metric">Live</p>
                <p className="meta">Event seat counts</p>
              </div>
              <div>
                <p className="metric">Full</p>
                <p className="meta">System visibility</p>
              </div>
            </div>
          </article>

          <article className="glass card hero-side rise-up delay-2">
            <h3>Admin Tasks</h3>
            <ul className="clean-list">
              <li>Review registrations by event.</li>
              <li>Generate QR codes for attendance.</li>
              <li>View who checked in and when.</li>
              <li>Issue certificates to attendees.</li>
              <li>Verify certificates by code.</li>
            </ul>
          </article>
        </section>

        <section className="home-cards">
          <article className="glass card rise-up delay-1">
            <h3>Recent Registrations</h3>
            {loading ? (
              <p className="muted">Loading...</p>
            ) : registeredEvents.length > 0 ? (
              <ul className="clean-list">
                {registeredEvents.slice(0, 5).map(reg => (
                  <li key={reg.id} style={{ marginBottom: '0.8rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
                    <strong>{reg.eventTitle}</strong>
                    <br />
                    <span className="meta">{reg.email} • {reg.eventDate} • {new Date(reg.registeredAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No registrations yet.</p>
            )}
            <div className="hero-actions" style={{ marginTop: '1rem' }}>
              <button className="btn primary" onClick={() => navigate('/admin/registrations')}>View All Registrations</button>
              <button className="btn ghost" onClick={() => navigate('/events')}>Browse Events</button>
            </div>
          </article>

          <article className="glass card rise-up delay-2">
            <h3>Quick Links</h3>
            <div className="stack" style={{ gap: '0.5rem' }}>
              <Link className="btn ghost" to="/admin/attendance" style={{ justifyContent: 'flex-start' }}>📋 Attendance &amp; QR Codes</Link>
              <Link className="btn ghost" to="/admin/certificates" style={{ justifyContent: 'flex-start' }}>🏆 Issue Certificates</Link>
              <Link className="btn ghost" to="/verify" style={{ justifyContent: 'flex-start' }}>🔍 Verify a Certificate</Link>
              <Link className="btn ghost" to="/events" style={{ justifyContent: 'flex-start' }}>📅 Manage Events</Link>
            </div>
          </article>

          <article className="glass card rise-up delay-3">
            <h3>Profile Snapshot</h3>
            <p className="meta">Logged in as</p>
            <p className="profile-value">{user.email}</p>
            <p className="meta">Role: {user.role}</p>
          </article>
        </section>
      </div>
    );
  }

  /* ─── STUDENT DASHBOARD ─── */
  return (
    <div className="page shell-bg home-page">
      <header className="topbar">
        <div>
          <p className="badge">College Club Management</p>
          <h1 className="title">Welcome back, {user.name || user.email}</h1>
          <p className="muted">Your one-stop portal for discovering clubs, events, and campus opportunities.</p>
        </div>
        <button className="btn ghost" onClick={handleLogout}>Logout</button>
      </header>

      <section className="hero-grid">
        <article className="glass card hero-main rise-up delay-1">
          <p className="hero-kicker">Build your semester intentionally</p>
          <h2 className="hero-heading">From discovery to registration in under a minute.</h2>
          <p className="hero-copy">Browse trending events, save your seat instantly, check in via QR, and earn verified certificates.</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/events">Explore Events</Link>
            <Link className="btn ghost" to="/attendance/checkin">Check In (QR)</Link>
            <Link className="btn ghost" to="/certificates">My Certificates</Link>
          </div>
          <div className="hero-stats">
            <div>
              <p className="metric">{registeredEvents.length}</p>
              <p className="meta">Registered events</p>
            </div>
            <div>
              <p className="metric">{attendanceRecords.length}</p>
              <p className="meta">Events attended</p>
            </div>
            <div>
              <p className="metric">{certificates.length}</p>
              <p className="meta">Certificates earned</p>
            </div>
          </div>
        </article>

        <article className="glass card hero-side rise-up delay-2">
          <h3>Flow At A Glance</h3>
          <ul className="clean-list">
            <li>Create your account with college email.</li>
            <li>Browse events by date and availability.</li>
            <li>Register in one click before seats fill up.</li>
            <li>Scan QR code at the event to check in.</li>
            <li>Receive verified certificates automatically.</li>
          </ul>
        </article>
      </section>

      <section className="home-cards">
        <article className="glass card rise-up delay-1">
          <h3>Your Registered Events</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : registeredEvents.length > 0 ? (
            <ul className="clean-list">
              {registeredEvents.map(reg => (
                <li key={reg.id} style={{ marginBottom: '0.8rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
                  <strong>{reg.eventTitle}</strong>
                  <br />
                  <span className="meta">{reg.eventDate} • Registered: {new Date(reg.registeredAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">You are not registered for any events yet.</p>
          )}
          <Link className="btn primary" to="/events" style={{ marginTop: '1rem' }}>Browse Events</Link>
        </article>

        <article className="glass card rise-up delay-2">
          <h3>Quick Actions</h3>
          <div className="stack" style={{ gap: '0.5rem' }}>
            <Link className="btn ghost" to="/attendance/checkin" style={{ justifyContent: 'flex-start' }}>📷 Scan QR &amp; Check In</Link>
            <Link className="btn ghost" to="/certificates" style={{ justifyContent: 'flex-start' }}>🏆 My Certificates</Link>
            <Link className="btn ghost" to="/verify" style={{ justifyContent: 'flex-start' }}>🔍 Verify a Certificate</Link>
            <Link className="btn ghost" to="/events" style={{ justifyContent: 'flex-start' }}>📅 Upcoming Events</Link>
          </div>
        </article>

        <article className="glass card rise-up delay-3">
          <h3>Profile Snapshot</h3>
          <p className="meta">Logged in as</p>
          <p className="profile-value">{user.email}</p>
          <p className="meta">Role: {user.role || 'STUDENT'}</p>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
