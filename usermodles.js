const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      //   unique:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      required: true,
    },
    token:{
      type:String,
      default:'',
    }
  },
  { timestamps: true }
);
userSchema.pre("save",async function(next){
  if(this.isModified("password")){
      this.password=await bcrypt.hash(this.password,10);
  }
  next();

})

userSchema.methods.comparePass = async function(password){
  return await bcrypt.compare(password,this.password)
}


const User = mongoose.model("User", userSchema);

module.exports = User;
