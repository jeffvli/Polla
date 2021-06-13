const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const randomstring = require("randomstring");

const randomString = async () => {
  let str;
  let duplicateFound = true;

  do {
    str = await randomstring.generate({
      length: 10,
      charset: "alphanumeric",
    });

    let dupCheck = await prisma.poll.findUnique({
      where: {
        slug: str,
      },
    });

    if (dupCheck?.slug !== str) {
      duplicateFound = false;
    }
  } while (duplicateFound === true);

  return str;
};

module.exports = randomString;
