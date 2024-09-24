import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock API functions (replace these with actual API calls)
const api = {
  getTasks: () =>
    Promise.resolve([
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        dueDate: "2023-06-30",
        userId: 1,
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description 2",
        status: "in-progress",
        dueDate: "2023-07-15",
        userId: 1,
      },
    ]),
  createTask: (task: Task) => Promise.resolve({ ...task, id: Date.now() }),
  updateTask: (task: Task) => Promise.resolve(task),
  deleteTask: (id: number) => Promise.resolve(id),
};

// Define the Task type
type Task = {
  id?: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  userId: number;
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
    userId: 1,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    const fetchedTasks = await api.getTasks();
  };

  // Handle input changes for task title and description
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  // Handle status selection changes
  const handleStatusChange = (value: string) => {
    setCurrentTask({ ...currentTask, status: value as Task["status"] });
  };

  // Handle form submission for creating or updating a task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await api.updateTask(currentTask);
    } else {
      await api.createTask(currentTask);
    }
    fetchTasks();
    setCurrentTask({
      title: "",
      description: "",
      status: "pending",
      dueDate: "",
      userId: 1,
    });
    setIsEditing(false);
  };

  // Edit an existing task
  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setIsEditing(true);
  };

  // Delete a task
  const handleDelete = async (id: number) => {
    await api.deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <Input
            type="text"
            name="title"
            value={currentTask.title}
            onChange={handleInputChange}
            placeholder="Task Title"
            required
          />
          <Textarea
            name="description"
            value={currentTask.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            required
          />
          <Select onValueChange={handleStatusChange} value={currentTask.status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            name="dueDate"
            value={currentTask.dueDate}
            onChange={handleInputChange}
            required
          />
          <Button type="submit">
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Due Date: {task.dueDate}</p>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(task)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(task.id!)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
