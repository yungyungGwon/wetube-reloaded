import express from "express";
import {edit, remove, logout, see} from "../controllers/userController";

const usersRouter = express.Router();
 
usersRouter.get("/logout", logout)
usersRouter.get("/edit", edit);
usersRouter.get("/delete", remove);
usersRouter.get(":id", see)

export default usersRouter;