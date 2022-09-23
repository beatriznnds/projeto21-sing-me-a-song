import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import * as recFactory from "../factories/recommendationsFactory";
import * as recRepo from "../../src/repositories/recommendationRepository";
import { faker } from "@faker-js/faker";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe(`POST /recommendations`, () => {
  it(`should return 201 for valid params`, async () => {
    const song = await recFactory.createRecommendation();
    const result = await supertest(app).post("/recommendations").send(song);
    expect(result.status).toBe(201);
    const addedSong = await prisma.recommendation.findFirst({
      where: { name: song.name },
    });
    expect(addedSong.name).toBe(song.name);
  });

  it(`should return 409 when name is already used`, async () => {
    const song = await recFactory.createRecommendation();
    await supertest(app).post("/recommendations").send(song);
    const result = await supertest(app).post("/recommendations").send(song);
    expect(result.status).toBe(409);
  });

  it(`should return 422 when body format is wrong`, async () => {
    const song = await recFactory.createRecommendation();
    delete song.name;
    const result = await supertest(app).post("/recommendations").send(song);
    expect(result.status).toBe(422);
  });
});

describe(`POST /recommendations/:id/upvote`, () => {
  it(`should return 200 when video is upvoted`, async () => {
    const song = await recFactory.createRecommendation();
    await supertest(app).post("/recommendations").send(song);
    const recommendation = await prisma.recommendation.findFirst({
      where: { name: song.name },
    });
    const result = await supertest(app).post(
      `/recommendations/${recommendation.id}/upvote`
    );
    expect(result.status).toBe(200);
  });

  it(`should return 404 when video id doesn't exist`, async () => {
    const invalidId = faker.random.numeric(10);
    const result = await supertest(app).post(
      `/recommendations/${invalidId}/upvote`
    );
    expect(result.status).toBe(404);
  });
});

describe(`POST /recommendations/:id/downvote`, () => {
  it(`should return 200 when video is downvoted`, async () => {
    const song = await recFactory.createRecommendation();
    await supertest(app).post("/recommendations").send(song);
    const recommendation = await prisma.recommendation.findFirst({
      where: { name: song.name },
    });
    const result = await supertest(app).post(
      `/recommendations/${recommendation.id}/downvote`
    );
    expect(result.status).toBe(200);
  });

  it(`should return 404 when video id doesn't exist`, async () => {
    const invalidId = faker.random.numeric(10);
    const result = await supertest(app).post(
      `/recommendations/${invalidId}/downvote`
    );
    expect(result.status).toBe(404);
  });

  it(`should delete recommendation when score reaches -5`, async () => {
    const song = await recFactory.createRecommendation();
    for (let i = 0; i < 6; i++) {
      await supertest(app).post("/recommendations").send(song);
    }
    const songId = await recRepo.recommendationRepository.findByName(song.name);
    const result = await supertest(app).post(
      `/recommendations/${songId.id}/downvote`
    );
    expect(result.status).toBe(200);
  });
});

describe(`GET /recommendations`, () => {
  it(`should return recommendations and status 200`, async () => {
    const result = await supertest(app).get("/recommendations");
    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
  });
});

describe(`GET /recommendations/:id`, () => {
  it(`should return the searched recommendation and status 200`, async () => {
    const song = await recFactory.createRecommendation();
    await supertest(app).post("/recommendations").send(song);
    const recommendation = await prisma.recommendation.findFirst({
      where: { name: song.name },
    });
    const result = await supertest(app).get(
      `/recommendations/${recommendation.id}`
    );
    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
  });
  it(`should return 404 when id is invalid`, async () => {
    const invalidId = faker.random.numeric(10);
    const result = await supertest(app).get(`/recommendations/${invalidId}`);
    expect(result.status).toBe(404);
  });
});

describe(`GET /recommendations/random`, () => {
  it(`should return a random recommendation and status 200`, async () => {
    const song = await recFactory.createRecommendation();
    await supertest(app).post("/recommendations").send(song);
    const result = await supertest(app).get("/recommendations/random");
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
  });

  it(`should return 404 when there are no recommendations`, async () => {
    await prisma.recommendation.deleteMany({});
    const result = await supertest(app).get("/recommendations/random");
    expect(result.status).toBe(404);
  });
});

describe(`GET /recommendations/top/:amount`, () => {
  it(`should return list of top recommended songs and status 200`, async () => {
    await recFactory.populateDatabase();
    const result = await supertest(app).get(`/recommendations/top/3`);
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(3);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
