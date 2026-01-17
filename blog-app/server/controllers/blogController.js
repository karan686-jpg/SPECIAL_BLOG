import fs from 'fs'
import imagekit from '../config/imagekit.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
export const addBlog = async (req, res) => {
    try {
        const { title, subtitle, description, category, isPublished } = JSON.parse(req.body.blog)
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: 'missing data' })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        //Upload to imagekit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: 'blogs'
        })
        // URL with basic transformations
        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            urlEndpoint: "https://ik.imagekit.io/karan12345",
            transformation: [{
                "format": "webp",
                "width": "1280",
                "quality": "auto",
            }]
        });


        const image = optimizedImageURL;
        await Blog.create({ title, subtitle, category, description, image, isPublished })
        res.json({
            success: true, message: "blog added successfully"
        })

    }

    catch (error) {
        res.json({ message: 'mistake' })
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" })
        }
        return res.json({ success: true, blog })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}



export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body
        await Blog.findByIdAndDelete(id)

        // Delete all comments associated with the blog
        await Comment.deleteMany({ blog: id })


        return res.json({ success: true, message: "blog deleted successfully" })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;

        await blog.save();
        return res.json({ success: true, message: "blog status updated successfully" })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content });
        return res.json({ success: true, message: "comment added for review" })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 })
        return res.json({ success: true, comments })

    } catch (error) {
        return res.json({ success: false, message: error.message }
        )
    }
}