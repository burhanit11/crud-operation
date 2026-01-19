import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Signup User
const signup = asyncHandler(async (req, res) => {
    const { name, email, username, address, password } = req.body;

    // Validate input
    if (!name || !email || !username || !address || !password) {
        throw new ApiError(400, "All fields are required");
    }

    //  Check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new ApiError(409, "User already exists");
    }

    //  Create user
    const user = await User.create({
        name,
        email,
        username,
        address,
        password,
    });

    res.status(201).json(new ApiResponse(201, "Registration successful", user));
});

// get Users
const getUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, name } = req.query;

    const filter = {};
    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
            "Users fetched successfully"
        )
    );
});

// UPDATE user by ID
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, username, address } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name,
                email,
                username,
                address,
            },
        },
        {
            new: true,
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 4️⃣ Respond
    res.status(200).json(
        new ApiResponse(200, "User updated successfully", user)
    );
});

// DELETE user by ID
const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    //  Check if user exists
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //  Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, "User deleted successfully", null)
    );
});

export { signup, getUsers, deleteUser, updateUser };
