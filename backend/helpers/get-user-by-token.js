const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserByToken = async (token, res) => {
  try {
    if (!token) {
      return res.status(401).json({ error: "Acesso negado!" });
    }

    const decoded = jwt.verify(token, "nossosecret");
    const userId = decoded.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado!" });
      return;
    }

    return user;
  } catch (error) {
    // Handle any errors that occur during JWT verification or database query
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = getUserByToken;
