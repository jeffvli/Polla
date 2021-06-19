const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const redisClient = require("../../utils/initRedis");
const errorMessage = require("../../utils/errorMessage");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).regex(/^\S+$/).alphanum(),
  password: Joi.string().min(7).max(64),
});

function generateToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRATION,
  });
}

function generateRefreshToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRATION,
  });
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const { value, error } = await registerSchema.validate({
    username: username,
    password: password,
  });

  if (error) {
    res.status(400).send(errorMessage(400, `${error.message}`));
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.findMany({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (user.length > 0) {
      res.status(409).send(errorMessage(409, `User already exists`));
    } else {
      await prisma.user
        .create({
          data: {
            username: username,
            password: hashedPassword,
          },
        })
        .then((user) => {
          const token = generateToken(user.id);
          res.json({ token: token });
        })
        .catch((err) => {
          res.status(400).json({ msg: err.message });
        });
    }
  }
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    const refreshToken = generateRefreshToken(req.user.id);

    redisClient.SET(req.user.id, refreshToken, "EX", 2592000, (err, reply) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      }
    });

    res.json({ token: token, refreshToken: refreshToken });
  }
);

router.delete(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      redisClient.DEL(req.user.id);
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(500).json(errorMessage(500, err.message));
    }
  }
);

router.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken === null) return res.sendStatus(401);
  //if (!redisClient.GET(userId)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return sendStatus(403);

    redisClient.GET(user.id, (err, result) => {
      if (err) {
        console.log(err.message);
        return res.sendStatus(500);
      }

      if (refreshToken !== result) {
        return res.sendStatus(403);
      }

      const token = generateToken(user.id);
      res.json({ token: token });
    });
  });
});

router.get(
  "/user",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      res.json({
        id: null,
        username: "nobody",
      });
    }

    res.json({
      id: req.user.id,
      username: req.user.username,
    });
  }
);

module.exports = router;
