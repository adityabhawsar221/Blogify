const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { createTokenForUser } = require("../services/authentication");
const router = Router();

//route for user signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render("signin" ,
      { error : "Invalid email or password" }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("signin" ,
       { error : "Invalid email or password"}
    );
  }

  const token = createTokenForUser(user);

  return res.cookie("token", token, {
      httpOnly: true, 
    }).redirect("/");
});

//route for user signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  //check if user with email already exists

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User with this email already exists");
  }
  await User.create({
    fullName,
    email,
    password,
  });

  //redirect to signin page after successful signup
  return res.redirect("/");
});

//route for user logout
router.get("/logout" , (req,res)=>{
   return res.clearCookie('token').redirect('/');
});

module.exports = router;
