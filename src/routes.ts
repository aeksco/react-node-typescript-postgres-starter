import { Router } from "express";
import { router as AuthRouter } from "./api/auth";
import { router as DirectorRouter } from "./api/director";

// // // //

// Defines Express.Router instance
export const router: Router = Router();

// Bootstrap API module routers
router.use("/auth", AuthRouter);
// router.use("/users", require("./api/user"));
router.use("/directors", DirectorRouter);
