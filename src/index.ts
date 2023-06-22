import express from "express";
import bodyParser from "body-parser";
import auth from "./routes/auth";

const app = express();
app.use(bodyParser.json());
app.use("/api/auth", auth);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
