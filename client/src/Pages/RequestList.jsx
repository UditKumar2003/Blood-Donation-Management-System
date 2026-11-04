import { useState, useEffect } from "react";
import axios from "axios";

function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/request/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setErrorMessage(error.response?.data?.message || "Unable to load your requests. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading your requests...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#b30000' }}>Track Your Blood Requests 🩸</h2>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {requests.length === 0 ? (
        <p>You have not submitted any blood requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} style={{ border: '1px solid #ddd', padding: '20px', margin: '15px 0', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Patient: {req.patientName}</h3>
            {req.patientAge != null && <p style={{ margin: '5px 0' }}><strong>Patient Age:</strong> {req.patientAge}</p>}
            <p style={{ margin: '5px 0' }}><strong>Blood Group:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{req.bloodGroup}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Units Required:</strong> {req.units}</p>
            <p style={{ margin: '5px 0' }}><strong>Hospital:</strong> {req.hospitalName}</p>
            {req.city && <p style={{ margin: '5px 0' }}><strong>City:</strong> {req.city}</p>}
            <p style={{ margin: '5px 0' }}><strong>Contact Number:</strong> {req.contactNumber}</p>
            <p style={{ margin: '5px 0' }}><strong>Urgency:</strong> {req.urgency || 'Normal'}</p>
            <p style={{ margin: '5px 0' }}><strong>Status:</strong> {req.status}</p>
            {req.neededBy && <p style={{ margin: '5px 0' }}><strong>Needed By:</strong> {new Date(req.neededBy).toLocaleDateString()}</p>}
            {req.reason && <p style={{ margin: '5px 0' }}><strong>Reason:</strong> {req.reason}</p>}
            {req.statusHistory?.length > 0 && (
              <details style={{ marginTop: '12px' }}>
                <summary>Request status history</summary>
                <ul>
                  {req.statusHistory.map((entry, index) => (
                    <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                      {entry.status} — {new Date(entry.changedAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RequestList;