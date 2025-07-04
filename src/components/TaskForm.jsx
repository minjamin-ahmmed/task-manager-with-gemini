"use client";

import React, { useEffect, useState } from "react";

const TaskForm = ({ onSave, editingTask }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    if (editingTask) setTask(editingTask);
  }, [editingTask]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    onSave(task);
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
    });

    console.log(task);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full p-4 rounded-md border border-zinc-700 text-white bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full p-4 rounded-xl border border-zinc-700 text-white bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        ></textarea>

        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full p-4 rounded-md border border-zinc-700 text-white bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <button
          type="submit"
          className="w-full p-4 rounded-md border border-zinc-700 text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 hover:bg-blue-600 transition-colors"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
