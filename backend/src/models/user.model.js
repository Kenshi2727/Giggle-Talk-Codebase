import mongoose from "mongoose";

//takes argument as an object
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,// adds createdAt and updatedAt fields
    }
);

// Create a model from the schema for the collection
const User = mongoose.model("User", userSchema);

export default User;