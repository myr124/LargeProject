const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Creation',
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('List', listSchema, 'lists');
