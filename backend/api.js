require('express');
require('mongodb');

const createJWT = require('./createJWTs');
const User = require('./models/user');



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
                Password: password
            });

            await newUser.save();

            res.status(201).json({message: 'User registered successfully'});

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