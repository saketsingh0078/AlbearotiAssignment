import express from "express";
import { Todo } from "../db.js";
import zod from "zod";
import authMiddleware from "../middleware.js";

const router = express.Router();

const todoType = zod.object({
  title: zod.string(),
  description: zod.string(),
  status: zod.string(),
  dueDate: zod.string(),
});

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json({
      todos: todos,
    });
  } catch (e) {
    console.log("Error while fetching todo");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { success } = todoType.safeParse(req.body);
  if (!success) {
    res.json({
      msg: "Incorrect input type",
    });
  }

  try {
    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      user: req.user,
    });
    res.json({
      todo: todo,
    });
  } catch (e) {
    console.log("Error while creating Todo");
  }
});

router.put("/:id", async (req, res) => {
  const todoId = req.params.id;
  console.log(todoId);
  const updateTodo = await Todo.findOneAndUpdate(
    { _id: todoId },
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      user: req.user,
    },
    { new: true }
  );
  res.json({
    msg: "Todo updated Successfully",
  });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const todoId = req.params.id;

  try {
    const deleteTodo = await Todo.findByIdAndDelete({
      _id: todoId,
    });

    res.json({
      msg: "Todo delete successfully",
    });
  } catch (e) {
    console.log("error while deleting the Todo");
  }
});

export default router;
