import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import * as recommendationFactory from "../factories/recommendationsFactory";

beforeEach(async () => {
  jest.resetAllMocks();
});

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

describe("voting on recommendations", () => {
  it("should be able to upvote recommendation", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 5,
      name: "So Happy I Could Die",
      youtubeLink: "test",
      score: 20,
    });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce(() => {
        return null;
      });
    await recommendationService.upvote(5);
    expect(recommendationRepository.find).toHaveBeenCalled();
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
  });
  it("shouldn't be able to upvote when recommendation id doesn't exist", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce(() => null);
    try {
      await recommendationService.upvote(+faker.random.numeric());
      fail();
    } catch (e) {
      expect(recommendationRepository.find).toBeCalled();
      expect(recommendationRepository.updateScore).not.toBeCalled();
      expect(e.type).toBe("not_found");
    }
  });
  it("should be able to downvote recommendation", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 10,
      name: "So Happy I Could Die",
      youtubeLink: "test",
      score: 40,
    });
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      id: 10,
      name: "So Happy I Could Die",
      youtubeLink: "test",
      score: 39,
    });
    await recommendationService.downvote(10);
    expect(recommendationRepository.find).toHaveBeenCalled();
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
  });
  it("shouldn't be able to downvote when recommendation id doesn't exist", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce(() => null);
    try {
      await recommendationService.downvote(+faker.random.numeric());
      fail();
    } catch (e) {
      expect(recommendationRepository.find).toBeCalled();
      expect(recommendationRepository.updateScore).not.toBeCalled();
      expect(e.type).toBe("not_found");
    }
  });
  it("should remove recommendation when reaches more than 5 downvotes", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 10,
      name: "So Happy I Could Die",
      youtubeLink: "test",
      score: -5,
    });
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      id: 10,
      name: "So Happy I Could Die",
      youtubeLink: "test",
      score: -6,
    });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce(async () => {});
    await recommendationService.downvote(10);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("GET /recommendations", () => {
  it("should be get all recommendations", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    const result = await recommendationService.get();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
  });
  it("should get recommendation with valid id", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 5,
      name: "So Happy I Could Die",
      youtubeLink: "test",
      score: 20,
    });
    const result = await recommendationService.getById(5);
    expect(recommendationRepository.find).toBeCalled();
    expect(result).toBeInstanceOf(Object);
  });
  it("shouldn't be able to get recommendation when id doesn't exist", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce(() => null);
    try {
      await recommendationService.getById(+faker.random.numeric());
      fail();
    } catch (e) {
      expect(recommendationRepository.find).toBeCalled();
      expect(e.type).toBe("not_found");
    }
  });
});

describe("should get random recommendations", () => {
  it("should get random recommendation when result is less than 0.7", async () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0.6);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([
      {
        id: 10,
        name: "So Happy I Could Die",
        youtubeLink: "test",
        score: 30,
      },
    ]);
    const recommendation = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
    expect(recommendation).toBeInstanceOf(Object);
  });
  it("should get random recommendation when result is less than 0.7", async () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0.8);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([
      {
        id: 10,
        name: "So Happy I Could Die",
        youtubeLink: "test",
        score: 1,
      },
    ]);
    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
  });
});
