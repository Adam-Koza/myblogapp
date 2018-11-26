var express = require('express');
var router = express.Router();
var postsController = require('../controllers/posts_controller');

// GET /blog/new
router.get('/new', postsController.new);

// GET all posts listings.
// GET /blog/
router.get('/', postsController.index);
router.get('/login', postsController.index);
router.get('/register', postsController.index);
// Get an Individual post listing

// GET /blog/:slug
router.get('/:slug', postsController.show);

// Create posts
// POST /blog

router.post('/', postsController.create);
router.post('/logout', postsController.create);
// TODO: Add Edit and Delete Requests


// Export routes
module.exports = router;