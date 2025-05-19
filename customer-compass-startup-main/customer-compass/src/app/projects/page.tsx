'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';

// Define the ProjectType
type ProjectType = {
  id: number;
  title: string;
  client: string;
  description: string;
  revenue: string;
  progress: number;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'active' | 'on hold' | 'planning';
};

// Sample projects data based on the screenshot
const initialProjects: ProjectType[] = [
  {
    id: 1,
    title: 'Website Redesign',
    client: 'Olivia Martinez',
    description: 'Complete overhaul of corporate website with new CMS integration.',
    revenue: '$15,000',
    progress: 100,
    startDate: 'Sep 10, 2023',
    endDate: 'Oct 15, 2023',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Mobile App Development',
    client: 'Olivia Martinez',
    description: 'iOS and Android app for customer loyalty program.',
    revenue: '$35,000',
    progress: 40,
    startDate: 'Oct 1, 2023',
    status: 'active',
  },
  {
    id: 3,
    title: 'Data Security Audit',
    client: 'Daniel Johnson',
    description: 'Comprehensive security audit and implementation of enhanced protocols.',
    revenue: '$12,000',
    progress: 22,
    startDate: 'Oct 5, 2023',
    status: 'on hold',
  },
  {
    id: 4,
    title: 'E-commerce Integration',
    client: 'Sophia Clark',
    description: 'Shopify integration with existing systems.',
    revenue: '$9,000',
    progress: 65,
    startDate: 'Oct 8, 2023',
    status: 'active',
  },
  {
    id: 5,
    title: 'Marketing Automation Setup',
    client: 'Sophia Clark',
    description: 'Implementation of marketing automation platform with CRM integration.',
    revenue: '$7,500',
    progress: 10,
    startDate: 'Oct 15, 2023',
    status: 'planning',
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState<Omit<ProjectType, 'id'>>({
    title: '',
    client: '',
    description: '',
    revenue: '',
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    status: 'planning',
  });

  // Get status badge color
  const getStatusBadgeClass = (status: ProjectType['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle adding a new project
  const handleAddProject = () => {
    const newId = Math.max(...projects.map(p => p.id)) + 1;
    setProjects([
      ...projects,
      { 
        id: newId,
        ...newProject,
      }
    ]);
    setShowAddProject(false);
    setNewProject({
      title: '',
      client: '',
      description: '',
      revenue: '',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'planning',
    });
  };

  // Handle delete project
  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  // Handle input change for new project
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: name === 'progress' ? Number(value) : value,
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your client projects</p>
          </div>
          
          <button 
            onClick={() => setShowAddProject(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Project
          </button>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Client: {project.client}
                </p>
                
                <p className="text-sm text-gray-700 mb-4">
                  {project.description}
                </p>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Revenue:</span>
                    <span className="font-medium">{project.revenue}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Start Date:</p>
                    <p>{project.startDate}</p>
                  </div>
                  {project.endDate && (
                    <div>
                      <p className="text-gray-500">End Date:</p>
                      <p>{project.endDate}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Tasks
                </button>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Project Modal */}
        {showAddProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter project title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={newProject.client}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter client name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter project description"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue
                  </label>
                  <input
                    type="text"
                    name="revenue"
                    value={newProject.revenue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. $10,000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="progress"
                    value={newProject.progress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newProject.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!newProject.title || !newProject.client || !newProject.description}
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
