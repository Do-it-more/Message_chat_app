const mongoose = require('mongoose');
const path = require('path');

// extract time (HH:mm)
const getTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const chatMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    senderID:{
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    receiverID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },

    media: {
        type: {
            mediaType: {
                type: String,
                enum: ['image', 'video'],
                required: false
            },
            url: {
                type: String,
                required: function () {
                    return this.mediaType !== undefined;
                }
            }
        },
        default: null
    },
    timestamp: {
        type: String,
        default: getTime
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
