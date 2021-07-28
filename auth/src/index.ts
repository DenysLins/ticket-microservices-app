import express from "express";

const app = express();
app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.send({ status: 200 });
});

app.listen(3000, () => {
  console.log("Auth listening on port 3000");
});
