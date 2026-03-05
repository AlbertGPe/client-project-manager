module.exports.removeId = (req, res, next) => {
  if (req.body) {
    delete req.body._id;
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.confirm;
  }
  next();
}