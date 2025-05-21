import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);//generate salt
        const hashedPassword = await bcrypt.hash(password, salt);//hash password
        const newUser = new User({
            // fullName:fullName,if same can be written as fullName
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            //generate JWT token
            generateToken(newUser._id, res);//_id is auto generated in mongodb and res will have cookie
            await newUser.save();//save user to db

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isPasswordCorrrect = await bcrypt.compare(password, user.password);//compare password with hashed password
        if (!isPasswordCorrrect) return res.status(400).json({ message: "Invalid Credentials" });

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        // Clearing the cookie
        res.cookie('jwtToken', '', { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;//getting user id from req object that was added in protectRoute middleware

        if (!profilePic) return res.status(400).json({ message: "Please provide a profile picture!" });

        // cloudinary is a bucket where we can upload images
        // cloudinary returns a response with secure_url which is the url of the image
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // uploadResponse will have the url of the image

        //{new:true} will return the updated user otherwise by default it will return the old user
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });//new:true will return the updated user

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);//req.user is added in protectRoute middleware
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}