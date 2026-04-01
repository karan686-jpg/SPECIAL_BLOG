import express from 'express';
import {
    addBlog, addComment, deleteBlogById, getAllBlogs, 
    getBlogById, getBlogComments, togglePublish, generateAIContent,
    toggleLike, getAnalytics
} from '../controllers/blogController.js'
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js'

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);

blogRouter.post('/add-comment', addComment); // For public (with review) or logged in (direct approve)
blogRouter.post('/comments', getBlogComments);

// New interactive and analytics endpoints
blogRouter.post('/like', auth, toggleLike);
blogRouter.get('/user/analytics', auth, getAnalytics);

blogRouter.post('/generate-ai-content', auth, generateAIContent);

export default blogRouter;