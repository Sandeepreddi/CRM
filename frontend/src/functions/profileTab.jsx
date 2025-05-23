import React from 'react';

function ProfileTab({ lead }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Email:</span> {lead.email}</p>
          <p><span className="font-medium">Phone:</span> {lead.phone || 'N/A'}</p>
          <p><span className="font-medium">LinkedIn:</span> {lead.linkedIn}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Company Information</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Company:</span> {lead.company}</p>
          <p><span className="font-medium">Status:</span> {lead.status}</p>
          <p><span className="font-medium">Tags:</span> {lead.tags?.join(', ') || 'None'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab; 