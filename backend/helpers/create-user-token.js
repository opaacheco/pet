const jwt = require("jsonwebtoken");

const createusertoken = async (user, req, res) => {
  //criando token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "nossosecret"
  );
  //retornando token
  res.status(200).json({
    message: "você está autenticado",
    token: token,
    userId: user._id,
  });
};

module.exports = createusertoken;
