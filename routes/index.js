var express = require('express');
var router = express.Router();

const indexController = require('../app/Http/Controllers/indexController')
const registerController = require('../app/Http/Controllers/registerController')
const loginController = require('../app/Http/Controllers/loginController')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fat_Louis' });
});

router.post('/test', indexController.user)
router.post('/register', registerController.register)
router.post('/login',loginController.login)
router.get('/post/:slug', indexController.show)
router.get('/posts', indexController.shows)

module.exports = router;
