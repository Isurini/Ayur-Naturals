
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type :String,
        required : true,
        unique : true,
    },
    firstName : {
        type :String,
        required : true,
    },

    lastName : {
        type :String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    isBlocked :{
        type : Boolean,
        default : false
    },
     type: {
        type: String,
        default: "user"
    },
    profilePicture :{
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRUzWgveTZvKLnB4mWPVrI_aB79KB-MLanMA&s"
    },

});

  const User = mongoose.model("users",userSchema);
  export default User;
  