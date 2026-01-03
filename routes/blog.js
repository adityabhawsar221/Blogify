const Router = require("express");
const router = Router();
const multer = require('multer');
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { uploadBufferToCloudinary } = require("../services/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/add-new", (req,res)=>{
  return res.render("addBlog", {
    user: req.user,
    
  });
})

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  let coverImageUrl;
  
  console.log("FILE:", req.file?.originalname, req.file?.size);

  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "blogging",
      resource_type: "image",
    });

    console.log("CLOUDINARY URL:", result.secure_url);

    coverImageUrl = result.secure_url;
  }

  const blog = await Blog.create({
    title,
    body,
    coverImageUrl,
    createdBy: req.user?._id,
  });

  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id" , async(req,res)=>{
  if (!req.user) {
    return res.redirect("/user/signin");
  }
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