const passport = require('passport');
const GitHubStrategy = require('passport-github2');
const local = require('passport-local');
const userModel = require('./dao/models/user.model.js');
const { createHash, isValidPassword } = require('./utils.js');

const LocalStrategy = local.Strategy

const initializePassport = () => {

  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const { firstName, lastName, email, age } = req.body

    // check if cart id will be generated automatically on register or should be generated later.
    try {
      const newUser = {
        firstName, lastName, email, age, cart: '',
        password: createHash(password)
      };
      const result = await userModel.create(newUser);
      return done(null, result);
    } catch (err) {
      return done('Error: ' + err);
    }
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username }).lean().exec();
      if (!user) return done(null, user); // user not found
      if (!isValidPassword(user, password)) return done(null, false) // invalid password
      return done(null, user); // success
    } catch (err) {
      return done('Error: ' + err); // server error
    }
  }))

  passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.553a92955263bb5f',
    clientSecret: '9c8e5eef2c44061d8929d51742364bb487869e21',
    callbackURL: "http://localhost:8080/api/session/githubcallback"
  },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        const user = await userModel.findOne({ email: profile._json.email }).lean().exec();
        if (user) return done(null, user);
        if (!profile._json.email) return done(null, false); // user account doesnt have email set
        const newUser = {
          firstName: profile._json.name,
          email: profile._json.email,
        };
        return done(null, newUser);
      } catch (err) {
        return done('Error: ' + err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  })
}

module.exports = initializePassport;
