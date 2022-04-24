const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
  },
});

db.select('*')
  .from('users')
  .then((data) => console.log(data));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then((data) => res.json(data));
});

app.get('/profile/:id', (req, res) => {
  db.select('*')
    .from('users')
    .where({ id: req.params.id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(400).json('user not found!');
    })
    .catch((err) => res.status(404).json('error getting user!'));
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      return isValid
        ? db
            .select('*')
            .from('users')
            .where({ email: req.body.email })
            .then((user) => res.json(user[0]))
            .catch((err) => res.status(404).json('error getting user!'))
        : res.status(400).json('wrong credentials!');
    })
    .catch((err) => res.status(400).json('wrong credentials!'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({ hash, email })
      .into('login')
      .returning('email')
      .then((data) => {
        return trx('users')
          .returning('*')
          .insert({
            email: data[0].email,
            name,
            joinedat: new Date(),
          })
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json('Unable to Register!'));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
});

app.put('/image', (req, res) => {
  db('users')
    .where('id', '=', req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then((data) => {
      res.json(data[0].entries);
    });
});

app.listen(3001, () => console.log('app is running on port 3001...'));
