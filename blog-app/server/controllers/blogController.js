import fs from 'fs'
import imagekit from '../config/imagekit.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            transformation: [{
                "format": "webp",
                "width": "1280",
                "quality": "auto",
            }]
        });

        const image = optimizedImageURL;
        
        let author = null;
        let authorName = "Admin";
        
        // If a standard user created this
        if (req.user) {
            author = req.user;
            const user = await User.findById(req.user);
            if (user) authorName = user.name;
        }

        await Blog.create({ title, subtitle, category, description, image, isPublished, author, authorName })
        res.json({
            success: true, message: "blog added successfully"
        })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 })
        res.json({ success: true, blogs })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } }, { new: true }).populate('author', 'name profileImage');

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
        const { blog, name, content, userId } = req.body;
        await Comment.create({ blog, name, content, user: userId, isApproved: true });
        return res.json({ success: true, message: "comment added successfully" })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).populate('user', 'name profileImage').sort({ createdAt: -1 })
        return res.json({ success: true, comments })

    } catch (error) {
        return res.json({ success: false, message: error.message }
        )
    }
}

export const toggleLike = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user;

        if (!userId) {
            return res.json({ success: false, message: "Must be logged in to like" });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) return res.json({ success: false, message: "Blog not found" });

        const index = blog.likes.indexOf(userId);
        if (index === -1) {
            blog.likes.push(userId);
        } else {
            blog.likes.splice(index, 1);
        }

        await blog.save();
        return res.json({ success: true, likes: blog.likes });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const blogs = await Blog.find({ author: userId });
        const totalViews = blogs.reduce((acc, curr) => acc + curr.views, 0);
        const totalLikes = blogs.reduce((acc, curr) => acc + curr.likes.length, 0);
        
        let mostPopularBlog = null;
        let maxViews = -1;

        blogs.forEach(b => {
            if (b.views > maxViews) {
                maxViews = b.views;
                mostPopularBlog = b;
            }
        });

        return res.json({ 
            success: true, 
            analytics: {
                totalViews,
                totalLikes,
                totalBlogs: blogs.length,
                mostPopularBlog
            }
        });
    } catch (error) {
         return res.json({ success: false, message: error.message });
    }
}

export const generateAIContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.json({ success: false, message: 'Please provide a prompt/title' });
        }

        const fallbackHtml = `
            <h2>Introduction to ${prompt}</h2>
            <p>Welcome to this comprehensive guide on <strong>${prompt}</strong>. In today's fast-paced digital world, understanding this topic is more important than ever.</p>
            <h3>Key Concepts</h3>
            <ul>
                <li><strong>Innovation:</strong> Driving forward with cutting-edge solutions.</li>
                <li><strong>Efficiency:</strong> Maximizing output while minimizing effort.</li>
                <li><strong>Adaptability:</strong> Staying resilient in a changing environment.</li>
            </ul>
            <p>When exploring the depths of this subject, we uncover fascinating insights that can transform the way we approach our daily tasks and overall strategy.</p>
            <h3>Conclusion</h3>
            <p>Mastering ${prompt} is a journey of continuous learning. Hopefully, this foundational overview provides you with the starting point you need!</p>
        `;

        // Check if API key exists
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return res.json({ success: true, content: fallbackHtml });
        }
        
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(`Write a comprehensive, engaging, and professional blog post about: "${prompt}". Please provide the response formatted as rich HTML using suitable tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc. Do NOT wrap the response in markdown code blocks, just return raw HTML string.`);
            
            let text = result.response.text();
            
            // In case the model still outputs markdown blocks
            if (text.startsWith("\`\`\`html")) {
                text = text.replace(/^\`\`\`html\n|\`\`\`$/g, "").trim();
            } else if (text.startsWith("\`\`\`")) {
                text = text.replace(/^\`\`\`\n|\`\`\`$/g, "").trim();
            }
            return res.json({ success: true, content: text });
        } catch (apiError) {
            console.error("AI API Error, falling back to mock content:", apiError.message);
            // Return fallback content instead of failing, as requested by user
            return res.json({ success: true, content: fallbackHtml });
        }

    } catch (error) {
        console.error("AI Error:", error);
        return res.json({ success: false, message: error.message });
    }
}