var mongoose    =require("mongoose");
var localm      =require("passport-local-mongoose");

UserSchema=new mongoose.Schema({
	
	username:String,
	password:String
});

UserSchema.plugin(localm);

module.exports=mongoose.model("user",UserSchema);