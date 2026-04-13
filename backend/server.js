require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(5001, () => console.log('Server is running on port 5001'));
    })
    .catch((err) => console.log('Connection error:', err));
