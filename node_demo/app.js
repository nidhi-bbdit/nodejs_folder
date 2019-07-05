var express = require('express');
var bodyParser = require('body-parser')
const multer = require('multer');
var app     = express();
const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'))



mongoose.connect('mongodb://localhost/node_demo', { useNewUrlParser: true });
const RegistrationSchema = new  mongoose.Schema({
    name: {
        type: String,
        trim : true,
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    phone_no:{
      type: String,
      trim: true,  
    },
});
const registrationData = mongoose.model('users', RegistrationSchema);

app.get('/', function(req, res){
    res.send('welcome to node tutorial');
});

app.get('/querystringParameter/:name/:email/:phone_no', function(req, res){
    const userInstance    = new registrationData({name : req.params.name, email: req.params.email, phone_no: req.params.phone_no});
    var responseData = userInstance.save();
    console.log(responseData);
    if(responseData){
        res.send({name : req.params.name, email: req.params.email, phone_no: req.params.phone_no});
    }
    else{
        res.send('Something went wrong');
    }
});

app.get('/home', function(req, res){
    res.render('index', {title:'Express Home Page', page: 'A very beinner level node js using ejs'});
});

app.get('/signup', function(req, res){
    res.render('Signup', {title : 'Registration Form'});
});

app.post('/signup',[
    check('name').isLength({min:5}).withMessage('name must be 5 characters long'),
    check('email').isEmail().withMessage('email must be valid').isLength({min:2}).withMessage('email must be 5 characters long'),
    check('password').isLength({min:5}).withMessage('password must be 5 characters long'),
    check('phoneno').isLength({min:10}).withMessage('phone no must be 10 digit').matches(/\d/).withMessage('must contain a number'),

],  (req, res)=>{
    const errors = validationResult(req);
    var status = '';
    var message = '';
    if(errors.isEmpty()){
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var phoneno = req.body.phoneno;
        const registration = new registrationData({name:name, email:email, password : password, phone_no : phoneno});
        registration.save()
        .then(() => {res.send('thank you for your registration !!');})
        .catch(() => {res.send('Sorry something went wrong !!');})
        message = 'Data saved successfully';  
        status = '200';
        res.json({message:message,  status:status, errors:errors.array()});                                                                                                                                                                                                    
    }
    else{
        message = 'Errors occurred';                                                                                                                                                                                                            
        status = '401'; 
        res.json({message:message,  status:status, errors:errors.array()});  
    }
     
});

app.listen(3000);