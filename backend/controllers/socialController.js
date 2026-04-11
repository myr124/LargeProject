const Creation = require('../models/creation');
const Follow = require('../models/follow');
const Interaction = require('../models/interaction');
const User = require('../models/user');

exports.postCreation = async (req, res) => {
    try{     
        const {author_id, title, description, ingredients, tags, self_rating, image_urls, author_snippet} = req.body;
        const newCreation = new Creation({
            author_id,
            title,
            description,
            ingredients,
            tags,
            self_rating,
            image_urls,
            author_snippet
        });
        await newCreation.save();
        await User.findByIdAndUpdate({_id: author_id}, {$inc: {postCount: 1}});
        res.status(201).json({message: 'Creation posted successfully'});
    }catch(e){
        console.error(e);
        res.status(500).json({error: e.message});
    }
};

exports.follow = async (req, res)=>{
try{
    const {follower_id, following_id} = req.body;

    const newFollow = new Follow({
        follower_id,
        following_id
    });

    await newFollow.save();
    await User.findByIdAndUpdate({_id: follower_id}, {$inc: {followingCount: 1}});
    await User.findByIdAndUpdate({_id: following_id}, {$inc: {followerCount: 1}});

    res.status(201).json({message: 'Followed successfully'});
    }
    catch(e){
        console.error(e);
        res.status(500).json({error: e.message});
    }
};


exports.unfollow = async (req, res)=>{
try{
    const {follower_id, following_id} = req.body;

    await Follow.deleteOne({follower_id, following_id});
    await User.findByIdAndUpdate({_id: follower_id}, {$inc: {followingCount: -1}});
    await User.findByIdAndUpdate({_id: following_id}, {$inc: {followerCount: -1}});

    res.status(200).json({message: 'Unfollowed successfully'});
    }catch(e){
        console.error(e);
        res.status(500).json({error: e.message});
    }
};

exports.interact = async (req, res)=>{
    try{
        const {user_id, creation_id, interaction_type} = req.body;

        const newInteraction = new Interaction({
            user_id,
            creation_id,
            interaction_type
        });
            
        await newInteraction.save();

        res.status(201).json({message: 'Interaction recorded successfully'});
    }catch(e){
        console.error(e);
        res.status(500).json({error: e.message});
    }
}

exports.rate = async(req, res)=>{
    try{
        const {user_id, post_id, rating} = req.body;
        if(rating > 5) return res.status(400).json({error: 'Rating must be between 0 and 5'});

        await Creation.findByIdAndUpdate({_id: post_id}, {$set: {rating}});
        console.log(`User ${user_id} rated creation ${post_id} with a rating of ${rating}`);

        res.status(200).json({message: 'Rating updated successfully'});
    }catch(e){
        console.error(e);
        res.status(500).json({error: e.message});
    }
}

exports.getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Creation.find({ author_id: userId });
        res.status(200).json(posts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.getPostsById = async (req, res) => {
    try {
        const { postId } = req.params;
        const posts = await Creation.find({ _id: postId });
        res.status(200).json(posts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Creation.find({});
        res.status(200).json(posts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.savePost = async (req, res) => {
    try{
        const {userId, postId} = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        if(user.savedPosts.includes(postId)){
            return res.status(400).json({error: 'Post already saved'});
        }

        user.savedPosts.push(postId);
        await user.save();

        res.status(200).json({message: 'Post saved successfully'});
    }catch(e){
        res.status(500).json({error: e.message});
    }
}

exports.comment = async(req, res) => {

    try{
        const {userId, postId, comment} = req.body;

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        const post = await Creation.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }

        post.comments.push(comment);
        await post.save();

        res.status(200).json({message: "User commented: " , comment});
    }
    catch(e){
        res.status(500).json({error: e.message});
        console.log(e);
    }
}