import React from 'react';

function NotesTab({ lead, onAddNote }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Notes</h2>
        <button 
          onClick={onAddNote}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Note
        </button>
      </div>
      <div className="space-y-4">
        {lead.notes && lead.notes.length > 0 ? (
          lead.notes.map((note, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-gray-800">{note.content}</p>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>{note.type}</span>
                <span>{new Date(note.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No notes available</p>
        )}
      </div>
    </div>
  );
}

export default NotesTab; 