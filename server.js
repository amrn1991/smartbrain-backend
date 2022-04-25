const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleProfileGet } = require('./controllers/profile');
const { handleImage, handleApiCall } = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // db.select('*')
  //   .from('users')
  //   .then((data) => res.json(data));
  res.send('hello');
});
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db));
app.post('/signin', (req, res) => handleSignin(req, res, bcrypt, db));
app.post('/register', (req, res) => handleRegister(req, res, bcrypt, db));
app.post('/imageUrl', (req, res) => handleApiCall(req, res));
app.put('/image', (req, res) => handleImage(req, res, db));

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`app is running on port ${port}`));
