import { Request, Response, NextFunction, RequestHandler } from "express";

export const authorizeRole = (role: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.user) {
      res.status(401).json({ error: "Unauthorized: No User Found" });
      return; // End the function with void
    }

    if(req.cookies.user.role==="ADMIN") {
      next();
      return; // End the function with void
    }

    if (req.cookies.user.role !== role) {
      res.status(403).json({ error: `Forbidden: You do not have permission , you must be an ${role}` });
      return; // End the function with void
    }

    next();
  };
};