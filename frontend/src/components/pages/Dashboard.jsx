import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const navigate = useNavigate();
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [allFollowups, setAllFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        console.log('Fetching leads...');
        const response = await axios.get('http://localhost:5000/api/leads');
        const leads = response.data;
        console.log('Fetched leads:', leads);
        
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        console.log('Date range:', {
          today: today.toISOString(),
          tomorrow: tomorrow.toISOString()
        });

        // Get all follow-ups for debugging
        const allFollowups = leads.flatMap(lead => {
          return (lead.notes || [])
            .filter(note => note.followUp)
            .map(note => ({
              ...note,
              leadName: lead.name,
              leadCompany: lead.company,
              leadId: lead._id
            }));
        });
        setAllFollowups(allFollowups);

        // Filter for today's follow-ups
        const todayFollowups = allFollowups.filter(note => {
          const followUpDate = new Date(note.followUp);
          return followUpDate >= today && followUpDate < tomorrow;
        });

        console.log('All followups:', allFollowups);
        console.log('Today\'s followups:', todayFollowups);

        // Sort by follow-up time
        todayFollowups.sort((a, b) => new Date(a.followUp) - new Date(b.followUp));
        setTodayFollowups(todayFollowups);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching follow-ups:', err);
        setError('Failed to fetch follow-ups');
        setLoading(false);
      }
    };

    fetchFollowups();
  }, []);

  const handleFollowupClick = (leadId) => {
    navigate(`/leads/${leadId}`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your CRM activities</p>
      </div>

      {/* Today's Follow-ups Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Today's Follow-ups</h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        {todayFollowups.length > 0 ? (
          <div className="space-y-4">
            {todayFollowups.map((followup, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                onClick={() => handleFollowupClick(followup.leadId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(followup.followUp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{followup.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{followup.leadName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        <span>{followup.leadCompany}</span>
                      </div>
                      <span className="capitalize">{followup.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No follow-ups scheduled for today
          </div>
        )}
      </div>

      {/* Debug Section - All Follow-ups */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">All Follow-ups (Debug)</h2>
          <span className="text-sm text-gray-500">
            Total: {allFollowups.length}
          </span>
        </div>

        {allFollowups.length > 0 ? (
          <div className="space-y-4">
            {allFollowups.map((followup, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                onClick={() => handleFollowupClick(followup.leadId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(followup.followUp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{followup.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{followup.leadName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        <span>{followup.leadCompany}</span>
                      </div>
                      <span className="capitalize">{followup.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No follow-ups found in the system
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
