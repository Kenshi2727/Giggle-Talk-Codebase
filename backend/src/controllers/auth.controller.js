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

export const login = (req, res) => {
    res.send("login route");
};

export const logout = (req, res) => {
    res.send("logout route");
};

