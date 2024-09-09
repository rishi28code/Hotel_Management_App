const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Person = require("./models/person");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // authentication logic here
    try {
      console.log("received credentials:", username, password);
      const user = await Person.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const isPasswordMatch = await user.comparePassword(password) // changed
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (error) {
      return done(error);
    }
  })
);
 module.exports = passport ;// exporting whole file as passport