var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var database = require('./database/database');

var passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")

database();

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));

// Set layout
app.set('layout', 'layout')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
  res.render('index', {
    title: 'Blog Post App',
    app: {
      message: 'Welcome to my blog post app',
    }
  });
});

// Auth Routes

app.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('register');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret"); //once the user sign up
       }); 
    });
});

// Login Routes

app.get("/login", function(req, res){
    res.render("login");
})

// middleware
app.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req, res){
    res.send("User is "+ req.user.id);
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use('/blog', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // The following section handles errors generated by POST & PUT requests made when creating 
  // Or Updating the blog - Specifically if a Mongoose Validation Error is generated we want to 
  // ReRender our view on the Server with the relevant validation messages to provide a 'good' UX
  
  res.locals.message = err.message
  if (req.method === "POST" || req.method === "PUT" && err.name === 'ValidationError') {
    res.locals.post = req.body
    res.render('posts/new', {title: "New Blog Post"})
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
  
});

module.exports = app;
