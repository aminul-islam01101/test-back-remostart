const express = require('express');
const { createUser, getAllUser, getUserById } = require('../controllers/user.controller');

const router = express.Router();

// create user using POST method
// router.post('/', createUser);
router.put('/:email', createUser);

// get all user using GET method
router.get('/', getAllUser);

// get single user using GET method
router.get('/:id', getUserById);

module.exports = router;
