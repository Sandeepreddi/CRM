import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateNotes from './CreateNotes';
import ProfileTab from '../../functions/profileTab';
import NotesTab from '../../functions/notesTab';
import EmailTab from '../../functions/emailTab';
import FollowupTab from '../../functions/followupTab';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCreateNote, setShowCreateNote] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leads/${id}`);
        setLead(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lead details');
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleNoteAdded = (newNote) => {
    setLead(prevLead => ({
      ...prevLead,
      notes: [...(prevLead.notes || []), newNote]
    }));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!lead) return <div className="text-center py-8">Lead not found</div>;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notes', label: 'Notes' },
    { id: 'email', label: 'Email' },
    { id: 'followup', label: 'Follow-ups' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/leads')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Leads
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600">{lead.company}</p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'profile' && <ProfileTab lead={lead} />}
          {activeTab === 'notes' && <NotesTab lead={lead} onAddNote={() => setShowCreateNote(true)} />}
          {activeTab === 'email' && <EmailTab lead={lead} />}
          {activeTab === 'followup' && <FollowupTab lead={lead} />}
        </div>
      </div>

      {showCreateNote && (
        <CreateNotes
          leadId={id}
          onClose={() => setShowCreateNote(false)}
          onNoteAdded={handleNoteAdded}
        />
      )}
    </div>
  );
}

export default Profile;
