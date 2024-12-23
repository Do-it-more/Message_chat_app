const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);

// MongoDB connection
mongoose .connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true 
    })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
