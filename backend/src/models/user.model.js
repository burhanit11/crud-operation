import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            requried: true,
            index: true,
        },
        username: {
            type: String,
            requried: true,
            lowercase: true,
        },
        email: {
            type: String,
            requried: true,
        },
        password: {
            type: String,
            requried: true,
        },
        address: {
            type: String,
            requried: true,
        },
    },
    { timestamps: true }
);

// password Bcrypt
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// compare Password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(String(password), this.password);
};

export const User = mongoose.model("User", userSchema);
