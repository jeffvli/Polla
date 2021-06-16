const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

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
  const {
    title,
    description,
    multipleAnswers,
    isOpen,
    isPrivate,
    questions,
    username,
  } = req.body;

  try {
    const questionData = questions
      ? questions.map((question) => {
          return { content: question.content || undefined };
        })
      : [];

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

  try {
    const selectedPoll = await prisma.poll.findUnique({
      where: {
        slug: slug,
      },
    });

    const responseData = await req.body.map((responseData) => {
      return {
        ipAddress: ipAddress,
        username: req.authenticated ? req.user.username : null,
        pollId: Number(selectedPoll?.id),
        pollQuestionId: Number(responseData.questionId),
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
