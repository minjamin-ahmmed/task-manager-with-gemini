
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null); // Track which task is loading

  const handleSave = (task) => {
    if (task.id) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...task, id: uuidv4(), subtasks: [] }]);
    }
  };

  const handleSuggestedSubtasks = async (task) => {
    setLoadingTaskId(task.id); // Set loading state
    
    try {
      const response = await fetch('/api/suggest-subtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: task.title,
          description: task.description 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subtasks');
      }

      const data = await response.json();
      setTasks(tasks.map(t => 
        t.id === task.id 
          ? { ...t, subtasks: data.subtasks } 
          : t
      ));
    } catch (error) {
      console.error('Error suggesting subtasks:', error);
    } finally {
      setLoadingTaskId(null); // Clear loading state
    }
  };

  return (
    <main className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <TaskForm onSave={handleSave} editingTask={editingTask} />
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))}
            onSuggestedSubtasks={handleSuggestedSubtasks}
            isLoading={loadingTaskId === task.id}
          />
        ))}
      </div>
    </main>
  );
}