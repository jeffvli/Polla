const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const emitResponses = async (socket) => {
  const pollResponses = await prisma.pollResponse.findMany({
    where: {
      pollId: 9,
    },
  });

  socket.emit("Responses", pollResponses);
};

exports.emitResponses = emitResponses;
