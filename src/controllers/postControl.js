const _ = require('lodash');
const objectId = require('mongoose').Types.ObjectId;
const constants = require('../utility/constants');
const {tutorModel, learnerModel} = require('../models/user');
const {postModel} = require('../models/post');

const addNewPost = async (req, res) => {
    try {
        const {title, description, est_price, isRemote} = req.body;
        const post = new postModel({
        title,
        description,
        est_price,
        isRemote,
        authorId: req.user.id,
        isDone,
        });
        const newPost = await post.save();
        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    }

const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find().populate('authorId', 'username');
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getPostById = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await postModel.findById(id).populate('authorId', 'username');
        if (post) {
            return res.status(200).json(post);
        }
        return res.status(404).json({message: 'Post not found'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updatePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description, est_price, isRemote, isDone} = req.body;
        const post = await postModel.findById(id);
        if (post) {
            post.title = title;
            post.description = description;
            post.est_price = est_price;
            post.isRemote = isRemote;
            post.isDone = isDone;
            await post.save();
            return res.status(200).json(post);
        }
        return res.status(404).json({message: 'Post not found'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await postModel.findById(id);
        if (post) {
            await post.remove();
            return res.status(200).json({message: 'Post deleted successfully'});
        }
        return res.status(404).json({message: 'Post not found'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    addNewPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
}