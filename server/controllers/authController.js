const multer = require('multer');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage.jsx');
const path = require('path');
const fs = require('fs');
const io = require('socket.io');

// Register User
exports.register = async (req, res) => {
    const { firstname, lastname, email, password, file } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }

        const newUser = new User({ firstname, lastname, email, password, file });
        await newUser.save();
        console.log('register', newUser);
        res.status(201).json({ success: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ success: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch All Users
exports.fetch = async (req, res) => {
    try {
        const users = await User.find();
      
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Fetch  private chat
exports.chat_message = async (req, res) => {
    const { sender, senderID,receiver,receiverID } = req.query; 

    if (!sender || !senderID || !receiver || !receiverID ) {
        return res.status(400).json({ error: 'Sender and receiver are required' });
    }

    try {
        const messages = await ChatMessage.find({
            $or: [
                { sender, senderID, receiver,receiverID, },
                 { senderID: receiverID, receiverID: senderID },
            ],
        }).sort({ timestamp: 1 }); 

         console.log("message",messages) 
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



//multer file uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image', 'video', 'audio'];
    const fileType = file.mimetype.split('/')[0];

    if (allowedTypes.includes(fileType)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });

//  Chat Message
exports.message = [
    upload.single('media'),
    async (req, res) => {
        try {
            const { sender, senderID, receiver, receiverID,message } = req.body;
            let media = null;

           
            if (req.file) {
                media = {
                    mediaType: req.file.mimetype.split('/')[0],
                    url: req.file.path,
                };
            }

     
            if (!sender || !receiver || (!message && !media)) {
                return res.status(400).json({ error: 'Sender, recipient, and message/media are required' });
            }

            const chatMessage = new ChatMessage({
                sender,senderID,
                receiver,receiverID,
                message,
                media,
            });

            await chatMessage.save();
        

            res.status(201).json(chatMessage);
        } catch (error) {
            console.error('Error in backend message creation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
];
