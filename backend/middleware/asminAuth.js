import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Login Again" })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(token_decode.id);
        
        if (!user || user.role !== 'admin') {
            return res.json({ success: false, message: "Access Denied. Admin only route." })
        }
        
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in admin authentication" })
    }
}

export default adminMiddleware;