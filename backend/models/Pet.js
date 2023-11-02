const moogose = require("../db/conn");
const { Schema } = moogose;

const Pet = moogose.model(
  "Pet",
  new Schema({
    name: { type: String, require: true },
    age: { type: Number, require: true },
    weight: { type: Number, require: true },
    color: { type: String, required: true },
    images: { type: Array, required: true },
    available: { type: Boolean },
    user: Object,
    adopter: Object,
  })
);

module.exports = Pet;
