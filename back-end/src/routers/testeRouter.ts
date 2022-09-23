import { Router } from "express";
import * as testController from "../controllers/testsController";
import * as recController from "../controllers/recommendationController";

const testRouter = Router();

testRouter.post("/reset", testController.reset);
testRouter.post(
  "/recommendations/test",
  recController.recommendationController.insert
);

export default testRouter;
