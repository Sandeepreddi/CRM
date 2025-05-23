import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

function FollowupTab({ lead }) {
  // Filter notes that have followup dates
  const followupNotes = lead.notes?.filter(note => note.followUp) || [];
  
  // Sort followup notes by date
  followupNotes.sort((a, b) => new Date(a.followUp) - new Date(b.followUp));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Follow-ups</h2>
      </div>

      <div className="space-y-4">
        {followupNotes.length > 0 ? (
          followupNotes.map((note, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(note.followUp).toLocaleDateString()} at {new Date(note.followUp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {note.type}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{note.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(note.date).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No follow-ups scheduled</p>
        )}
      </div>
    </div>
  );
}

export default FollowupTab; 