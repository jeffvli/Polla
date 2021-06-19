const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const checkAuthenticated = require("../../middleware/checkAuthenticated");
const randomString = require("../../utils/randomString");
const errorMessage = require("../../utils/errorMessage");

// GET all polls
router.get("/", async (req, res) => {
  const polls = await prisma.poll.findMany();
  res.json(polls);
});

// Get a specific poll with questions
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const poll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
      include: {
        pollQuestions: true,
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
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    const responses = await prisma.pollResponse.findMany({
      where: {
        pollId: Number(selectedPoll?.id),
      },
    });

    res.json(responses);
  } catch (err) {
    res.status(500).json(errorMessage(500, `${err}`));
  }
});

// POST a new poll with questions
router.post("/", checkAuthenticated, async (req, res) => {
  const { title, description, multipleAnswers, isOpen, isPrivate, questions } =
    req.body;

  if (!req.authenticated && req.headers.authorization) {
    return res.sendStatus(401);
  }

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

    const newPoll = await prisma.poll.create({
      data: {
        title,
        description,
        multipleAnswers,
        isOpen,
        isPrivate,
        username: req.authenticated ? req.user.username : null,
        slug: await randomString(),
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
  const ipAddress = req.ipInfo.ip;

  if (!req.authenticated && req.headers.authorization) {
    return res.sendStatus(401);
  }

  try {
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    const existingPollResponses = await prisma.pollResponse.findMany({
      where: {
        pollId: Number(selectedPoll?.id),
      },
    });

    const duplicateUserOrIp = await existingPollResponses.filter(
      (responses) => {
        return (
          responses.ipAddress === ipAddress ||
          responses.username === req.user.username
        );
      }
    );

    // Prevent the same user from voting multiple times to a poll
    // Automatically replace the existing response if another is submitted
    if (duplicateUserOrIp.length > 0) {
      if (req.authenticated) {
        await prisma.pollResponse.deleteMany({
          where: {
            username: req.user.username,
            pollId: Number(selectedPoll?.id),
          },
        });
      }

      await prisma.pollResponse.deleteMany({
        where: {
          ipAddress: ipAddress,
          pollId: Number(selectedPoll?.id),
        },
      });
    }

    // If the request data is not an array, it will fail on the preceeding
    // map statement to pull the responses. This is to handle both single
    // and multiple response polls
    if (!Array.isArray(req.body)) {
      req.body = [].concat(req.body);
    }

    const responseData = await req.body.map((data) => {
      return {
        ipAddress: ipAddress,
        username: req.authenticated ? req.user.username : null,
        pollId: Number(selectedPoll?.id),
        pollQuestionId: Number(data.questionId),
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

module.exports = router;
