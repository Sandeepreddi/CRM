import React from 'react';

function TasksTab({ lead }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          New Task
        </button>
      </div>
      <div className="space-y-4">
        {lead.notes?.filter(note => note.type === 'task').map((task, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-gray-800">{task.content}</p>
            <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
              <span>Task</span>
              <span>{new Date(task.date).toLocaleDateString()}</span>
            </div>
            {task.followUp && (
              <div className="mt-2 text-sm text-indigo-600">
                Follow-up: {new Date(task.followUp).toLocaleDateString()}
              </div>
            )}
          </div>
        )) || <p className="text-gray-500 text-center py-4">No tasks available</p>}
      </div>
    </div>
  );
}

export default TasksTab; 