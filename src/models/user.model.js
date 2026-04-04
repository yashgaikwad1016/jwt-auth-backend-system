import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [ true, "usesrname is required"],
        unique: [ true, "username must be unique"]
    },
    email: {
        type: String,
        required: [ true, "Email is required"],
        unique: [ true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "password is requried"],
    },
    verified: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("users", userSchema)

export default userModel;