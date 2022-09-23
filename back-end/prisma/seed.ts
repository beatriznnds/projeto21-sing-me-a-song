import { prisma } from "../src/database";

async function main() {
  const song = {
    name: "Oceanic Feeling",
    youtubeLink: "https://www.youtube.com/watch?v=QkOXRUW2jsE",
  };

  await prisma.recommendation.upsert({
    where: { name: song.name },
    update: {},
    create: song,
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
