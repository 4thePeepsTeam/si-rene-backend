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

const routes = require("./src/api/index");
app.use("/api", routes);

// const db = require("./src/db/firebase");
// const { collection, getDocs } = require("firebase/firestore");

// app.get("/test", async (req, res) => {
//   let result = [];
//   try {
//     const querySnapshot = await getDocs(collection(db, "officer"));
//     querySnapshot.forEach((doc) => {
//       result.push(`${doc.id} => ${doc.data().location._lat}`);
//       result.push(`${doc.id} => ${doc.data().location._long}`);
//     });
//     res.json(result);
//   } catch (err) {
//     res.json(err);
//   }
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
