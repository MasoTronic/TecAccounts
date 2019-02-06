const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1
    },
    surname: {
        type: String,
        minlength: 1
    },
    email: {
        type: String,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'email in incorrect'
        }
    },
    role:{
        type: String,
        minlength: 1
    },
    password: {
        type: String,
        require: true,
        minlength: 5
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'name', 'surname', 'email']);
}

UserSchema.methods.generateAuthToken = function(){
    console.log('in here')
    var user = this;
    console.log(JSON.stringify(user) + 'just found user');

    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access}, 'tec1ock');
    console.log(token+ "toekn received")
    user.tokens.push({access, token});
    console.log(user + 'added push')

   return user.save().then((res) => {
    console.log(JSON.stringify("tsa "+ res ));
        return token;
    }).catch((err)=> {
        console.log(JSON.stringify("this error is here" + err));
        return err;
    });
}

UserSchema.statics.findByToken = function(token){

    let User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'tec1ock')
        console.log(decoded);
    } catch (error) {
        return  Promise.reject('user does not exist');
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
   
}

UserSchema.pre('save', function(next) {

var user = this;
if(user.isModified('password'))
{
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(user.password,salt, (err, hash)=>{
        console.log(hash);
        user.password = hash;
        console.log(user.password + "going to cnext");
        next();
    })
});
}else{
    next();
}

});

var User = mongoose.model('UsersCollection', UserSchema);

module.exports = {User};