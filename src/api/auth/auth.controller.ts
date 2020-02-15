import { Request, Response } from "express";

// // // //

// POST /api/auth/register
// { email, password }
export function register(req: Request, res: Response) {
    return res.status(200).json({ registered: true });
}

// // // //

// POST /api/auth/login
// { email, password }
export function login(req: Request, res: Response) {
    return res.status(200).json({ login: true });
}

// // // //

// POST /api/auth/forgot_password
export function forgot_password(req: Request, res: Response) {
    return res.status(200).json({ success: true });
}

// // // //

// POST /api/auth/reset_password
export function reset_password(req: Request, res: Response) {
    return res.status(403).json({ forbidden: true });
}
