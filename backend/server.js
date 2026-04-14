require('./config/loadEnv');
const mongoose = require('mongoose');
const app = require('./app');

const port = Number(process.env.PORT) || 5001;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch((err) => console.log('Connection error:', err));
