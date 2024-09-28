import mongoose, { model, Schema } from "mongoose";

try {
  mongoose.connect("");
} catch (e) {
  console.log("Error while connecting to Database", e);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

const User = model("User", userSchema);

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  dueDate: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Todo = model("Todo", todoSchema);

export { User, Todo };
