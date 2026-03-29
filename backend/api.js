require('express');
require('mongodb');

const createJWT = require('./createJWTs');
const User = require('./models/user');

exports.setApp = function(app, mongoose){

    app.post('/api/login', async (req, res) => {

        try{
            const { email, password } = req.body;

            const user = await User.findOne({Email:email, Password:password});

            if(!user){
                return res.status(401).json({error: 'Invalid email or password'});
            }
            
            const token = createJWT.createToken(user.FirstName, user.LastName, user.id);

            if(token.error){
                return res.status(500).json({error: 'Error creating token'});
            }

            res.status(200).json(token);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    });
};