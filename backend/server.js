require('dotenv').config();

const uri = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(uri).
then(() => console.log('Connected to MongoDB')).
catch((err) => console.log('Connection error:', err));

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));


app.use(express.json());
const userRoutes = require('./routes/userRoutes');
const socialRoutes = require('./routes/socialRoutes');

app.use('/api', userRoutes);
app.use('/api', socialRoutes);

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

