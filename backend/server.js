require('dotenv').config();

const url = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(url).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));


app.use(express.json());
var api = require('./api');
api.setApp(app, mongoose);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

