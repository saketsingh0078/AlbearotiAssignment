import express from "express";
import cors from "cors";
import userRouter from "./route/user.js";
import todoRouter from "./route/todo.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/todo", todoRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running at Port", PORT);
});
