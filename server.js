const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const db = {
  users: [
    {
      id: '1',
      name: 'test',
      email: 'test@demo.com',
      password: 'test',
      entries: 0,
      joinedAt: new Date(),
    },
    {
      id: '2',
      name: 'Amir',
      email: 'amir@gmail.com',
      password: '1234',
      entries: 0,
      joinedAt: new Date(),
    },
    {
      id: '3',
      name: 'Ali',
      email: 'Ali@gmail.com',
      password: '5678',
      entries: 0,
      joinedAt: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.json(db.users);
});

app.get('/profile/:id', (req, res) => {
  const [user] = db.users.filter((user) => req.params.id === user.id);
  user ? res.json(user) : res.status(404).json('no such user!');
});

app.post('/signin', (req, res) => {
  const [user] = db.users.map(user => {
    if(user.email === req.body.email && user.password === req.body.password) {
      return user;
    }
  })
  user ? res.json(user) : res.status(400).json('invalid username or password!');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password,
    entries: 0,
    joinedAt: new Date(),
  };
  db.users.push(newUser);
  res.json(newUser);
});

app.put('/image', (req, res) => {
  const [user] = db.users.filter((user) => req.body.id === user.id);
  user.entries++;
  res.json(user.entries);
});

app.listen(3001, () => console.log('app is running on port 3001...'));
