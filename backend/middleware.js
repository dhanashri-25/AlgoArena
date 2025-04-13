// backend/middleware.js
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";

export const middle = async (req, res, next) => {
  try {
    // Get token from cookie
    console.log("reached at middleware");
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided, authentication failed" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user ID to request object
    req.userId = decoded.id;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};
