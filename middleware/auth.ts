import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to include userId property
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// Middleware to verify the presence and validity of the JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    // Verify the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    // Handle token verification failure
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
