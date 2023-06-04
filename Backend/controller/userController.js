const {Configuration} = require("openai");
const {OpenAIApi} = require("openai");
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const Chat = require('./../model/chatModel');
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
}))

class AppError extends Error {
    constructor(message, statusCode) {
      
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
}


exports.send_data = async (req,res) => {
    console.log(req.body.data.id, " -> body")
    
    // const ur = await User.findById(req.params.id);
    // User.updateOne(ur.chat,"hello");

    openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages: [{role:"user",content:req.body.data.id}]
    }).then(async (rs) =>{
        // console.log(rs.data.choices[0].message.content,' -> res')
        rsp = rs.data.choices[0].message.content;
        Chat.insertMany([
            {
                user_id: req.params.id,
                question: req.body.data.id,
                answer: rsp
            }
        ]);
        // say.speak(rsp);
        res.status(200).json({
            data:{rsp}
        })
        console.log(rsp, " -> res");
    })


    // let rsp = "response from backend";
    
    // res.status(200).json({
    //     status:"ok",
    //     data:{rsp}
    // });
}

exports.signup = ( async(req,res,next) => {
    console.log("in sign up function");
    // console.log(req.body);
    const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    }); // or User.save

    createSendToken(newUser,201,res);
    next();
});


const signToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECURITY_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


const createSendToken = (user,statusCode,res) => {
    const token = signToken(user._id);
    // console.log(token, " token");
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if(process.env.NODE_ENV ==='production')cookieOptions.secure = true;

    res.cookie('jwt',token,cookieOptions);

    //  to remove user password
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}






exports.signOut = (async (req,res,next) => {
    res.clearCookie('nToken');
    console.log(res.cookie[0])
    next();
})


exports.login = ( async (req,res,next) => {
    console.log("login function");
    const {email,password} = req.body;

    //  1.  check if email and password exists
    //  2.  check if user exist and password is correct
    //  3.  if everything ok send token to client

    if(!email || !password){
        return next(new AppError('please provide email and password',400));
    }
    else{
        const user = await User.findOne({email}).select('+password');
        // console.log(user._id)
        // console.log(user);

        if(!user || !await user.correctPassword(password,user.password))return next();

        createSendToken(user,201,res);
    }
});



exports.protect = (async (req,res,next) => {
    //  1.  Getting token and check if it's there
    // console.log(req.query);
    let token;
    // console.log('protect');
    // console.log(req.headers)

    const rq_split = req.headers.header.split(' ');
    // console.log(rq_split)
    
    if(rq_split[0].split(':')[0]=='Authorization' && rq_split[1]=='Bearer'){
        token = rq_split[2];
        // console.log(token," -> token")
    }

    // token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    if(!token){
        return next(new AppError('You are not logged in ! please log in to get access',401));
    }
    // console.log("point 1 completed")
    //  2.  Verification token  
    
        // console.log(token)
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECURITY_KEY);
        // console.log(decoded," -> decoded") 
    // console.log(await User.find())
       
    // console.log("point 2 completed");
    //  3.  Check if user still exists
    // console.log(User.find())
    // try{
        const currentUser = await User.findById(decoded.id);
    // }catch(err){
    //     console.log(err,"user not found")
    // }
    
    // console.log(currentUser, '-> current user');
    if(!currentUser){
        return next(new AppError('user belong to this id , no longer exists',401));
    }
    // console.log("point 3 completed")
    //  4.  Check if user changed password after token was issued.
  

    //  Grant access to protected routes
    req.user = currentUser;
    req.params.id = decoded.id;
    next();
});