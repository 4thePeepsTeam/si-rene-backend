const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok", appname: process.env.APP_NAME });
});

const routes = require("./src/api/index");
app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
