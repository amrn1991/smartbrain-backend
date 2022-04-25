const handleRegister = (req, res, bcrypt, db) => {
  const { email, name, password } = req.body;
  if(!name || !email ||!password) {
    return res.status(400).json('incorrect form submission!')
  }
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
};

module.exports = {
  handleRegister,
};
