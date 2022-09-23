import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export async function createRecommendation() {
  return {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=Ob6WqpC78hg",
  };
}

export async function populateDatabase() {
  const songs = [
    {
      name: "Stoned at the Nail Salon",
      youtubeLink: "https://www.youtube.com/watch?v=Ob6WqpC78hg",
    },
    {
      name: "Mariners Apartment Complex",
      youtubeLink: "https://www.youtube.com/watch?v=1uFv9Ts7Sdw",
    },
    {
      name: "For My Friends",
      youtubeLink: "https://www.youtube.com/watch?v=Wiyil92GUGs",
    },
  ];

  await prisma.recommendation.createMany({
    data: songs,
  });
}
