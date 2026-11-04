import { useState } from "react";
import axios from "axios";
import "./RequestBlood.css";

function RequestBlood() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    bloodGroup: "",
    unitsRequired: "",
    hospital: "",
    city: "",
    contact: "",
    urgency: "Normal",
    neededBy: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Backend schema ke mutabiq keys map ki hain
      const payload = {
        patientName: formData.patientName,
        patientAge: formData.patientAge,
        bloodGroup: formData.bloodGroup,
        units: formData.unitsRequired,
        hospitalName: formData.hospital,
        city: formData.city,
        contactNumber: formData.contact,
        urgency: formData.urgency,
        neededBy: formData.neededBy,
        reason: formData.reason,
      };

      const res = await axios.post(
        'http://localhost:5000/api/request/create',
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      console.log("Blood Request Submitted:", res.data);
      alert("Your request has been submitted successfully! We hope for a quick match!");
      
      // Form reset
      setFormData({
        patientName: "",
        patientAge: "",
        bloodGroup: "",
        unitsRequired: "",
        hospital: "",
        city: "",
        contact: "",
        urgency: "Normal",
        neededBy: "",
        reason: "",
      });
    } catch (error) {
      console.error("Error submitting blood request:", error);
      alert(error.response?.data?.message || 'Error submitting request.');
    }
  };

  return (
    <div className="request-page">
      <div className="request-wrapper">
        {/* Left info panel */}
        <div className="request-info">
          <h1>Need Blood Urgently?</h1>
          <p>
            Submit a request and we'll connect you with verified donors
            near your location as fast as possible.
          </p>

          <div className="info-points">
            <div className="info-point">
              <span className="info-icon">⚡</span>
              <div>
                <h4>Fast Response</h4>
                <p>Requests are matched with donors within minutes.</p>
              </div>
            </div>
            <div className="info-point">
              <span className="info-icon">✅</span>
              <div>
                <h4>Verified Donors</h4>
                <p>Every donor is registered with valid contact details.</p>
              </div>
            </div>
            <div className="info-point">
              <span className="info-icon">📍</span>
              <div>
                <h4>Location-Based Matching</h4>
                <p>We prioritize donors closest to your hospital.</p>
              </div>
            </div>
          </div>

          <div className="helpline-box">
            <p>Emergency Helpline</p>
            <h3>1800-XXX-XXXX</h3>
          </div>
        </div>

        {/* Right form card */}
        <div className="request-card">
          <h2 className="request-title">Request Blood 🆘</h2>
          <p className="request-subtitle">Fill in the patient details below</p>

          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient's name"
                required
              />
              <p className="request-help-text">Enter the full name of the person who needs blood.</p>
            </div>

            <div className="form-group">
              <label>Patient Age</label>
              <input
                type="number"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleChange}
                placeholder="Patient's age"
                min="0"
                max="130"
                required
              />
              <p className="request-help-text">Enter the patient's age in years.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Blood Group Needed</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <p className="request-help-text">Choose the blood group requested by the patient's doctor.</p>
              </div>

              <div className="form-group">
                <label>How Many Units Needed?</label>
                <input
                  type="number"
                  name="unitsRequired"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  min="1"
                  required
                />
                <p className="request-help-text">Enter the number of blood units required.</p>
              </div>
            </div>

            <div className="form-group">
              <label>Hospital Name</label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="Enter hospital name"
                required
              />
              <p className="request-help-text">Enter the hospital where the patient is receiving care.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
                <p className="request-help-text">Enter the city where the hospital is located.</p>
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  required
                />
                <p className="request-help-text">Enter a 10-digit phone number donors can use to contact you.</p>
              </div>
            </div>

            <div className="form-group">
              <label>Needed By</label>
              <input
                type="date"
                name="neededBy"
                value={formData.neededBy}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="request-help-text">Select the date by which the blood is needed.</p>
            </div>

            <div className="form-group">
              <label>Reason for Request</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly explain why blood is needed"
                rows="4"
                maxLength="1000"
                required
              />
              <p className="request-help-text">Briefly describe the medical need for this request.</p>
            </div>

            <div className="form-group">
              <label>Urgency Level</label>
              <div className="urgency-options">
                {["Normal", "Urgent", "Critical"].map((level) => (
                  <label
                    key={level}
                    className={`urgency-pill ${
                      formData.urgency === level
                        ? "active " + level.toLowerCase()
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={formData.urgency === level}
                      onChange={handleChange}
                    />
                    {level}
                  </label>
                ))}
              </div>
              <p className="request-help-text">Choose how soon the patient needs the blood.</p>
            </div>

            <button type="submit" className="request-btn">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestBlood;