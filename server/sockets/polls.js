const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const emitPollResults = async (socket, slug) => {
  const poll = await prisma.poll.findUnique({
    where: {
      slug: slug,
    },
    include: {
      pollQuestions: {
        select: {
          question: true,
          pollResponses: {
            select: {
              ipAddress: true,
              username: true,
              sessionId: true,
            },
          },
        },
      },
    },
  });

  socket.emit("Responses", poll);
};

exports.emitPollResults = emitPollResults;
