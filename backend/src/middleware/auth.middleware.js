import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const protectRoute = async (req, res, next) => {
    try {
        // using cookie-parser middleware
        // Get the token from cookies
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token Provided!' });
        }

        // Verifying the token and decoding it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid token!' });

        // selecting everything except password too avoid sending password to client
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: 'Unauthorized - No user found!' });

        req.user = user; // adding a user to request object
        next(); // calling next middleware inside the protectRoute middleware

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}