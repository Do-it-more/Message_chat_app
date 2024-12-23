const express = require('express'); 
const router = express.Router();
const { register, login, fetch, chat_message, message,} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/getall',fetch);
router.get('/message',chat_message);

router.post('/message',message);

module.exports = router;
