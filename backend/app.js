const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();
app.use(express.json());

//DB Connection
mongoose.connect(config.get("uri"), {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

//Ping DB
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("База данных готова к использованию");
});

const Schema = mongoose.Schema;
const userSchema = new Schema({}, { collection: "Users" });
const Users = mongoose.model("User", userSchema);

app.get("/data", async (req, res) => {
  Users.find().then((Users) => res.json(Users));
});

app.listen(config.get("PORT"), () =>
  console.log("Server started on " + config.get("PORT"))
);
