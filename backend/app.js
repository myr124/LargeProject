const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const socialRoutes = require('./routes/socialRoutes');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', socialRoutes);

module.exports = app;
