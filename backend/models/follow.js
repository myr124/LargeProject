const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({

    follower_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    following_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Follow', followSchema, 'follows');