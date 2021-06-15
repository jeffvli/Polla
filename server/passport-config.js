const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const authenticateUser = async (username, password, done) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user == null || user == undefined) {
    return done(null, false, { message: "No user with that name" });
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } catch (err) {
    return done(err);
  }
};

// For local auth
passport.use(
  new localStrategy({ usernameField: "username" }, authenticateUser)
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  return done(
    null,
    await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
  );
});

// For JWT auth
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwt_secret",
    },
    async (jwt_payload, done) => {
      await prisma.user
        .findUnique({
          where: {
            id: jwt_payload.id,
          },
        })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          message: "Token not matched";
        });
    }
  )
);

module.exports = passport;
