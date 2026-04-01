require('express');
require('mongodb');

const createJWT = require('./createJWTs');
const User = require('./models/user');
const crypto = require('crypto');
const Token = require('./models/token');
const { sendVerificationEmail } = require('./mailing/mailer.js');




async function findAccount(email, password = null){
    if(password){
        return await User.findOne({Email:email, Password:password});
    }
    return await User.findOne({Email:email});
};

exports.setApp = function(app, mongoose){
    

    app.post('/api/login', async (req, res) => {

        try{
            const { email, password } = req.body;

            const user = await findAccount(email, password);

            if(!user){
                return res.status(401).json({error: 'Invalid email or password'});
            }
            
            
            const userId = user.id;
            const fn = user.FirstName;
            const ln = user.LastName;


            if(!user.isVerified){
                return res.status(401).json({error: 'Email not verified'});
            }
            const token = createJWT.createToken(fn, ln, userId);
            if(token.error){
                return res.status(500).json({error: 'Error creating token'});
            }

            res.status(200).json(token);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    });




    app.post('/api/register', async (req, res) => {
        try{
            const { firstName, lastName, email, username, password } = req.body;

            const existingUser = await findAccount(email);  
            if(existingUser){
                return res.status(400).json({error: 'Email already in use'});
            }

            const newUser = new User({
                id: Date.now(),
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Username: username,
                Password: password,
                isVerified: false
            });

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const savedUser = await newUser.save();

            await new Token({
                userId: savedUser._id,
                token: verificationToken
            }).save();

            const url = `http://localhost:5001/api/verify/${verificationToken}`;
            
            await sendVerificationEmail(email, firstName, url);

            res.status(201).json({message: 'Check email to verify account!'});

        }catch(e){
            res.status(500).json({error: e.message});
        }
    });

    app.get('/api/verify/:token', async (req, res) => {

        try{
            const tokenDoc = await Token.findOne({token: req.params.token});

            if(!tokenDoc) return res.status(400).json({error: 'Invalid token'});

            await User.findByIdAndUpdate(tokenDoc.userId, {isVerified: true});
            await Token.deleteOne({_id: tokenDoc._id});

            res.status(200).json({message: 'Email verified successfully'});

        }catch(e){
            res.status(500).json({error: e.message});
        }

    });




    app.post('/api/deleteUser', async (req, res) => {
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
    });
};