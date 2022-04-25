const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: "9322fada3eb14d5d82d6bd876ee4db31"
});
const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageUrl)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

const handleImage = (req, res, db) => {
  db('users')
    .where('id', '=', req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then((data) => {
      res.json(data[0].entries);
    });
};

module.exports = {
  handleImage,
  handleApiCall,
};
