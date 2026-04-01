const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({

    FollowerId:{
        type: Number,
        required: true
    },
    FolloweeId:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Follow', followSchema, 'follows');