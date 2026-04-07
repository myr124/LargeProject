// require('express');
// require('mongodb');
// const Creation = require('./models/creation');
// const Follow = require('./models/follow');
// const Interaction = require('./models/interaction');

// const createJWT = require('./utils/createJWTs.js');
// const User = require('./models/user');
// const crypto = require('crypto');
// const Token = require('./models/token');
// const { sendVerificationEmail } = require('./mailing/mailer.js');
// const bcrypt = require('bcrypt');





// async function findAccount(email){
//     return await User.findOne({email});
// };

// exports.setApp = function(app, mongoose){
    

//     app.post('/api/login', async (req, res) => {

//         try{
//             const { email, password } = req.body;

//             const user = await findAccount(email);

//             if(!user){
//                 return res.status(401).json({error: 'Invalid email.'});
//             }

//             const isMatch = await bcrypt.compare(password, user.password);
//             if(!isMatch){
//                 return res.status(401).json({error: 'Invalid password.'});
//             }

//             if(!user.isVerified){
//                 return res.status(401).json({error: 'Email not verified'});
//             }

//             const userId = user.id;
//             const fn = user.firstName;
//             const ln = user.lastName;
 
//             const token = createJWT.createToken(fn, ln, userId);
//             if(token.error){
//                 return res.status(500).json({error: 'Error creating token'});
//             }

//             res.status(200).json(token);
//         }catch(e){
//             res.status(500).json({error: e.message});
//         }
//     });




//     app.post('/api/register', async (req, res) => {
//         try{
//             const { firstName, lastName, email, username, password } = req.body;

//             const existingUser = await findAccount(email);  
//             if(existingUser){
//                 return res.status(400).json({error: 'Email already in use'});
//             }

//             const hashedPassword = await bcrypt.hash(password, 10);

//             const newUser = new User({
//                 id: Date.now(),
//                 firstName: firstName,
//                 lastName: lastName,
//                 email: email,
//                 username: username,
//                 password: hashedPassword,
//                 isVerified: false
//             });

//             const verificationToken = crypto.randomBytes(32).toString('hex');
//             const savedUser = await newUser.save();

//             await new Token({
//                 userId: savedUser._id,
//                 token: verificationToken
//             }).save();

//             const url = `http://localhost:5001/api/verify/${verificationToken}`;
            
//             await sendVerificationEmail(email, firstName, url);

//             res.status(201).json({message: 'Check email to verify account!'});

//         }catch(e){
//             res.status(500).json({error: e.message});
//         }
//     });

//     app.get('/api/verify/:token', async (req, res) => {

//         try{
//             const tokenDoc = await Token.findOne({token: req.params.token});

//             if(!tokenDoc) return res.status(400).json({error: 'Invalid token'});

//             await User.findByIdAndUpdate(tokenDoc.userId, {isVerified: true});
//             await Token.deleteOne({_id: tokenDoc._id});

//             res.status(200).json({message: 'Email verified successfully'});

//         }catch(e){
//             res.status(500).json({error: e.message});
//         }

//     });




//     app.post('/api/deleteUser', async (req, res) => {
//         try{
//             const { email, password } = req.body;

//             const user = await findAccount(email, password);

//             if(!user){
//                 return res.status(401).json({error: 'Invalid email or password'});
//             }

//             await User.deleteOne({Email:email, Password:password});

//             res.status(200).json({message: 'User deleted successfully'});

//         }catch(e){
//             res.status(500).json({error: e.message});
//         }
//     });

//     app.post('/api/postCreation', async (req, res)=>{
//         try{
            
//             const {author_id, title, description, ingredients, tags, self_rating, image_urls, author_snippet} = req.body;

//             const newCreation = new Creation({
//                 author_id,
//                 title,
//                 description,
//                 ingredients,
//                 tags,
//                 self_rating,
//                 image_urls,
//                 author_snippet
//             });

//             await newCreation.save();

//             res.status(201).json({message: 'Creation posted successfully'});
//         }catch(e){
//             console.error(e);
//             res.status(500).json({error: e.message});
//         }
//     });

//     app.post('/api/follow', async (req, res)=>{
//         try{
//             const {follower_id, following_id} = req.body;

//             const newFollow = new Follow({
//                 follower_id,
//                 following_id
//             });

//             await newFollow.save();
//             await User.findByIdAndUpdate({_id: follower_id}, {$inc: {followingCount: 1}});
//             await User.findByIdAndUpdate({_id: following_id}, {$inc: {followerCount: 1}});

//             res.status(201).json({message: 'Followed successfully'});
//         }catch(e){
//             console.error(e);
//             res.status(500).json({error: e.message});
//         }
//     });

//     app.post('/api/unfollow', async (req, res)=>{
//         try{
//             const {follower_id, following_id} = req.body;

//             await Follow.deleteOne({follower_id, following_id});
//             await User.findByIdAndUpdate({_id: follower_id}, {$inc: {followingCount: -1}});
//             await User.findByIdAndUpdate({_id: following_id}, {$inc: {followerCount: -1}});

//             res.status(200).json({message: 'Unfollowed successfully'});
//         }catch(e){
//             console.error(e);
//             res.status(500).json({error: e.message});
//         }
//     });

//     app.post('/api/interact', async (req, res)=>{
//         try{
//             const {user_id, creation_id, interaction_type} = req.body;

//             const newInteraction = new Interaction({
//                 user_id,
//                 creation_id,
//                 interaction_type
//             });
                
//             await newInteraction.save();

//             res.status(201).json({message: 'Interaction recorded successfully'});
//         }catch(e){
//             console.error(e);
//             res.status(500).json({error: e.message});
//         }
//     });

    
// };