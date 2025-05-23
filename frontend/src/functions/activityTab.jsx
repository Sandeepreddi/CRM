import React from 'react';

function ActivityTab({ lead }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Activity History</h2>
      </div>
      <div className="space-y-4">
        {lead.notes?.map((activity, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-gray-800">{activity.content}</p>
            <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
              <span className="capitalize">{activity.type}</span>
              <span>{new Date(activity.date).toLocaleDateString()}</span>
            </div>
            {activity.followUp && (
              <div className="mt-2 text-sm text-indigo-600">
                Follow-up: {new Date(activity.followUp).toLocaleDateString()}
              </div>
            )}
          </div>
        )) || <p className="text-gray-500 text-center py-4">No activity history available</p>}
      </div>
    </div>
  );
}

export default ActivityTab; 