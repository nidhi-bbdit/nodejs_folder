var express = require('express');
var bodyParser = require('body-parser')
var multer = require('multer');
var app     = express();
var Promise = require('promise');
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
        registrationData.findOne({email:email})
        .then(function(result){
            console.log(result);
            if(result){
                res.json({message:'email already exists',  status:'200', errors:''});
            }
            else{
                const registration = new registrationData({name:name, email:email, password : password, phone_no : phoneno});
                registration.save()
                .then(() => {res.send('thank you for your registration !!');})
                .catch(() => {res.send('Sorry something went wrong !!');})
                message = 'Registered successfully';  
                status = '200';
                res.json({message:message,  status:status, errors:''}); 
            }
        })
        .catch(function(error){
            console.log(error);
        })
        
    }
    else{
        message = 'Errors occurred';                                                                                                                                                                                                            
        status = '401'; 
        res.json({message:message,  status:status, errors:errors.array()});  
    }
     
});

app.get('/signin', function(req, res){
    res.render('Signin', {title: 'Login Form'});
});

app.post('/signin', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    registrationData.findOne({email:email, password:password})
    .then(function(result){ 
        if(result != null){
            res.json({message:'logged in successfully',  status:'200'}); 
            console.log('logged in successfully ');
        }
        else{
            res.json({message:'email or password is wrong',  status:'200'});
            console.log('email or password is wrong');
        }
    })
    .catch(function(err){
        console.log(error);
    });
});


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        trim : true,
    },
    description:{
        type:String,
        trim : true,
    },
    content:{
        type:String,
        trim : true,
    },
});
const postData = mongoose.model('posts', postSchema);

app.get('/createPost', function(req, res){
    res.render('create_new_post');
});

app.post('/createPost', function(req, res){
    postData.findOne({title:req.body.title})
    .then(function(titleResult){
        if(titleResult){
            res.json({status:200, message:'Title already exits, try another one'});
        }
        else{
            const posts = new postData({title: req.body.title, description: req.body.description, content: req.body.content});
            posts.save()
            .then(function(result){
                res.json({status:200, message:'Your blog posted successfully'});
            })
        }
    })
    .catch(function(error){
        res.json({status:400, message:'Something went wrong', errors:error});
    });
});

app.get('/showPosts', function(req, res){
    postData.find()
    .then(function(result){
        res.render('show_posts', {result:result});
    })
    .catch(function(error){
        res.render('show_posts', {error:error});
    });
    
});

app.get('/deletePosts/:id', function(req, res){
   postData.deleteOne({_id:req.params.id})
   .then(function(result){
       res.json({status :200, message :'post deleted successfully'});
   })
   .catch(function(error){
        console.log(error);
        res.json({status :401, message : 'something went wrong!!!!'});
   });
})

app.get('/editPosts/:id', function(req, res){
    postData.findOne({_id : req.params.id})
    .then(function(result){
        res.render('update_post', {result:result});
    })
    .catch(function(error){
        console.log(error);
    });

});

 app.post('/updatePosts/:id', function(req, res){
    postData.find({$and:[{title:req.body.title}, {_id_not : req.params.id}]})
    .then(function(result){
        if(result !=''){
            res.json({status:200, message:'Title already exits, try another one'});
        }
        else{
            postData.update({_id:req.params.id}, {$set:{title: req.body.title, description: req.body.description, content: req.body.content}})
            .then(function(results){
                res.json({status:200, message:'Your blog posted successfully'});
            })

        }
    })
    .catch(function(error){
        res.json({status:400, message:'Something went wrong', errors:error});
    });
}); 

app.get('/imageUploads', function(req, res){
    res.render('image_upload');
});


const imageSchema = new mongoose.Schema({
    image:{
        type: String, 
    },
   
});
const imageData = mongoose.model('galleries', imageSchema);

var uploadDir=__dirname+'/uploads';
var images=Date.now()+'.jpg';
var storage=multer.diskStorage({
    destination:function(request, file, callback){
        callback(null, uploadDir);
    },
    filename:function(request, file, callback){
        console.log(file);
        callback(null, images);
    }
});
var upload=multer({storage:storage}).single('image');

app.post('/imageUploads', upload, function(req, res){
    console.log('image='+images);
    const imageDataSave  = new imageData({image: images});
    imageDataSave.save()
    .then(function(result){
        console.log('image uploaded successfully');
        res.redirect('/imageUploads');
    })
    .catch(function(error){
        console.log('some error occurred');
        res.redirect('/imageUploads');
    });
    

});

app.get('/showgallery', function(req, res){
    imageData.find()
    .then(function(result){
        console.log(result);
        res.render('show_gallery', {result:result});
    })
    .catch(function(error){
       console.log('some error occurred');
    })
    
});

app.listen(3000);