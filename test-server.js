// Simple test server
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
    res.send('<h1>Server is working!</h1><p>Authentication system ready</p>');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas Connected' : 'Not configured'}`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
});
