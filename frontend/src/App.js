import React, { useState } from "react";

function App() {
  // Generate states
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [generatedCert, setGeneratedCert] = useState(null);

  // Verify states
  const [certificateId, setCertificateId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // Generate Certificate
  const generateCertificate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/certificates/generate?userId=${userId}&eventId=${eventId}`
      );
      const result = await response.json();
      setGeneratedCert(result);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify Certificate
  const verifyCertificate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/certificates/verify/${certificateId}`
      );
      const result = await response.json();

      if (result && result.certificateId) {
        setData(result);
        setError("");
      } else {
        setData(null);
        setError("❌ Invalid Certificate ID");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px", fontFamily: "Arial" }}>
      
      <h1>🎓 Certificate System</h1>

      {/* Generate Section */}
      <div style={{ border: "1px solid #ccc", padding: "20px", margin: "20px" }}>
        <h2>Generate Certificate</h2>

        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
        <br /><br />

        <button onClick={generateCertificate}>Generate</button>

        {generatedCert && (
          <div style={{ marginTop: "15px", color: "green" }}>
            <h3>✅ Certificate Generated</h3>
            <p><b>ID:</b> {generatedCert.certificateId}</p>
          </div>
        )}
      </div>

      {/* Verify Section */}
      <div style={{ border: "1px solid #ccc", padding: "20px", margin: "20px" }}>
        <h2>Verify Certificate</h2>

        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />
        <br /><br />

        <button onClick={verifyCertificate}>Verify</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {data && (
          <div style={{ marginTop: "15px" }}>
            <h3>📄 Certificate Details</h3>
            <p><b>User ID:</b> {data.userId}</p>
            <p><b>Event ID:</b> {data.eventId}</p>
            <p><b>Date:</b> {data.issueDate}</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;