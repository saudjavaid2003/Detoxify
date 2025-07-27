const express = require('express');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const todoRoutes = require('./routes/todo.routes');
const trackingRoutes = require('./routes/tracking.routes');
// Load environment variables
env.config();

// DB connection
const dbconnection = require('./config/db');
dbconnection(); // ✅ Call the function to connect to MongoDB

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*', // Allow all origins for development; adjust in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Test route
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/tracking", trackingRoutes);

app.use
app.get('/', (req, res) => {
    console.log('Server is running');
    res.send('Welcome to Detoxify API');
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
