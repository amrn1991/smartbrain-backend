const handleSignin = (req, res, bcrypt, db) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json('incorrect signin attempt!');
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      return isValid
        ? db
            .select('*')
            .from('users')
            .where({ email })
            .then((user) => res.json(user[0]))
            .catch((err) => res.status(404).json('error getting user!'))
        : res.status(400).json('wrong credentials!');
    })
    .catch((err) => res.status(400).json('wrong credentials!'));
};

module.exports = {
  handleSignin,
};
