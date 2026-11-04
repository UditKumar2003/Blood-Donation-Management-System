import { useState } from "react";
import "./FindDonor.css";

const dummyDonors = [
  { name: "Rahul Sharma", bloodGroup: "O+", city: "Bareilly", contact: "9876543210" },
  { name: "Priya Verma", bloodGroup: "A+", city: "Lucknow", contact: "9123456780" },
  { name: "Aman Singh", bloodGroup: "B-", city: "Bareilly", contact: "9988776655" },
  { name: "Neha Gupta", bloodGroup: "AB+", city: "Delhi", contact: "9090909090" },
  { name: "Vikas Yadav", bloodGroup: "O-", city: "Bareilly", contact: "9111222333" },
  { name: "Simran Kaur", bloodGroup: "A-", city: "Kanpur", contact: "9333444555" },
];

function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");

  const filteredDonors = dummyDonors.filter((donor) => {
    return (
      (bloodGroup === "" || donor.bloodGroup === bloodGroup) &&
      (city === "" || donor.city.toLowerCase().includes(city.toLowerCase()))
    );
  });

  return (
    <div className="finddonor-page">
      <h1 className="finddonor-title">Find a Donor</h1>
      <p className="finddonor-subtitle">
        Search donors by blood group and city
      </p>

      <div className="filter-bar">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <input
          type="text"
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="donor-grid">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor, index) => (
            <div className="donor-card" key={index}>
              <div className="donor-blood-badge">{donor.bloodGroup}</div>
              <h3>{donor.name}</h3>
              <p className="donor-city">📍 {donor.city}</p>
              <p className="donor-contact">📞 {donor.contact}</p>
              <button className="contact-btn">Contact Donor</button>
            </div>
          ))
        ) : (
          <p className="no-results">No donors found for this search.</p>
        )}
      </div>
    </div>
  );
}

export default FindDonor;