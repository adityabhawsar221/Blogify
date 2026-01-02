const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, 
    },
    email: { 
      type: String,
      required: true,
      unique: true
    },
    password : {
      type : String,
      required : true
    },
    profileImage : {
      type : String,
      default : '/images/defaultAvatar.png',
    },
    role : {
      type : String,
      enum : ['ADMIN' , 'USER'],
      default : 'USER',
    }
},{
  timestamps: true
});

userSchema.pre('save' , async function() {

  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(15);
  this.password = await bcrypt.hash(this.password , salt);
  

})

const User = mongoose.model('User' , userSchema);

module.exports = User;