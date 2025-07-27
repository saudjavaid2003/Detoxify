const fs = require('fs');
const https = require('https');
const express = require('express');
const env = require('dotenv');
const cors = require('cors');

// Load env variables
env.config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const todoRoutes = require('./routes/todo.routes');
const trackingRoutes = require('./routes/tracking.routes');

// DB Connection
const dbconnection = require('./config/db');
dbconnection();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/tracking", trackingRoutes);

app.get('/', (req, res) => {
    console.log('Server is running');
    res.send('Welcome to Detoxify API (HTTPS)');
});

// Read SSL Certificate and Key
const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Start HTTPS Server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server is running at https://localhost:${PORT}`);
});
