import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    progress: {
        type: Map,
        of: new mongoose.Schema({
            moduleId: String,
            progress: Number,
            completed: Boolean,
        }, { _id: false })
    },
    avatarUrl: String,
},
    {
        timestamps: true,
    });

export default mongoose.model('User', UserSchema)
