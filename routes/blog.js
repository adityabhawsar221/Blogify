const Router = require("express");
const router = Router();
const multer = require('multer');
const Blog = require("../models/blog");
const path = require('path');
const fs = require('fs');
const Comment = require("../models/comment");

const uploadDir = process.env.UPLOAD_DIR || path.resolve('./public/uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null , fileName); 
  }
})

const upload = multer({ storage:storage});

router.get("/add-new", (req,res)=>{
  return res.render("addBlog", {
    user: req.user,
    
  });
})

router.post("/" , upload.single('coverImage') , async(req,res)=>{
  const {title , body} = req.body;
  const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const blog = await Blog.create({
    title,
    body,
    coverImageUrl,
    createdBy: req.user?._id,
  });
  return res.redirect(`/blog/${blog._id}`);
})

router.get("/:id" , async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blogId : req.params.id}).populate('createdBy');
  return res.render("blog",{
    user : req.user,
    blog,
    comments,
  })
})

router.post('/comment/:blogId' , async(req,res)=>{
  
  const comment = await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user?._id,

  });

  return res.redirect(`/blog/${req.params.blogId}`);

})

module.exports = router;