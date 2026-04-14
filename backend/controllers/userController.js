require('express');
require('mongodb');
require('../config/loadEnv');


const createJWT = require('../utils/createJWTs');
const User = require('../models/user');
const crypto = require('crypto');
const Token = require('../models/token');
const { sendVerificationEmail } = require('../mailing/mailer.js');
const bcrypt = require('bcrypt');


async function findAccount(email){
    return await User.findOne({email});
};

function getPublicApiBaseUrl() {
    return (
        process.env.PUBLIC_API_BASE_URL ||
        `http://localhost:${Number(process.env.PORT) || 5001}/api`
    );
}

function getFrontendBaseUrl() {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
}


exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await findAccount(email);

        if(!user){
            return res.status(401).json({error: 'Invalid email or password.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error: 'Invalid email or password.'});
        }

        if(!user.isVerified){
            return res.status(401).json({error: 'Email not verified'});
        }

        const userId = user.id;
        const fn = user.firstName;
        const ln = user.lastName;
 
        const token = createJWT.createToken(fn, ln, userId);
        if(token.error){
            return res.status(500).json({error: 'Error creating token'});
        }

        res.status(200).json(token);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };



exports.register = async (req, res) => {
    try{
        const { firstName, lastName, email, username, password } = req.body;

        const existingUser = await findAccount(email);  
        if(existingUser){
            return res.status(400).json({error: 'Email already in use'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            id: Date.now(),
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: hashedPassword,
            isVerified: false
        });

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const savedUser = await newUser.save();

        await new Token({
            userId: savedUser._id,
            token: verificationToken
        }).save();

        const url = `${getFrontendBaseUrl()}/verify/${verificationToken}`;
        try {
            await sendVerificationEmail(email, firstName, url);
        } catch (mailError) {
            await Token.deleteOne({ userId: savedUser._id });
            await User.deleteOne({ _id: savedUser._id });
            console.error('Verification email send failed:', mailError.message);
            return res.status(503).json({
                error: 'Unable to send verification email right now. Please try again later.'
            });
        }

        res.status(201).json({message: 'Check email to verify account!'});

    }catch(e){
        console.error('Register error:', e.message);
        res.status(500).json({error: e.message});
    } 
};

exports.verifyEmail = async (req, res) => {
    try{
        const tokenDoc = await Token.findOne({token: req.params.token});

        if(!tokenDoc) return res.status(400).json({error: 'Invalid token'});

        await User.findByIdAndUpdate(tokenDoc.userId, {isVerified: true});
        await Token.deleteOne({_id: tokenDoc._id});

        res.status(200).json({message: 'Email verified successfully'});

    }catch(e){
        res.status(500).json({error: e.message});
    }
};

exports.deleteUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await findAccount(email, password);

        if(!user){
            return res.status(401).json({error: 'Invalid email or password'});
        }

        await User.deleteOne({Email:email, Password:password});

        res.status(200).json({message: 'User deleted successfully'});

    }catch(e){
        res.status(500).json({error: e.message});
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId, firstName, lastName, username, profilePictureUrl } = req.body;

        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (username !== undefined) updates.username = username;
        if (profilePictureUrl !== undefined) updates.profilePictureUrl = profilePictureUrl;

        const updated = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select('-password');
        if (!updated) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getUserInfo = async (req, res) => {
    try{
        const userId = req.params.userId;

        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json(user);
    }catch(e){
        res.status(500).json({error: e.message});
    }
};




