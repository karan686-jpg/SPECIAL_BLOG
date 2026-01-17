import 'dotenv/config' // This is a special command that loads variables IMMEDIATELY
import express from 'express'
// ... then the rest of your imports



import cors from 'cors'
import connectDB from './config/db.js';
// import adminAuthRoutes from './routes/adminAuth.js'
import blogRouter from './routes/blogRoutes.js';
import adminRouter from './routes/adminRoutes.js';



const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// app.use('/api/admin',adminAuthRoutes);
app.use('/blogs',blogRouter);
app.get('/', (req, res) => {
    res.send('Api is working')
})
app.use('/api/admin',adminRouter)
app.use('/api/blog',blogRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running')
})