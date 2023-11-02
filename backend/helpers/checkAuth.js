const jwt = require("jsonwebtoken");

const getToken = require("./get-token");

const checkAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: "acesso negado" });
    return;
  }
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ message: "acesso negado" });
    return;
  }
  try {
    const verifid = jwt.verify(token, "nossosecret");
    req.user = verifid;
    next();
  } catch (error) {
    return res.status(400).json({ message: "token invalido" });
  }
};

module.exports = checkAuth;
