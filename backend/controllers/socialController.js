const Creation = require('../models/creation');
const Follow = require('../models/follow');
const Interaction = require('../models/interaction');
const User = require('../models/user');
const List = require('../models/list');

exports.postCreation = async (req, res) => {
    try{     
        const {author_id, title, description, ingredients, instructions, tags, self_rating, image_urls, author_snippet} = req.body;
        const newCreation = new Creation({
            author_id,
            title,
            description,
            ingredients,
            instructions,
            tags,
            self_rating,
            image_urls,
            author_snippet
        });
        await newCreation.save();
        await User.findByIdAndUpdate({_id: author_id}, { $inc: { postCount: 1 }, $addToSet: { savedPosts: newCreation._id } });
        res.status(201).json({message: 'Creation posted successfully', postId: newCreation._id});
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

exports.getTrendingIngredients = async (req, res) => {
    try {
        const results = await Creation.aggregate([
            { $unwind: "$ingredients" },
            { $group: { _id: "$ingredients", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);
        const toProperCase = (str) => str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        res.status(200).json(results.map(r => ({ name: toProperCase(r._id), count: r.count })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getSuggestedPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        // Top-rated posts not authored by this user and not already saved
        const user = await User.findById(userId).select('savedPosts');
        const excluded = user ? [...(user.savedPosts || []).map(id => id.toString()), userId] : [userId];

        const posts = await Creation.find({ author_id: { $ne: userId } })
            .sort({ rating: -1 })
            .limit(20);

        // Filter out already-saved posts and pick top 3
        const filtered = posts
            .filter(p => !excluded.includes(p._id.toString()))
            .slice(0, 3);

        res.status(200).json(filtered);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createList = async (req, res) => {
    try {
        const { userId, name } = req.body;
        if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
        const list = new List({ user_id: userId, name: name.trim() });
        await list.save();
        res.status(201).json(list);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getLists = async (req, res) => {
    try {
        const { userId } = req.params;
        const lists = await List.find({ user_id: userId }).sort({ created_at: -1 });
        res.status(200).json(lists);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getListById = async (req, res) => {
    try {
        const { listId } = req.params;
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ error: 'List not found' });
        const posts = await Creation.find({ _id: { $in: list.posts } });
        res.status(200).json({ ...list.toObject(), posts });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.addToList = async (req, res) => {
    try {
        const { listId, postId } = req.body;
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ error: 'List not found' });
        if (list.posts.map(id => id.toString()).includes(postId)) {
            return res.status(400).json({ error: 'Post already in list' });
        }
        list.posts.push(postId);
        await list.save();
        res.status(200).json({ message: 'Added to list' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.removeFromList = async (req, res) => {
    try {
        const { listId, postId } = req.body;
        await List.findByIdAndUpdate(listId, { $pull: { posts: postId } });
        res.status(200).json({ message: 'Removed from list' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const { listId, userId } = req.body;
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ error: 'List not found' });
        if (list.user_id.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });
        await List.findByIdAndDelete(listId);
        res.status(200).json({ message: 'List deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId, userId } = req.body;
        const post = await Creation.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author_id.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });
        await Creation.findByIdAndDelete(postId);
        await User.findByIdAndUpdate(userId, { $inc: { postCount: -1 } });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.unsavePost = async (req, res) => {
    try {
        const { userId, postId } = req.body;
        await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
        res.status(200).json({ message: 'Post removed from saved' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const follows = await Follow.find({ follower_id: userId }).select('following_id');
        res.status(200).json(follows.map(f => f.following_id.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getFriendActivity = async (req, res) => {
    try {
        const { userId } = req.params;

        const follows = await Follow.find({ follower_id: userId });
        const followingIds = follows.map(f => f.following_id);

        if (followingIds.length === 0) {
            return res.status(200).json([]);
        }

        const posts = await Creation.find({ author_id: { $in: followingIds } })
            .sort({ created_at: -1 })
            .limit(20);

        const uniqueAuthorIds = [...new Set(posts.map(p => p.author_id.toString()))];
        const authors = await User.find({ _id: { $in: uniqueAuthorIds } }).select('firstName lastName username profilePictureUrl');
        const authorMap = Object.fromEntries(authors.map(a => [a._id.toString(), a]));

        const activity = posts.map(post => ({
            postId: post._id,
            postTitle: post.title,
            postRating: post.rating,
            createdAt: post.created_at,
            author: authorMap[post.author_id.toString()] ?? null,
        }));

        res.status(200).json(activity);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

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