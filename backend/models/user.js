
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    id:{
        type: Number
    },
    FirstName:{
        type: String,
        required: true
    },
    LastName:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Username:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    ProfilePictureUrl:{
        type: String,
        required: false
    },
    isVerified:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema, 'users');