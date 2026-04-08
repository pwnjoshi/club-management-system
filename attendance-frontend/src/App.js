import { useState } from 'react';
import './App.css';

const API = 'http://127.0.0.1:8080';

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: color, borderRadius: 12, padding: '20px 28px',
      color: 'white', flex: 1, minWidth: 120, textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
    }}>
      <div style={{ fontSize: 36, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9 }}>{label}</div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('dashboard');
  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState('');
  const [status, setStatus] = useState('present');
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [searched, setSearched] = useState(false);

  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const total = records.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  const markAttendance = async () => {
    if (!userId || !eventId) {
      setMessage('Please enter both User ID and Event ID.');
      setMsgType('error');
      return;
    }
    try {
      const res = await fetch(`${API}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Attendance marked — User ${data.userId}, Event ${data.eventId}: ${data.status}`);
        setMsgType('success');
      } else {
        setMessage(`Error: ${data.error}`);
        setMsgType('error');
      }
    } catch {
      setMessage('Could not connect to server. Is Spring Boot running?');
      setMsgType('error');
    }
  };

  const fetchRecords = async () => {
    if (!userId) {
      setMessage('Please enter a User ID.');
      setMsgType('error');
      return;
    }
    try {
      const res = await fetch(`${API}/attendance/user/${userId}`);
      const data = await res.json();
      setRecords(data);
      setSearched(true);
      setMessage('');
    } catch {
      setMessage('Could not connect to server. Is Spring Boot running?');
      setMsgType('error');
    }
  };

  const navStyle = (t) => ({
    padding: '10px 24px',
    border: 'none',
    borderBottom: tab === t ? '3px solid #6c63ff' : '3px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontWeight: tab === t ? 700 : 400,
    color: tab === t ? '#6c63ff' : '#555',
    fontSize: 15,
    transition: 'all 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6c63ff, #3b82f6)', padding: '24px 40px', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Attendance System</h1>
        <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: 14 }}>Manage and track event attendance</p>
      </div>

      {/* Nav Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 40px', display: 'flex' }}>
        <button style={navStyle('dashboard')} onClick={() => setTab('dashboard')}>Dashboard</button>
        <button style={navStyle('mark')} onClick={() => setTab('mark')}>Mark Attendance</button>
      </div>

      <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 20px' }}>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Lookup User Attendance</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchRecords()}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15 }}
                />
                <button onClick={fetchRecords} style={{
                  padding: '10px 24px', background: '#6c63ff', color: 'white',
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 15
                }}>
                  Search
                </button>
              </div>
              {message && (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: 14,
                  background: msgType === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
                  {message}
                </div>
              )}
            </div>

            {searched && (
              <>
                {/* Stat Cards */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <StatCard label="Total Events" value={total} color="#6c63ff" />
                  <StatCard label="Present" value={present} color="#10b981" />
                  <StatCard label="Absent" value={absent} color="#ef4444" />
                  <StatCard label="Attendance %" value={`${pct}%`} color="#f59e0b" />
                </div>

                {/* Progress Bar */}
                <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Attendance Rate</span>
                    <span style={{ color: pct >= 75 ? '#10b981' : '#ef4444', fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: 99, height: 12 }}>
                    <div style={{
                      width: `${pct}%`, height: 12, borderRadius: 99,
                      background: pct >= 75 ? '#10b981' : '#ef4444',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                    {pct >= 75 ? 'Good attendance! Keep it up.' : 'Attendance below 75%. Needs improvement.'}
                  </p>
                </div>

                {/* Records Table */}
                {records.length > 0 ? (
                  <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb' }}>
                          <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>#</th>
                          <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>User ID</th>
                          <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Event ID</th>
                          <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((r, i) => (
                          <tr key={r.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '14px 20px', color: '#9ca3af', fontSize: 13 }}>{i + 1}</td>
                            <td style={{ padding: '14px 20px', fontWeight: 500 }}>{r.userId}</td>
                            <td style={{ padding: '14px 20px' }}>{r.eventId}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{
                                padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                                background: r.status === 'present' ? '#ecfdf5' : '#fef2f2',
                                color: r.status === 'present' ? '#065f46' : '#991b1b'
                              }}>
                                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ background: 'white', borderRadius: 12, padding: 40, textAlign: 'center', color: '#9ca3af', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                    No attendance records found for this user.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* MARK ATTENDANCE TAB */}
        {tab === 'mark' && (
          <div style={{ background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20 }}>Mark Attendance</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>User ID</label>
                <input placeholder="e.g. 1" value={userId} onChange={e => setUserId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Event ID</label>
                <input placeholder="e.g. 101" value={eventId} onChange={e => setEventId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, background: 'white' }}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <button onClick={markAttendance} style={{
                padding: '12px', background: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
                color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontWeight: 700, fontSize: 16, marginTop: 8
              }}>
                Mark Attendance
              </button>
              {message && (
                <div style={{
                  padding: '12px 16px', borderRadius: 8, fontSize: 14,
                  background: msgType === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: msgType === 'success' ? '#065f46' : '#991b1b'
                }}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;