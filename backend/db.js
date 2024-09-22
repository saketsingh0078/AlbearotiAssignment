import mongoose, { model, Schema } from "mongoose";

try {
  mongoose.connect(
    "mongodb+srv://yuko:Yuko%40123456@cluster0.iec1sgv.mongodb.net/Todo"
  );
} catch (e) {
  console.log("Error while connecting to DB", e);
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
