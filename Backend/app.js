const {Configuration} = require("openai");
const {OpenAIApi} = require("openai");
const express = require('express');
const cors = require('cors');
const userController = require('./controller/userController');
const userRouter = require('./routes/userRouter');
// const say = require('say');


const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
}))



const app = express();
app.use(cors());
app.use(express.json()); 

// say.speak("hello how are you");

// app.use('/signUp',userRouter);

app.use('/',userRouter)





module.exports = app;