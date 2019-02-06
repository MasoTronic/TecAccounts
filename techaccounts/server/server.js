var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
const {User} = require('./db/models/User-model');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/',(req,res) => {
res.send('here is what impiwe the chop gets back')
    });

    app.post('/createUser', (req,res) => {
        // console.log(req.body.text['email'] + 'data received ' + req.body.text['password'])
        console.log(req.body);
        console.log(JSON.stringify(req.body));
        var user = new User(req.body);
        
        console.log("fdsgadfa" + user);
        user.isModified('password');
        user.save().then(()=>{
            console.log('saved')
           return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send(user);
        }).catch((err) => {
            console.log('error time');
            res.status(400).send("error happened " + err);
        });
    
        console.log(req.body);
    });

app.listen(port, () => {
    console.log(`port wide open: ${port}`);
});
