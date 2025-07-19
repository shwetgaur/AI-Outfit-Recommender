const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to our MongoDB database
connectDB();

// Initialize the Express app
const app = express();

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());
// Enable the express body parser to accept JSON
app.use(express.json());

// --- API Routes ---
// All routes related to wardrobe will be prefixed with /api/wardrobe
app.use('/api/wardrobe', require('./routes/wardrobeRoutes'));


// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
