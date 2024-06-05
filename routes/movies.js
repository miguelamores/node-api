import { Router } from "express";

export const moviesRouter = Router();

import { MovieController } from "../controllers/movies.js";

moviesRouter.get("/", MovieController.getAll);

moviesRouter.get("/:id", MovieController.getById);

moviesRouter.post("/", MovieController.create);

moviesRouter.delete("/:id", MovieController.delete);

moviesRouter.patch("/:id", MovieController.update);
