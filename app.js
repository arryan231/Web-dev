var express     =require("express");
var app         =express();
var mongoose    =require("mongoose");
var User        =require("./models/user")
var bodyparser  =require("body-parser");
var passport    =require("passport");
var locals      =require("passport-local");
var localm      =require("passport-local-mongoose");




mongoose.connect('mongodb://localhost:27017/crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(require("express-session")({
	
	secret:"web dev shit",
	resave: false,
	saveUninitialized:false
}));

app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended:true}));

passport.use(new locals(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
	
	res.render("home");
	
});

app.get("/signup",function(req,res){
	
	res.render("signup");
});

app.get("/show",isLoggedIn,function(req,res){
	
	res.render("show");
});

app.post("/signup",function(req,res){
	
	req.body.username
	req.body.password
	
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		
		if(err)
			{
				console.log(err)
				return res.render("signup");
			}
		else
			{
				passport.authenticate("local")(req,res,function(){
					
					res.redirect("/show");
				});
			}
	});
});


app.get("/login",function(req,res){
	
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	
	successRedirect:"/show",
	failureRedirect:"/login"
}));


app.get("/logout",function(req,res){
	
	req.logout();
	res.redirect("/");
});





//middle ware
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		{
			return next();
		}
	res.redirect("/login");
}


app.listen(3000,function(req,res){
	
	console.log("server start")
});