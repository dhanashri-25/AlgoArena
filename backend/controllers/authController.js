import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export const signup = async (req, res) => {
  try {
    const { name, username, email, password, confirmpassword } = req.body;

    if (!name || !username || !email || !password || !confirmpassword) {
      return res
        .status(400)
        .json({ message: "Details missing", success: false });
    }

    if (password.toString().trim() !== confirmpassword.toString().trim()) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", success: false });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already in use", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "abcd", { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Signup successful",
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ message: "Missing credentials", success: false });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, "abcd", { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

// User Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};
export const verify = (req, res) => {
  const istoken = req.cookies.token;
  if (!istoken) return res.json({ authenticated: false });
  try {
    const user = jwt.verify(istoken, "abcd");
    res.json({ authenticated: true, user });
  } catch {
    res.json({ authenticated: false });
  }
};
