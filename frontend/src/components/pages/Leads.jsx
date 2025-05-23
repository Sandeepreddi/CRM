import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  LinkIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const statuses = [
  { value: 'new', label: 'New', color: 'bg-gray-200', icon: <QuestionMarkCircleIcon className="h-4 w-4" /> },
  { value: 'open', label: 'Open', color: 'bg-blue-100', icon: <ClockIcon className="h-4 w-4" /> },
  { value: 'inprogress', label: 'In Progress', color: 'bg-yellow-100', icon: <ClockIcon className="h-4 w-4" /> },
  { value: 'qualified', label: 'Qualified', color: 'bg-green-100', icon: <CheckIcon className="h-4 w-4" /> },
  { value: 'unqualified', label: 'Unqualified', color: 'bg-red-100', icon: <XMarkIcon className="h-4 w-4" /> },
  { value: 'closedlost', label: 'Closed Lost', color: 'bg-red-200', icon: <XMarkIcon className="h-4 w-4" /> },
  { value: 'closedwon', label: 'Closed Won', color: 'bg-green-200', icon: <CheckIcon className="h-4 w-4" /> },
];

// Mock function to get company logo
const getCompanyLogo = (company) => {
  if (!company) return null;
  const initials = company.split(' ').map(word => word[0]).join('').toUpperCase();
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
      {initials.substring(0, 2)}
    </div>
  );
};

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    linkedIn: '',
    phone:'',
    company: '',
    notes: '',
    tags: '',
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigate to the Profile page
  const handleProfileClick = (lead) => {
    console.log(lead._id);
    navigate(`/leads/${lead._id}`);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;
    try {
      const res = await axios.get('http://localhost:5000/api/leads', { params });
      setLeads(res.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      status: 'new',
      tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
      notes: form.notes ? [{
        content: form.notes,
        type: 'other',
        date: new Date()
      }] : [],
      emails:[]
    };

    if (!form.company || !form.linkedIn) {
      alert('Company and LinkedIn URL are required fields');
      return;
    }

    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    try {
      if (selectedLead) {
        await axios.put(`http://localhost:5000/api/leads/${selectedLead._id}`, payload);
        setSelectedLead(null);
      } else {
        await axios.post('http://localhost:5000/api/leads', payload);
      }
      setForm({ name: '', email: '', linkedIn: '', phone: '', company: '', notes: '', tags: '' });
      setFormVisible(false);
      fetchLeads();
    } catch (error) {
      console.error('Error submitting lead:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit lead. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}/status`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleUpdateClick = (lead) => {
    setSelectedLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      linkedIn: lead.linkedIn || '',
      phone: lead.phone || '',
      company: lead.company || '',
      notes: lead.notes || '',
      tags: lead.tags ? lead.tags.join(', ') : '',
    });
    setFormVisible(true);
  };

  const getStatusInfo = (statusValue) => {
    return statuses.find(s => s.value === statusValue) || statuses[0];
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lead Management</h1>
          <p className="text-gray-600">Track and manage your potential customers</p>
        </div>
        <button
          onClick={() => {
            setFormVisible(true);
            setSelectedLead(null);
            setForm({ name: '', email: '', linkedIn: '',phone:'', company: '', notes: '', tags: '' });
          }}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 mt-4 md:mt-0 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Lead
        </button>
      </div>

      {/* Form */}
      {formVisible && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedLead ? 'Update Lead' : 'Add New Lead'}
            </h2>
            <button
              onClick={() => setFormVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL*</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="linkedIn"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedIn}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="phone"
                  placeholder="+91"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company*</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="company"
                  placeholder="Acme Inc"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="tags"
                  placeholder="prospect, enterprise, tech (comma separated)"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  name="notes"
                  placeholder="Additional information..."
                  rows="3"
                  value={form.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="col-span-full flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setFormVisible(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
              >
                {selectedLead ? (
                  <>
                    <PencilIcon className="h-4 w-4" />
                    Update Lead
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="h-4 w-4" />
                    Add Lead
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                id="search"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by name, email or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium cursor-pointer" onClick={() => handleProfileClick(lead)} >
                          {lead.name.charAt(0)} 
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => handleProfileClick(lead)} >{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          {lead.linkedIn && (
                            <a 
                              href={lead.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                            >
                              <LinkIcon className="h-3 w-3 mr-1" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCompanyLogo(lead.company)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{lead.company || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {lead.tags?.length > 0 ? (
                          lead.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`${getStatusInfo(lead.status).color} px-3 py-1 rounded-full text-xs font-medium cursor-pointer border border-transparent hover:border-gray-300`}
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                      >
                        {statuses.map(s => (
                          <option key={s.value} value={s.value} className="bg-white">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdateClick(lead)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No leads found. {search || statusFilter ? 'Try adjusting your filters.' : 'Add your first lead!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;