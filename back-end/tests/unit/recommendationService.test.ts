import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import * as recommendationFactory from "../factories/recommendationsFactory";

describe("POST /recommendations", () => {
  it("should post new song recommendation successfully", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce(() => null);
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});
    const recommendation = await recommendationFactory.createRecommendation();
    await recommendationService.insert(recommendation);
    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });
  it("should throw conflict error when recommendation already exists", async () => {
    const recommendation = await recommendationFactory.createRecommendation();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce({ id: 5, ...recommendation, score: 100 });
    const err = recommendationService.insert(recommendation);
    expect(err).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
  });
});
