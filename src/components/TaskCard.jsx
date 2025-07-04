
import React, { useState } from "react";

const TaskCard = ({ task, onEdit, onDelete, onSuggestedSubtasks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuggestSubtasks = async () => {
    setIsLoading(true);
    setError(null);
    
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch subtasks');
      }

      const data = await response.json();
      
      // Clean and format subtasks before passing them up
      const cleanedSubtasks = data.subtasks.map(subtask => 
        subtask
          .replace(/^["\d.]+/, '') // Remove leading numbers/quotes
          .replace(/\*\*/g, '')     // Remove markdown bold
          .trim()
      );
      
      onSuggestedSubtasks(task.id, cleanedSubtasks);
    } catch (error) {
      console.error('Error suggesting subtasks:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 shadow-lg">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">{task.title}</h2>
        <p className="text-sm text-zinc-300">{task.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>📅 {task.dueDate || 'No due date'}</span>
          <span className="px-2 py-1 rounded-full text-xs bg-zinc-800">
            {task.status || 'pending'}
          </span>
        </div>
      </div>

      {/* Subtasks Section - Now properly connected */}
      {task.subtasks?.length > 0 && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Suggested Subtasks
          </h3>
          <ul className="space-y-2">
            {task.subtasks.map((subtask, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-zinc-800 text-xs mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm text-zinc-300">
                  {subtask}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 rounded-lg border border-red-800">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1"
          onClick={() => onEdit(task)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1"
          onClick={() => onDelete(task.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
     <button
  className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center gap-1 disabled:opacity-50"
  onClick={() => onSuggestedSubtasks(task)} 
  disabled={isLoading}
>
          {isLoading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Suggest Subtasks
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default TaskCard;