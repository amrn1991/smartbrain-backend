const handleProfileGet = (req, res, db) => {
  db.select('*')
    .from('users')
    .where({ id: req.params.id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(400).json('user not found!');
    })
    .catch((err) => res.status(404).json('error getting user!'));
};

module.exports = {
  handleProfileGet,
};
