import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { router } from "./routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

router(app);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
