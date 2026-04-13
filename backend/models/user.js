
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePictureUrl:{
        type: String,
        required: false
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    followerCount:{
        type: Number,
        default: 0
    },
    followingCount:{
        type: Number,
        default: 0
    },
    postCount:{
        type: Number,
        default: 0
    },
    savedPosts:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Creation',
        default: []
    }
});

module.exports = mongoose.model('User', userSchema, 'users');