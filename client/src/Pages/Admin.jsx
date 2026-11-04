import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const API = "http://localhost:5000/api";
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const statuses = ["Pending", "Approved", "Rejected", "Fulfilled"];
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

function Admin() {
  const [requests, setRequests] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBankId, setEditingBankId] = useState("");
  const [bankForm, setBankForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    prices: Object.fromEntries(bloodGroups.map((group) => [group, ""])),
  });
  const [message, setMessage] = useState("");

  const fetchAdminData = useCallback(() => Promise.all([
    axios.get(`${API}/request/all`, { headers: authHeaders() }),
    axios.get(`${API}/banks`),
  ]), []);

  useEffect(() => {
    let active = true;
    fetchAdminData()
      .then(([requestsResponse, banksResponse]) => {
        if (!active) return;
        setRequests(requestsResponse.data);
        setBanks(banksResponse.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load admin data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [fetchAdminData]);

  const refreshAdminData = async () => {
    try {
      const [requestsResponse, banksResponse] = await fetchAdminData();
      setRequests(requestsResponse.data);
      setBanks(banksResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load admin data.");
    }
  };

  const updateStatus = async (id, status) => {
    setError("");
    try {
      await axios.patch(`${API}/request/${id}/status`, { status }, { headers: authHeaders() });
      await refreshAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update request status.");
    }
  };

  const updateBankForm = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("price-")) {
      const group = name.slice("price-".length);
      setBankForm((current) => ({
        ...current,
        prices: { ...current.prices, [group]: value },
      }));
      return;
    }
    setBankForm((current) => ({ ...current, [name]: value }));
  };

  const addBloodBank = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    const prices = Object.fromEntries(
      Object.entries(bankForm.prices)
        .filter(([, value]) => value !== "")
        .map(([group, value]) => [group, Number(value)])
    );

    try {
      const payload = { ...bankForm, prices };
      if (editingBankId) {
        await axios.put(`${API}/banks/${editingBankId}`, payload, { headers: authHeaders() });
        setMessage("Blood bank updated.");
      } else {
        await axios.post(`${API}/banks`, payload, { headers: authHeaders() });
        setMessage("Blood bank added.");
      }
      setEditingBankId("");
      setBankForm({
        name: "",
        address: "",
        city: "",
        phone: "",
        prices: Object.fromEntries(bloodGroups.map((group) => [group, ""])),
      });
      await refreshAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add blood bank.");
    }
  };

  const editBank = (bank) => {
    setEditingBankId(bank._id);
    setBankForm({
      name: bank.name,
      address: bank.address,
      city: bank.city,
      phone: bank.phone,
      prices: Object.fromEntries(
        bloodGroups.map((group) => [group, bank.prices?.[group] ?? ""])
      ),
    });
    document.getElementById("admin-bank-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteBank = async (bankId) => {
    if (!window.confirm("Delete this blood bank and its reviews?")) return;
    setError("");
    try {
      await axios.delete(`${API}/banks/${bankId}`, { headers: authHeaders() });
      setBanks((current) => current.filter((bank) => bank._id !== bankId));
      setMessage("Blood bank deleted.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete blood bank.");
    }
  };

  return (
    <main className="admin-page">
      <h1>Admin Panel</h1>
      <p className="admin-intro">Manage blood requests and blood-bank directory listings.</p>
      {error && <p className="admin-message error" role="alert">{error}</p>}
      {message && <p className="admin-message success" role="status">{message}</p>}

      <section className="admin-section">
        <h2>Blood Requests</h2>
        {loading ? <p>Loading requests…</p> : requests.length === 0 ? <p>No requests yet.</p> : (
          <div className="admin-request-list">
            {requests.map((request) => (
              <article className="admin-request" key={request._id}>
                <div>
                  <h3>{request.patientName} · {request.bloodGroup}</h3>
                  <p>{request.units} unit(s) · {request.hospitalName}, {request.city}</p>
                  <p>Requested by {request.requester?.name || "User"} · {request.urgency}</p>
                  <p>Needed by {new Date(request.neededBy).toLocaleDateString()}</p>
                </div>
                <label>
                  Status
                  <select
                    value={request.status}
                    onChange={(event) => updateStatus(request._id, event.target.value)}
                  >
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Manage Blood Banks</h2>
        {banks.length === 0 ? <p>No blood banks have been added.</p> : (
          <div className="admin-bank-list">
            {banks.map((bank) => (
              <article className="admin-bank-item" key={bank._id}>
                <div><strong>{bank.name}</strong><p>{bank.city} · {bank.phone}</p></div>
                <div className="admin-bank-actions">
                  <button type="button" onClick={() => editBank(bank)}>Edit</button>
                  <button type="button" className="delete" onClick={() => deleteBank(bank._id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section" id="admin-bank-form">
        <h2>Add a Blood Bank</h2>
        <p>Enter current indicative prices per unit in INR. Leave groups blank if no price is available.</p>
        <form className="admin-bank-form" onSubmit={addBloodBank}>
          <label>Blood bank name<input name="name" value={bankForm.name} onChange={updateBankForm} required /></label>
          <label>Address<input name="address" value={bankForm.address} onChange={updateBankForm} required /></label>
          <label>City<input name="city" value={bankForm.city} onChange={updateBankForm} required /></label>
          <label>Phone<input name="phone" type="tel" value={bankForm.phone} onChange={updateBankForm} required /></label>
          <fieldset className="admin-prices">
            <legend>Indicative price per unit (₹)</legend>
            {bloodGroups.map((group) => (
              <label key={group}>{group}
                <input
                  type="number"
                  name={`price-${group}`}
                  min="0"
                  step="0.01"
                  value={bankForm.prices[group]}
                  onChange={updateBankForm}
                  placeholder="Optional"
                />
              </label>
            ))}
          </fieldset>
          <button type="submit">{editingBankId ? "Save Changes" : "Add Blood Bank"}</button>
          {editingBankId && (
            <button type="button" className="admin-cancel" onClick={() => {
              setEditingBankId("");
              setBankForm({
                name: "",
                address: "",
                city: "",
                phone: "",
                prices: Object.fromEntries(bloodGroups.map((group) => [group, ""])),
              });
            }}>Cancel Edit</button>
          )}
        </form>
      </section>
    </main>
  );
}

export default Admin;
