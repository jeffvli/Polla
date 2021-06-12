const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

const errorMessage = require("../../utils/errorMessage");

// GET all polls
router.get("/", async (req, res) => {
  const polls = await prisma.poll.findMany();
  res.json(polls);
});

// Get a specific poll with questions
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const poll = await prisma.poll.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      pollQuestions: true,
    },
  });

  if (!poll) {
    return res
      .status(404)
      .send(errorMessage(404, `Poll with id ${id} does not exist`));
  }

  return res.json(poll);
});

// GET a specific polls' responses
router.get("/:id/responses", async (req, res) => {
  const { id } = req.params;

  const responses = await prisma.pollResponse.findMany({
    where: {
      pollId: Number(id),
    },
  });

  res.json(responses);
});

// POST a new poll with questions
router.post("/", async (req, res) => {
  const { title, description, multipleAnswers, isOpen, questions } = req.body;

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
      pollQuestions: {
        create: questionData,
      },
    },
  });

  res.json(newPoll);
});

// POST responses to a specific poll
router.post("/:id/responses", async (req, res) => {
  const { id } = req.params;
  const ipAddress = req.ipInfo.ip;

  const responseData = req.body.map((responseData) => {
    return {
      ipAddress: ipAddress,
      pollId: Number(id),
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
