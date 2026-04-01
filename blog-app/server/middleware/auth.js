import jwt from 'jsonwebtoken'

const auth = (req,res,next)=>{
    const token = req.headers.authorization ? req.headers.authorization.trim() : "";

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.id) {
            req.user = decoded.id; // For standard users
        } else {
            req.adminEmail = decoded.email; // For admins
        }
        next();
    }
    catch(error){
         res.json({
            success:false, message:"invalid token"
         })
    }
}
export default auth