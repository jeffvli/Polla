const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

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

  return res.json(poll);
});

// GET a specific polls' responses
router.get("/:slug/responses", async (req, res) => {
  const { slug } = req.params;

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
});

// POST a new poll with questions
router.post("/", async (req, res) => {
  const { title, description, multipleAnswers, isOpen, isPrivate, questions } =
    req.body;

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
      slug: await randomString(),
      pollQuestions: {
        create: questionData,
      },
    },
  });

  res.json(newPoll);
});

// POST responses to a specific poll
router.post("/:slug/responses", async (req, res) => {
  const { slug } = req.params;
  const ipAddress = req.ipInfo.ip;

  const selectedPoll = await prisma.poll.findUnique({
    where: {
      slug: slug,
    },
  });

  const responseData = await req.body.map((responseData) => {
    return {
      ipAddress: ipAddress,
      pollId: Number(selectedPoll?.id),
      pollQuestionId: Number(responseData.questionId),
    };
  });

  await prisma.pollResponse.createMany({
    data: responseData,
    skipDuplicates: true,
  });

  res.json(responseData);
});

module.exports = router;
