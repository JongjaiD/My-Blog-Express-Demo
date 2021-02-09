var express = require('express');
var router = express.Router();

const postController = require('../app/Http/Controllers/Auth/postController')
const authorizationMinddleware = require('../app/Http/Middlewares/authorization')
const commentController = require('../app/Http/Controllers/Auth/commentController')
const subCommentController = require('../app/Http/Controllers/Auth/subCommentController')
const tagController = require('../app/Http/Controllers/Auth/tagController')

router.post('/post',authorizationMinddleware, postController.create)
router.get('/posts', authorizationMinddleware, postController.shows)
router.get('/post/:slug', authorizationMinddleware, postController.show)
router.put('/post', authorizationMinddleware, postController.update)
router.delete('/post', authorizationMinddleware, postController.delete)
router.post('/post/comment', authorizationMinddleware, commentController.create)   //token into this 
router.put('/post/comment', authorizationMinddleware, commentController.update)
router.delete('/post/comment', authorizationMinddleware, commentController.delete)
router.post('/post/comment/subcomment', authorizationMinddleware, subCommentController.create)
router.put('/post/comment/subcomment', authorizationMinddleware, subCommentController.update)
router.delete('/post/comment/subcomment', authorizationMinddleware, subCommentController.delete)
router.post('/tag', authorizationMinddleware, tagController.create)

module.exports = router;