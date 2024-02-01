import { Router } from "express";
import usersController from "../controllers/userController";

export const UserRoutes = ({ masterDbConnection }) => {
  let router = Router();

  router.post("/", (req, res, next) => {
    usersController.createUserSession(req, res, next);
  });


  return router;
};
