import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
    });
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret999",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ragistration failed",
    });
  }
};

// export const register = async (req, res) => {
//   try {
//     const { email, password, fullName } = req.body;
//     console.log(req.body);
//     // Basic validation for required fields
//     if (!email || !password || !fullName) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check for existing user
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hashing the password
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const doc = new UserModel({
//       email,
//       passwordHash: hash,
//       fullName,
//     });
//     const user = await doc.save();

//     // JWT Token
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     const { passwordHash, ...userData } = user._doc;

//     res.json({ ...userData, token });
//   } catch (error) {
//     console.error(error); // Consider a more robust logging mechanism for production
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, "secret999", {
      expiresIn: "30d",
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User is not found!",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "some error",
    });
  }
};
