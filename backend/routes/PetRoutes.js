const express = require("express");
const routes = express.Router();

const PetController = require("../controller/PetController");

///middle
const verifyToken = require("../helpers/checkAuth");
const { imageUpload } = require("../helpers/image-upload");

routes.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  PetController.create
);
routes.get("/", PetController.petsAll);
routes.get("/mypets", verifyToken, PetController.getUserPets);
routes.get("/myadoptions", verifyToken, PetController.getAllUserAdoptions);
routes.get("/:id", PetController.getPetById);
routes.delete("/:id", verifyToken, PetController.deleteById);
routes.patch(
  "/:id",
  verifyToken,
  imageUpload.array("images"),
  PetController.updatePet
);
routes.patch("/schedule/:id", verifyToken, PetController.schedule);
routes.patch("/conclude/:id", verifyToken, PetController.concludeAdoption);

module.exports = routes;
