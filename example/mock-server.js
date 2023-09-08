const express = require("express");
var cors = require("cors");
const app = express();
const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3333;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Mock Example Server");
});

app.get("/breeds/list/all", (req, res) => {
  res.json({
    breeds: ["Labrador", "German Shepard", "Poodle"],
  });
});

app.use("/views", express.static("mock-views"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
