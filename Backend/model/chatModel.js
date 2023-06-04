const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user_id: String,
    question: String,
    answer: String
})

const Chat = mongoose.model('chat',chatSchema);
module.exports = Chat;