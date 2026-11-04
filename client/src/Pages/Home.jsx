import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Every Drop Counts. <span>Be a Lifesaver.</span>
          </h1>
          <p>
            Connect with donors and patients in need — quickly, safely, and
            for free.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Become a Donor
            </Link>
            <Link to="/request-blood" className="btn btn-outline">
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-box">
          <h2>12,500+</h2>
          <p>Registered Donors</p>
        </div>
        <div className="stat-box">
          <h2>3,200+</h2>
          <p>Lives Saved</p>
        </div>
        <div className="stat-box">
          <h2>45+</h2>
          <p>Cities Covered</p>
        </div>
        <div className="stat-box">
          <h2>24/7</h2>
          <p>Emergency Support</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Sign up as a donor with your blood group and city.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Search</h3>
            <p>Patients search for matching donors near them.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Connect</h3>
            <p>Contact the donor directly and coordinate the donation.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Save a Life</h3>
            <p>Your donation gives someone another chance at life.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to make a difference?</h2>
        <p>Join thousands of donors who are saving lives every day.</p>
        <Link to="/register" className="btn btn-primary">
          Join Now
        </Link>
      </section>
    </div>
  );
}

export default Home;