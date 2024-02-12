const express = require('express');
const { validatePost } = require('../middleware/validationMiddleWare');
const postController = require('../controllers/postControl');

const router = express.Router();

router.post('/', validatePost, postController.addNewPost);
router.get('/:postId', postController.getPostById);
router.get('/', postController.getPosts);
router.delete('/:postId', postController.deletePost);
router.patch('/:postId', postController.updatePost);

module.exports = router;