import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

function Events() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('clubUser') || 'null');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.email) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events');
        setEvents(response.data || []);
      } catch (error) {
        setMessage('Could not load events right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate, user?.email]);

  const totalSeats = useMemo(
    () => events.reduce((sum, event) => sum + (event.seatsAvailable || 0), 0),
    [events]
  );

  const registerForEvent = async (eventId) => {
    try {
      const response = await api.post(`/api/events/${eventId}/register`, { email: user.email });
      setMessage(response.data.message || 'Registration successful.');
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, seatsAvailable: Math.max((event.seatsAvailable || 0) - 1, 0) }
            : event
        )
      );
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (!user?.email) {
    return null;
  }

  return (
    <div className="page shell-bg">
      <header className="topbar">
        <div>
          <p className="badge">Event Hub</p>
          <h1 className="title">Upcoming Events</h1>
          <p className="muted">Open seats across all events: {totalSeats}</p>
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
              <p>{event.description}</p>
              <p className="meta">Seats left: {event.seatsAvailable}</p>
              <button
                className="btn primary"
                onClick={() => registerForEvent(event.id)}
                disabled={event.seatsAvailable < 1}
              >
                {event.seatsAvailable < 1 ? 'Sold Out' : 'Register'}
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Events;
