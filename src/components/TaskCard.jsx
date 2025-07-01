import React from "react";

const TaskCard = ({ task, onEdit, onDelete, onSuggestedSubtasks }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-md border border-zinc-700">
      <h2 className="text-lg font-bold">{task.title}</h2>
      <p className="text-sm text-zinc-400">{task.description}</p>
      <p className="text-sm text-zinc-400">Due Date: {task.dueDate}</p>
      <p className="text-sm text-zinc-400">Status: {task.status}</p>

      {task.subtasks?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-bold">Suggested Subtasks:</h3>
          <ul className="list-disc list-inside text-sm text-zinc-400">
            {task.subtasks.map((subtask, index) => (
              <li key={index}>{subtask}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => onSuggestedSubtasks(task)}
        >
          Suggest Subtasks
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
