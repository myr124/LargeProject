
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
    },
    rating:{
        type: Number,
        enum : [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        default: 0
    },
    comments:{
        type: [String],
        required: false,
        default: []
    }


});

module.exports = mongoose.model('Creation', creationSchema, 'creations');