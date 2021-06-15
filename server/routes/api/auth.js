const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const errorMessage = require("../../utils/errorMessage");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20),
  password: Joi.string().min(7).max(64),
});

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
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      res.status(409).send(errorMessage(409, `User already exists`));
    } else {
      const newUser = await prisma.user
        .create({
          data: {
            username: username,
            password: hashedPassword,
          },
        })
        .then((user) => {
          const token = jwt.sign({ id: user.id }, "jwt_secret");
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
    const token = jwt.sign({ id: req.user.id }, "jwt_secret");
    res.json({ token: token });
  }
);

router.get(
  "/user",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      res.json({
        username: "nobody",
      });
    }

    res.json({
      username: req.user.username,
    });
  }
);

module.exports = router;
