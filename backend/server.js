require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import cors
const mongoose = require('mongoose');
const leadRoutes = require('./routes/leadRoutes');

// Debug logging for environment variables
console.log('Environment variables loaded:');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured');
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'Not configured');

const app = express();

app.use(cors());             // Enable CORS for all origins by default
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leadsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/leads', leadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
