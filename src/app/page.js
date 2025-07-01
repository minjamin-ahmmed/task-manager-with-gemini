"use client";

import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import axios from "axios";

import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const handleSave = (task) => {
    if (task.id) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...task, id: uuidv4(), subtasks: [] }]);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSuggestedSubtasks = async (task) => {
    try {
      const response = await axios.post("/api/suggest-subtasks", {
        task: task.title,
      });

      const updatedTask = {
        ...task,
        subtasks: response.data.subtasks,
      };

      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error("Error suggesting subtasks:", error);
      toast.error("Error suggesting subtasks. Please try again.");
    }
  };

  return (
    <main className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">TaskAI Manager</h1>

      <TaskForm onSave={handleSave} editingTask={editingTask} />
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSuggestedSubtasks={handleSuggestedSubtasks}
          />
        ))}
      </div>
    </main>
  );
}
