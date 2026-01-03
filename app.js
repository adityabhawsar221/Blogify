const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const blog = require('./models/blog');
const {initCloudinary} = require('./services/cloudinary');

// Initialize environment variables
require('dotenv').config();
initCloudinary();
// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Set up EJS as the templating engine
app.set('view engine' , 'ejs');
app.set('views' , path.resolve('./views'));

// Middleware to parse request bodies and cookies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

//route for home page
app.get('/' , async(req , res)=>{
  const allblogs = await blog.find({});
   res.render('home', {
     user: req.user,
     blogs: allblogs,
   });
});

// Use user routes
app.use('/user' , userRoutes);
// Use blog routes
app.use('/blog' , blogRoutes);

// Start the server
app.listen(PORT, ()=>{
   console.log(`Server is running on port ${PORT}`);
})