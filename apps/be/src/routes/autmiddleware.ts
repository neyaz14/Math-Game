import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const JWT_SECRECT = process.env.JWT_SECRECT!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = verify(token, JWT_SECRECT) as {
      userId: string;
    };
    console.log("inside autmiddleware - decoded", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

