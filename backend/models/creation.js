
const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema({
    
    author_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    ingredients:{
        type: [String],
        required: true
    },
    tags:{
        type: [String],
        required: false
    },
    self_rating:{
        type: Number,
        required: false
    },
    image_urls:{
        type: [String],
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    author_snippet:{
        type: Object,
        required: false
    }



});

module.exports = mongoose.model('Creation', creationSchema, 'creations');