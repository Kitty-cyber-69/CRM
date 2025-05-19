'use client';

import Layout from '@/components/layout/Layout';
import { useState, useRef } from 'react';

// Status options for leads
const statusOptions = [
  'cold lead',
  'hot lead',
  'design',
  'development',
  'deployed',
  'churned'
];

// Mock data for leads based on the screenshot
const initialLeads = [
  {
    id: 1,
    name: 'Sarah Williams',
    email: 'sarah@acme.com',
    company: 'Acme Inc.',
    status: 'hot lead',
    created: 'Oct 15, 2023',
    urgency: 'High',
  },
  {
    id: 2,
    name: 'Michael Brown',
    email: 'michael@xyz.com',
    company: 'XYZ Corporation',
    status: 'cold lead',
    created: 'Oct 10, 2023',
    urgency: 'Medium',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@techinnovators.com',
    company: 'Tech Innovators',
    status: 'design',
    created: 'Sep 28, 2023',
    urgency: 'High',
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david@globalsolutions.com',
    company: 'Global Solutions',
    status: 'development',
    created: 'Sep 15, 2023',
    urgency: 'Medium',
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    email: 'olivia@innovate.com',
    company: 'Innovate LLC',
    status: 'deployed',
    created: 'Aug 20, 2023',
    urgency: 'High',
  },
  {
    id: 6,
    name: 'James Taylor',
    email: 'james@moderndesigns.com',
    company: 'Modern Designs',
    status: 'churned',
    created: 'Sep 5, 2023',
    urgency: 'Low',
  },
];

// Define the Lead type
type Lead = {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  created: string;
  urgency: string;
};

type NewLeadForm = {
  name: string;
  email: string;
  company: string;
  status: string;
  urgency: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);
  const [editStatusId, setEditStatusId] = useState<number | null>(null);
  const [newLeadForm, setNewLeadForm] = useState<NewLeadForm>({
    name: '',
    email: '',
    company: '',
    status: 'cold lead',
    urgency: 'Medium',
  });

  // Get the status badge class based on the status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'hot lead':
        return 'bg-red-500 text-white';
      case 'cold lead':
        return 'bg-blue-500 text-white';
      case 'design':
        return 'bg-yellow-500 text-white';
      case 'development':
        return 'bg-purple-500 text-white';
      case 'deployed':
        return 'bg-green-500 text-white';
      case 'churned':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Get the urgency badge class based on the urgency
  const getUrgencyBadgeClass = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-orange-500';
      case 'Low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const handleAddNewLead = () => {
    setShowNewLeadModal(true);
  };

  const handleNewLeadSubmit = () => {
    const newLead: Lead = {
      id: leads.length + 1,
      ...newLeadForm,
      created: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    
    setLeads([...leads, newLead]);
    setShowNewLeadModal(false);
    setNewLeadForm({
      name: '',
      email: '',
      company: '',
      status: 'cold lead',
      urgency: 'Medium',
    });
  };
  
  const handleChangeStatus = (id: number, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
    setEditStatusId(null);
    setShowActionsMenu(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLeadForm({
      ...newLeadForm,
      [name]: value,
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">Leads</h1>
            <p className="text-gray-800 font-medium">Manage and track your sales leads</p>
          </div>
          
          <button 
            onClick={handleAddNewLead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Lead
          </button>
        </div>
        
        {/* Filters row */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 font-medium"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Statuses</option>
            {statusOptions.map(status => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
        
        {/* Leads table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads
                .filter(lead => selectedStatus === 'All Statuses' || lead.status === selectedStatus)
                .map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-black">{lead.name}</div>
                      <div className="text-sm text-gray-700">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{lead.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editStatusId === lead.id ? (
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs text-black font-medium"
                        value={lead.status}
                        onChange={(e) => handleChangeStatus(lead.id, e.target.value)}
                        autoFocus
                        onBlur={() => setEditStatusId(null)}
                      >
                        {statusOptions.map(status => (
                          <option key={status} className="text-black">{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getUrgencyBadgeClass(lead.urgency)}`}>
                      {lead.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{lead.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setShowActionsMenu(showActionsMenu === lead.id ? null : lead.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                    
                    {showActionsMenu === lead.id && (
                      <div className="absolute right-6 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            onClick={() => setEditStatusId(lead.id)}
                          >
                            Edit Status
                          </button>
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            onClick={() => {
                              setLeads(leads.filter(l => l.id !== lead.id));
                              setShowActionsMenu(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* New Lead Modal */}
        {showNewLeadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black">Add New Lead</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newLeadForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Full Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newLeadForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Email Address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={newLeadForm.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Company Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Status</label>
                  <select
                    name="status"
                    value={newLeadForm.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status} className="text-black">{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Urgency</label>
                  <select
                    name="urgency"
                    value={newLeadForm.urgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  >
                    <option value="High" className="text-black">High</option>
                    <option value="Medium" className="text-black">Medium</option>
                    <option value="Low" className="text-black">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowNewLeadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  onClick={handleNewLeadSubmit}
                  disabled={!newLeadForm.name || !newLeadForm.email || !newLeadForm.company}
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Click away listener for action menu */}
        {showActionsMenu !== null && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowActionsMenu(null)}
          />
        )}
      </div>
    </Layout>
  );
}
