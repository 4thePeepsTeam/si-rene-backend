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
  res.json({ message: "ok" });
});

const db = require("./src/services/db");
const { collection, getDocs } = require("firebase/firestore");

app.get("/test", async (req, res) => {
  let result = [];
  try {
    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      console.log(doc.data().location.coordinate._lat);
      console.log(doc.data().location.coordinate._long);
      result.push(`${doc.id} => ${doc.data().location.coordinate._lat}`);
    });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// const routes = require("./src/api");
// app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
