import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import FindDonor from "./Pages/FindDonor";
import RequestBlood from "./Pages/RequestBlood";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import RequestList from "./Pages/RequestList";
import BloodBanks from "./Pages/BloodBanks";
import Admin from "./Pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-donor" element={<FindDonor />} />
        <Route path="/request-blood" element={<RequestBlood />} />
        <Route path="/request" element={<RequestBlood />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/blood-banks" element={<BloodBanks />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
