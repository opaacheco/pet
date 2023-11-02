const routes = require("express").Router();

const UserController = require("../controller/UserController");
const checkAuth = require("../helpers/checkAuth");
const { imageUpload } = require("../helpers/image-upload");

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);
routes.get("/checkUser", UserController.checkUser);
routes.get("/:id", UserController.getUser);
routes.patch(
  "/edit/:id",
  checkAuth,
  imageUpload.single("image"),
  UserController.editUser
);

module.exports = routes;
