const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const prisma = require("../../utils/initPrisma");
const checkAuthenticated = require("../../middleware/checkAuthenticated");
const randomString = require("../../utils/randomString");
const errorMessage = require("../../utils/errorMessage");

// GET all polls
router.get("/", checkAuthenticated, async (req, res) => {
  const { username, search, skip, take, sortBy, order } = req.query;
  const filterOrder = {};
  if (sortBy === "votes") {
    filterOrder.pollResponses = { count: order };
  } else {
    filterOrder[sortBy] = order;
  }

  const filter = {
    AND: [
      {
        username: {
          equals: username,
        },
      },
      {
        AND: [
          {
            OR: [
              {
                username: {
                  equals: search,
                  mode: "insensitive",
                },
              },
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      {
        isPrivate:
          req.authenticated && req.user.username === username ? void 0 : false,
      },
    ],
  };

  try {
    const polls = await prisma.poll.findMany({
      skip: Number(skip) || void 0,
      take: Number(take) || void 0,
      where: filter,
      select: {
        title: true,
        description: true,
        createdAt: true,
        isOpen: true,
        isPrivate: true,
        multipleAnswers: true,
        slug: true,
        username: true,
        dupCheckMode: true,
        _count: {
          select: {
            pollQuestions: true,
            pollResponses: true,
          },
        },
      },
      orderBy: filterOrder,
    });

    const pollCount = await prisma.poll.count({
      where: filter,
    });

    res.json({ count: pollCount, data: polls });
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

// Get a specific poll with questions
router.get("/:slug", checkAuthenticated, async (req, res) => {
  const { slug } = req.params;
  const { sessionId } = req.query;

  try {
    const poll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
      include: {
        pollQuestions: true,
        pollResponses: {
          where: {
            OR: [
              {
                username: {
                  equals: req.authenticated ? req.user.username : void 0,
                  mode: "insensitive",
                },
              },
              {
                sessionId: {
                  equals: sessionId,
                },
              },
            ],
          },
          select: {
            username: true,
            sessionId: true,
          },
        },
      },
    });

    if (!poll) {
      return res
        .status(404)
        .send(errorMessage(404, `Poll with slug ${slug} does not exist`));
    }

    res.json(poll);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

// GET a specific polls' responses
router.get("/:slug/responses", async (req, res) => {
  const { slug } = req.params;

  try {
    const responses = await prisma.pollResponse.findMany({
      where: {
        poll: {
          slug: slug,
        },
      },
    });

    res.json(responses);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

router.get("/:slug/results", async (req, res) => {
  const { slug } = req.params;
  try {
    const poll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
      include: {
        pollQuestions: {
          select: {
            id: true,
          },
        },
      },
    });

    const responses = await prisma.pollResponse.findMany({
      where: {
        poll: {
          slug: slug,
        },
      },
      select: {
        pollQuestionId: true,
        ipAddress: true,
        username: true,
        sessionId: true,
      },
    });

    const results = {};
    await poll.pollQuestions.map((q) => {
      let name = String(q.id);
      results[name] = 0;
      return q.id;
    });

    await responses.reduce((acc, pollRes) => {
      acc[pollRes.pollQuestionId]++;
      return acc;
    }, results);

    results.totalResponses = responses.length;
    if (poll?.dupCheckMode === "session") {
      results.uniqueResponders = _.uniqBy(responses, "sessionId").length;
    } else {
      results.uniqueResponders = _.uniqBy(responses, "ipAddress").length;
    }

    res.json({ responses: responses, results: results });
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

// POST a new poll with questions
router.post("/", checkAuthenticated, async (req, res) => {
  const {
    title,
    description,
    multipleAnswers,
    isOpen,
    isPrivate,
    questions,
    sessionId,
    dupCheckMode,
  } = req.body;

  try {
    const questionData = questions
      ? _.uniqBy(questions, "question").map((question) => {
          return { question: question.question || undefined };
        })
      : [];

    if (questionData.length < 2) {
      return res
        .status(422)
        .json(
          errorMessage(422, "A poll requires at least two unique questions.")
        );
    }

    if (dupCheckMode !== "ipAddress" && dupCheckMode !== "session") {
      return res
        .status(422)
        .json(errorMessage(422, "Invalid duplicate check mode."));
    }

    const newPoll = await prisma.poll.create({
      data: {
        title,
        description,
        multipleAnswers,
        isOpen,
        isPrivate,
        username: req.authenticated ? req.user.username : null,
        slug: await randomString(),
        sessionId,
        dupCheckMode,
        pollQuestions: {
          create: questionData,
        },
      },
    });

    res.json(newPoll);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

// POST responses to a specific poll
router.post("/:slug/responses", checkAuthenticated, async (req, res) => {
  const { slug } = req.params;

  if (
    (req.body.length > 1 && !req.body[0].sessionId) ||
    (req.body.length === undefined && !req.body.sessionId)
  ) {
    return res.status(422).json(errorMessage(422, "Missing sessionId value."));
  }

  try {
    const duplicateResponses = [];
    const ipAddress = req.ipInfo.ip;
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!selectedPoll.isOpen) {
      return res.status(422).json(errorMessage(422, "Poll is closed."));
    }

    const existingPollResponses = await prisma.pollResponse.findMany({
      where: {
        pollId: Number(selectedPoll?.id),
      },
    });

    // Check for username matches for existing poll responses
    // for both ip/session based checking
    for (const pr of existingPollResponses) {
      if (req.authenticated && pr.username === req.user.username) {
        duplicateResponses.push(pr);
      }
    }

    if (selectedPoll?.dupCheckMode === "ipAddress") {
      for (const pr of existingPollResponses) {
        if (await bcrypt.compare(ipAddress, pr.ipAddress)) {
          duplicateResponses.push(pr);
        }
      }
    } else {
      const duplicateSessions = await existingPollResponses.filter((pr) => {
        if (req.body.length > 0) return pr.sessionId === req.body[0].sessionId;
        return pr.sessionId === req.body.sessionId;
      });

      duplicateSessions.forEach((dup) => duplicateResponses.push(dup));
    }

    // Prevent the same user from voting multiple times to a poll
    // Automatically replace the existing response if another is submitted
    for (const pr of _.uniqBy(duplicateResponses, "id")) {
      await prisma.pollResponse.delete({
        where: {
          id: pr.id,
        },
      });
    }

    // If the request data is not an array, it will fail on the preceeding
    // map statement to pull the responses. This is to handle both single
    // and multiple response polls
    if (!Array.isArray(req.body)) {
      req.body = [].concat(req.body);
    }

    const hashedIp = await bcrypt.hash(ipAddress, 10);
    const responseData = await req.body.map((data) => {
      return {
        ipAddress: hashedIp,
        username: req.authenticated ? req.user.username : null,
        pollId: Number(selectedPoll?.id),
        pollQuestionId: Number(data.questionId),
        sessionId: data.sessionId,
      };
    });

    await prisma.pollResponse.createMany({
      data: responseData,
      skipDuplicates: true,
    });

    res.json(responseData);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

router.patch("/:slug/isPrivate", checkAuthenticated, async (req, res) => {
  const { slug } = req.params;

  if (!req.authenticated) {
    return res.sendStatus(403);
  }

  try {
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!selectedPoll) {
      return res.sendStatus(404);
    }

    if (selectedPoll.username !== req.user.username) {
      return res.sendStatus(403);
    }

    const updatedPoll = await prisma.poll.update({
      where: {
        slug: slug,
      },
      data: {
        isPrivate: selectedPoll.isPrivate ? false : true,
      },
    });

    res.json(updatedPoll);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

router.patch("/:slug/isOpen", checkAuthenticated, async (req, res) => {
  const { slug } = req.params;

  if (!req.authenticated) {
    return res.sendStatus(403);
  }

  try {
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!selectedPoll) {
      return res.sendStatus(404);
    }

    if (selectedPoll.username !== req.user.username) {
      return res.sendStatus(403);
    }

    const updatedPoll = await prisma.poll.update({
      where: {
        slug: slug,
      },
      data: {
        isOpen: selectedPoll.isOpen ? false : true,
      },
    });

    res.json(updatedPoll);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

router.delete("/:slug", checkAuthenticated, async (req, res) => {
  const { slug } = req.params;

  if (!req.authenticated) {
    return res.sendStatus(403);
  }

  try {
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!selectedPoll) {
      return res.sendStatus(404);
    }

    if (selectedPoll.username !== req.user.username) {
      return res.sendStatus(403);
    }

    const deleteResponses = prisma.pollResponse.deleteMany({
      where: {
        pollId: selectedPoll.id,
      },
    });

    const deleteQuestions = prisma.pollQuestion.deleteMany({
      where: {
        pollId: selectedPoll.id,
      },
    });

    const deletePoll = prisma.poll.delete({
      where: {
        slug: slug,
      },
    });

    await prisma.$transaction([deleteResponses, deleteQuestions, deletePoll]);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

module.exports = router;
