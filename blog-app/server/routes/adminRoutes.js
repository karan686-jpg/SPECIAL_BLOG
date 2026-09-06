import express from 'express'
import { adminLogin } from '../controllers/adminController.js'
import { requireAdmin } from '../middleware/auth.js'
import { getAllBlogsAdmin } from '../controllers/adminController.js';
import { getAllComments } from '../controllers/adminController.js';
import { getDashboard } from '../controllers/adminController.js';
import { deleteCommentById } from '../controllers/adminController.js';
import { approveCommentById } from '../controllers/adminController.js';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin)
adminRouter.get('/blogs', requireAdmin, getAllBlogsAdmin)
adminRouter.get('/comments', requireAdmin, getAllComments)
adminRouter.get('/dashboard', requireAdmin, getDashboard)
adminRouter.post('/delete-comment', requireAdmin, deleteCommentById)
adminRouter.post('/approve-comment', requireAdmin, approveCommentById)


export default adminRouter
