const express = require('express');
const verifyToken = require("../middleware/verifyToken");
const Blog = require ('../model/Blog')
const blogRouter = express.Router();

blogRouter.get('/getBlogs', async (req,res)=>{
    try {
        const blogs = await Blog.find({})
        return res.status(200).json(blogs)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

blogRouter.get('/find/:id', async (req,res)=>{
    try {
        const  blog = await Blog.findById(req.params.id)
        return res.status(200).json(blog)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

blogRouter.post('/',verifyToken, async(req,res)=>{
    try {
        const blog = await Blog.create({...req.body, userId: req.user.id})
        return res.status(201).json(blog)
    } catch (error) {
        return res.status(500).json(error.message)

    }
})

blogRouter.put('/updateBlog/:id', verifyToken, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (blog.userId !== req.user.id) {
        throw new Error('You can only update your own posts');
      }
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      return res.status(200).json(updatedBlog);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  

blogRouter.delete('/deleteBlog/:id', verifyToken, async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id)
        if(blog.userId !== req.user.id){
            throw new Error('You can only delete your own posts')
        }
       await Blog.findByIdAndDelete(req.params.id)
        return res.status(200).json({msg: 'Successfully deleted'})
    } catch (error) {
        return res.status(500).json(error.message)

    }
})

// Route to get only published blogs
blogRouter.get('/published', async (req, res) => {
  try {
    const publishedBlogs = await Blog.find({ status: 'published' });
    return res.status(200).json(publishedBlogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
blogRouter.get('/draft', async (req, res) => {
  try {
    const publishedBlogs = await Blog.find({ status: 'draft' });
    return res.status(200).json(publishedBlogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


  
module.exports = blogRouter;