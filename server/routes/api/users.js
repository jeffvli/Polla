const express = require("express");
const router = express.Router();

const prisma = require("../../utils/initPrisma");
const errorMessage = require("../../utils/errorMessage");
const checkAuthenticated = require("../../middleware/checkAuthenticated");

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

router.get("/profile", checkAuthenticated, async (req, res) => {
  const { username } = req.query;

  try {
    const polls = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            polls: true,
            pollResponses: true,
          },
        },
        polls: {
          take: 3,
          select: {
            title: true,
            description: true,
            createdAt: true,
            isOpen: true,
            isPrivate: true,
            multipleAnswers: true,
            slug: true,
            dupCheckMode: true,
            _count: {
              select: {
                pollResponses: true,
              },
            },
          },
          where: {
            isPrivate: {
              equals:
                req.authenticated && req.user.username === username
                  ? void 0
                  : false,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        pollResponses: {
          take: 3,
          select: {
            id: true,
            pollQuestion: {
              select: {
                question: true,
              },
            },
            poll: {
              select: {
                title: true,
                description: true,
                createdAt: true,
                isOpen: true,
                isPrivate: true,
                multipleAnswers: true,
                slug: true,
                dupCheckMode: true,
              },
            },
          },
          where: {
            poll: {
              isPrivate: {
                equals:
                  req.authenticated && req.user.username === username
                    ? void 0
                    : false,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          distinct: ["pollId"],
        },
      },
    });

    if (!polls) {
      return res.status(404).send(errorMessage(404, `User does not exist`));
    }

    res.json(polls);
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage(500, err));
  }
});

module.exports = router;
