const dotenv = require("dotenv");
dotenv.config();
const JWT = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

function createTokenForUser(user){
  const payload = {
    _id : user._id,
    email : user.email,
    profileImage : user.profileImage,
    role : user.role,
  }
  const token = JWT.sign(payload , secret ,{
   expiresIn : '7d',
  });
  return token;
}

function validateToken(token){
  const payload = JWT.verify(token,secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
}