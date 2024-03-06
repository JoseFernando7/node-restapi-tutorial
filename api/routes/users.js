const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/signup', UserController.signupUser);

router.post('/login', UserController.loginUser);

router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;
