import { NextFunction, Request, Response } from "express";
import { Secret, JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";

// Custom user type with consistent id field
type CustomUser = { id: string; role: string };
type CustomRequest = Request & {
  user?: CustomUser | null;
};

export default function optionalAuth(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwtHelpers.verifyToken(
      authHeader,
      config.jwt.secret as Secret
    ) as JwtPayload | string;

    console.log("Decoded JWT:", decoded);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "role" in decoded
    ) {
      req.user = {
        id: (decoded as any).userId,
        role: (decoded as any).role,
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
}
