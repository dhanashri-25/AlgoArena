import jwt from "jsonwebtoken";

export const middle = (req, res, next) => {
  const token = req.cookies?.token; // Extract JWT token from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.userId = decoded.id; // Extract user ID from token payload
    next(); // Pass control to next middleware
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};