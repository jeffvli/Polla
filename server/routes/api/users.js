const express = require("express");
const router = express.Router();

const prisma = require("../../utils/initPrisma");
const errorMessage = require("../../utils/errorMessage");

router.get("/", async (req, res) => {
  const { username } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
      },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

module.exports = router;
