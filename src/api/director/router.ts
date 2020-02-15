import { Router } from "express";
import * as controller from "./director.controller";

// // // //

// Defines Express.Router instance
export const router: Router = Router();

// All routes require authentication
// router.use(requireAuthenticated);

// GET /directors
router.get("/", controller.list);

// GET /directors/search
// router.get('/search', controller.search);

// POST /directors
router.post("/", controller.create);

// GET /directors/:id
router.get("/:id", controller.show);

// PUT /directors/:id
// router.put("/:id", requireAdmin, controller.update);
router.put("/:id", controller.update);

// DELETE /directors/:id
// router.delete("/:id", requireAdmin, controller.destroy);
router.delete("/:id", controller.destroy);
