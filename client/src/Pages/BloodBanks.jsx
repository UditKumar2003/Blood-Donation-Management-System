import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./BloodBanks.css";

const API = "http://localhost:5000/api";

function BloodBanks() {
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState("");
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForms, setReviewForms] = useState({});
  const [notice, setNotice] = useState("");
  const loggedIn = Boolean(localStorage.getItem("token"));

  const fetchBanks = useCallback(() => axios.get(`${API}/banks`, {
    params: city ? { city } : {},
  }), [city]);

  useEffect(() => {
    let active = true;
    fetchBanks()
      .then((response) => {
        if (active) setBanks(response.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load blood banks.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [fetchBanks]);

  const submitReview = async (event, bankId) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const review = reviewForms[bankId] || { rating: "5", comment: "" };
    try {
      await axios.post(
        `${API}/banks/${bankId}/reviews`,
        review,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNotice("Your review was submitted.");
      setReviewForms((current) => ({ ...current, [bankId]: { rating: "5", comment: "" } }));
      const response = await fetchBanks();
      setBanks(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit review.");
    }
  };

  return (
    <main className="banks-page">
      <h1>Blood Banks Near You</h1>
      <p className="banks-intro">Search admin-managed blood bank listings, read community reviews, and compare indicative prices.</p>
      <form className="banks-search" onSubmit={(event) => { event.preventDefault(); setError(""); setLoading(true); setCity(cityInput.trim()); }}>
        <label htmlFor="bank-city">City</label>
        <input id="bank-city" value={cityInput} onChange={(event) => setCityInput(event.target.value)} placeholder="Enter your city" />
        <button type="submit">Search</button>
        {city && <button type="button" className="banks-clear" onClick={() => { setError(""); setLoading(true); setCity(""); setCityInput(""); }}>Show all</button>}
      </form>

      {error && <p className="banks-notice error" role="alert">{error}</p>}
      {notice && <p className="banks-notice success" role="status">{notice}</p>}
      {loading ? <p>Loading blood banks…</p> : banks.length === 0 ? <p>No blood banks found{city ? ` in ${city}` : ""}. Check back later.</p> : (
        <div className="banks-list">
          {banks.map((bank) => {
            const reviews = bank.reviews || [];
            const average = reviews.length
              ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
              : null;
            const prices = bank.prices || {};
            return (
              <article className="bank-card" key={bank._id}>
                <div className="bank-heading">
                  <div>
                    <h2>{bank.name}</h2>
                    <p>{bank.address}, {bank.city}</p>
                    <p><a href={`tel:${bank.phone}`}>{bank.phone}</a></p>
                  </div>
                  <p className="bank-rating">{average ? `★ ${average} / 5 (${reviews.length})` : "No reviews yet"}</p>
                </div>

                <h3>Indicative price per unit</h3>
                {Object.keys(prices).length ? (
                  <ul className="bank-prices">
                    {Object.entries(prices).map(([group, price]) => (
                      <li key={group}><strong>{group}</strong> ₹{Number(price).toLocaleString("en-IN")}</li>
                    ))}
                  </ul>
                ) : <p>No prices listed. Contact the blood bank to confirm.</p>}
                <p className="price-disclaimer">Prices and availability may change. Call the blood bank to confirm current rates and stock.</p>

                <h3>Reviews</h3>
                {reviews.length ? reviews.map((review) => (
                  <div className="bank-review" key={review._id}>
                    <strong>{review.reviewer?.name || "User"} · {"★".repeat(review.rating)}</strong>
                    <p>{review.comment}</p>
                  </div>
                )) : <p>Be the first to share your experience.</p>}

                {loggedIn ? (
                  <form className="bank-review-form" onSubmit={(event) => submitReview(event, bank._id)}>
                    <label>Rating
                      <select
                        value={reviewForms[bank._id]?.rating || "5"}
                        onChange={(event) => setReviewForms((current) => ({
                          ...current,
                          [bank._id]: { ...(current[bank._id] || { comment: "" }), rating: event.target.value },
                        }))}
                      >
                        {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                      </select>
                    </label>
                    <label>Your review
                      <textarea
                        value={reviewForms[bank._id]?.comment || ""}
                        onChange={(event) => setReviewForms((current) => ({
                          ...current,
                          [bank._id]: { ...(current[bank._id] || { rating: "5" }), comment: event.target.value },
                        }))}
                        rows="3"
                        maxLength="1000"
                        required
                      />
                    </label>
                    <button type="submit">Submit Review</button>
                  </form>
                ) : <p><a href="/login">Log in</a> to leave a review.</p>}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default BloodBanks;
