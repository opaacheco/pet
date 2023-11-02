const moogose = require("../db/conn");
const { Schema } = moogose;

const User = moogose.model(
  "User",
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      image: { type: String },
      phone: { type: String, required: true },
    },
    { timestamps: true } // esse campo cria dois campos no mongo, creatAt e updateAt
  )
);

module.exports = User;
