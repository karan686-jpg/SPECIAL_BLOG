import express from 'express';
import {
    addBlog, addComment, deleteBlogById, getAllBlogs, 
    getBlogById, getBlogComments, togglePublish, generateAIContent,
    toggleLike, getAnalytics, toggleReaction, aiBlogAssistant
} from '../controllers/blogController.js'
import upload from '../middleware/multer.js';
import auth, { optionalAuth } from '../middleware/auth.js'

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/user/analytics', auth, getAnalytics);
blogRouter.get('/:blogId', optionalAuth, getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);

blogRouter.post('/add-comment', optionalAuth, addComment);
blogRouter.post('/comments', getBlogComments);

// New interactive and analytics endpoints
blogRouter.post('/like', auth, toggleLike);
blogRouter.post('/react', auth, toggleReaction);

blogRouter.post('/generate-ai-content', auth, generateAIContent);
blogRouter.post('/ai-assist', auth, aiBlogAssistant);

export default blogRouter;
