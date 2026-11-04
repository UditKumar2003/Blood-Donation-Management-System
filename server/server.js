const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');



app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/banks', bloodBankRoutes);

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Database connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
