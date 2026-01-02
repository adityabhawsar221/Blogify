const express = require('express');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const blog = require('./models/blog');
require('dotenv').config();
// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Uploads directory (local dev: ./public/uploads, production: set UPLOAD_DIR, e.g. Render Disk)
const uploadDir = process.env.UPLOAD_DIR || path.resolve('./public/uploads');
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
  console.error('Unable to create uploads directory:', uploadDir);
  console.error(err?.message || err);
  process.exit(1);
}

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
app.use('/uploads', express.static(uploadDir));

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