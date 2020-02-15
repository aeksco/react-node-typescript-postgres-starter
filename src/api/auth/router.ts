import { Router } from "express";
import * as controller from "./auth.controller";

// // // //

// Defines Express.Router instance
export const router: Router = Router();

// POST /register
router.post("/register", controller.register);

// POST /login
router.post("/login", controller.login);

// POST /forgot_password
router.post("/forgot_password", controller.forgot_password);

// POST /reset_password
router.post("/reset_password", controller.reset_password);
