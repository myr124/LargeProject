const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    user_id:{
        type: Number,
        required: true
    },
    creation_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type:{
        type: String,
        enum: ['like', 'save'],
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});
