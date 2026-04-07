const Creation = require('../models/creation');
const Follow = require('../models/follow');
const Interaction = require('../models/interaction');


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