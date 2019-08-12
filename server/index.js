const express = require('express');
const path = require('path');
const db = require('./db/connection');
const PORT = process.env.PORT || 8080;
const app = express();
const morgan = require('morgan');
const { Session, User } = require('./db/index');

// express session requirements
const SESH_SECRET = 'somegoodSecret'; // store in env file
const SESH_LIFETIME = 1000 * 60 * 60 * 2; // store in env file
const SESH_NAME = 'SID'; // store in env file
const expressSession = require('express-session');

// static middleware, body parsing middleware, logging middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // this helped me see req.body
app.use(morgan(process.env.MORGAN_MODE || null));

// middleware for session management
app.use(
  expressSession({
    name: SESH_NAME,
    secret: SESH_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: SESH_LIFETIME, // create env variable for SESH LIFETIME
      sameSite: true,
      secure: false, // if PROD change to true, create ENV var for this
    },
  })
);

app.use(async (req, res, next) => {
  const sid = req.session.id;

  if (req.session.userId) {
    console.log(
      'User already in memory:',
      req.session.userType,
      req.session.userId
    );
  } else {
    const [session] = await Session.findOrCreate({ where: { sid } });

    if (session.userId) {
      const user = await User.findByPk(session.userId);
      req.session.userId = user.id;
      req.session.userType = user.type;
      console.log(
        'Found user',
        session.userId,
        'req.session.userId:',
        req.session.userId,
        'req.userType:',
        req.session.userType
      );
    } else {
      const guestUser = await User.create();
      await session.update({ userId: guestUser.id });
      req.session.userId = guestUser.id;
      req.session.userType = guestUser.type;
      console.log('Guest user created', guestUser.id);
    }
  }

  next();
});
app.use(express.static(path.join(__dirname, '..', 'public')));

// 'API' routes
app.use('/api', require('./api'));

// send index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.use((error, req, res, next) => {
  res.status(404).send(error);
});

db.sync({force: process.env.DB_FORCE === 'true'})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on PORT: ${PORT}`);
    });
  })
  .catch(e => console.error(e));

module.exports = app;
