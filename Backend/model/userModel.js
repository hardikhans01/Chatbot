const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,'you must provide your email'],
        unique:true
    },
    password: {
        type: String,
        required: [true, 'password must be provided'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true,'Confirmation is required'],
        validate: {
            // works only for create and save command
            validator: function(el){
                return el===this.password;
            },
            message: 'Passwords are not the same'
        }
    }
})


userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

userSchema.pre('save',async function(next){
    // only run if the password was modified
    if(!this.isModified('password'))return next();

    // Hash the password with a cost of 12
    this.password = await bcrypt.hash(this.password,12);

    // delete confirm password field
    this.confirmPassword = undefined;
    next();
});



const User = mongoose.model('demoUser',userSchema);


module.exports = User;