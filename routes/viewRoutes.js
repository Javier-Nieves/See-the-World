const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.get('/me', authController.protect, viewsController.myProfile);

// router.use(authController.isLoggedIn);

router.get('/', viewsController.index);
router.get('/login', viewsController.login);
// router.get('/tours/:slug', viewsController.getTour);

module.exports = router;
