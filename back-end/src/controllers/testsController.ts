import { Request, Response } from "express";
import { recommendationRepository } from "../repositories/recommendationRepository";

export async function reset(req: Request, res: Response) {
  await recommendationRepository.reset();
  res.sendStatus(200);
}
