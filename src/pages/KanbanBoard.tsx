import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Search, X, ChevronDown, ChevronUp, Edit, Trash, Phone, Mail, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Customer, Project, ProjectStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CustomerForm from '../components/customers/CustomerForm';
import ProjectForm from '../components/customers/ProjectForm';

function KanbanBoard() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Get all unique column IDs
  const columnIds = Object.values(ProjectStatus);

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const fetchCustomers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);
      
      if (customersError) throw customersError;
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
      
      if (projectsError) throw projectsError;
      
      // Combine the data
      const customersWithProjects = customersData.map(customer => {
        const customerProjects = projectsData.filter(
          project => project.customer_id === customer.id
        );
        return { ...customer, projects: customerProjects };
      });
      
      // Extract all unique tags
      const tags = customersData
        .flatMap(customer => customer.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index);
      
      setAvailableTags(tags);
      setCustomers(customersWithProjects);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCustomerCreate = (newCustomer: Customer) => {
    setCustomers([...customers, { ...newCustomer, projects: [] }]);
    setShowCustomerModal(false);
  };
  
  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => 
      c.id === updatedCustomer.id ? { ...updatedCustomer, projects: c.projects } : c
    ));
    setShowCustomerModal(false);
  };
  
  const handleCustomerDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all associated projects.')) {
      return;
    }
    
    try {
      // Delete customer (cascade will delete projects)
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);
      
      if (error) throw error;
      
      // Update local state
      setCustomers(customers.filter(c => c.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  
  const handleProjectCreate = (newProject: Project) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === newProject.customer_id) {
        const customerProjects = customer.projects || [];
        return {
          ...customer,
          projects: [...customerProjects, newProject]
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setShowProjectModal(false);
  };
  
  const handleProjectUpdate = (updatedProject: Project) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === updatedProject.customer_id) {
        const updatedProjects = (customer.projects || []).map(project => 
          project.id === updatedProject.id ? updatedProject : project
        );
        return { ...customer, projects: updatedProjects };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setShowProjectModal(false);
  };
  
  const handleProjectDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Update local state
      const updatedCustomers = customers.map(customer => {
        const updatedProjects = (customer.projects || []).filter(
          project => project.id !== projectId
        );
        return { ...customer, projects: updatedProjects };
      });
      
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };
  
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Find the project
    let targetProject: Project | null = null;
    let targetCustomer: Customer | null = null;
    
    for (const customer of customers) {
      const project = (customer.projects || []).find(p => p.id === draggableId);
      if (project) {
        targetProject = project;
        targetCustomer = customer;
        break;
      }
    }
    
    if (!targetProject || !targetCustomer) return;
    
    // Update project status
    const newStatus = destination.droppableId as ProjectStatus;
    
    try {
      // Update in the database
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', targetProject.id);
      
      if (error) throw error;
      
      // Update in local state
      const updatedCustomers = customers.map(customer => {
        if (customer.id === targetCustomer!.id) {
          const updatedProjects = (customer.projects || []).map(project => {
            if (project.id === targetProject!.id) {
              return { ...project, status: newStatus };
            }
            return project;
          });
          return { ...customer, projects: updatedProjects };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };
  
  const toggleCustomerExpansion = (customerId: string) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };
  
  const filterCustomers = () => {
    return customers.filter(customer => {
      // Search term filter (customer name, company, email, phone)
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = customer.name.toLowerCase().includes(searchLower);
      const companyMatch = customer.company.toLowerCase().includes(searchLower);
      const emailMatch = customer.email.toLowerCase().includes(searchLower);
      const phoneMatch = customer.phone.toLowerCase().includes(searchLower);
      
      const basicInfoMatch = nameMatch || companyMatch || emailMatch || phoneMatch;
      
      // Projects match (project name or description)
      const projectMatch = (customer.projects || []).some(project => 
        project.name.toLowerCase().includes(searchLower) || 
        (project.description && project.description.toLowerCase().includes(searchLower))
      );
      
      const textMatch = searchTerm === '' || basicInfoMatch || projectMatch;
      
      // Tags filter
      const tagsMatch = tagsFilter.length === 0 || 
        tagsFilter.every(tag => customer.tags?.includes(tag));
      
      // Status filter
      const statusMatch = statusFilter === '' || 
        (customer.projects || []).some(project => project.status === statusFilter);
      
      return textMatch && tagsMatch && statusMatch;
    });
  };
  
  const getColumnProjects = (status: ProjectStatus) => {
    const filteredProjects = customers.flatMap(customer => 
      (customer.projects || [])
        .filter(project => {
          const statusMatch = project.status === status;
          const searchMatch = searchTerm === '' || 
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
          return statusMatch && searchMatch;
        })
        .map(project => ({ ...project, customer }))
    );
    return filteredProjects;
  };
  
  const handleTagFilterToggle = (tag: string) => {
    setTagsFilter(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    const results = customers.filter(customer => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = customer.name.toLowerCase().includes(searchLower);
      const companyMatch = customer.company.toLowerCase().includes(searchLower);
      const emailMatch = customer.email.toLowerCase().includes(searchLower);
      const phoneMatch = customer.phone.toLowerCase().includes(searchLower);
      
      const basicInfoMatch = nameMatch || companyMatch || emailMatch || phoneMatch;
      
      const projectMatch = (customer.projects || []).some(project => 
        project.name.toLowerCase().includes(searchLower) || 
        (project.description && project.description.toLowerCase().includes(searchLower))
      );
      
      return basicInfoMatch || projectMatch;
    });

    setSearchResults(results);
    setShowSearchResults(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const filteredCustomers = filterCustomers();

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Customer Board</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search customers or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSearchResults(false);
                  setSearchResults([]);
                }}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
            className="w-full sm:w-40 border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {columnIds.map(status => (
              <option key={status} value={status}>
                {status.replace('-', ' ')}
              </option>
            ))}
          </select>

          {/* Navigation */}
          <Link
            to="/"
            className="btn btn-outline flex items-center justify-center"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          
          {/* Add Customer Button */}
          <button
            onClick={() => {
              setCurrentCustomer(null);
              setShowCustomerModal(true);
            }}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>
      
      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagFilterToggle(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  tagsFilter.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tag}
                {tagsFilter.includes(tag) && <X className="ml-1 h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-sm font-medium text-gray-700">Search Results</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {searchResults.map(customer => (
              <li key={customer.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">{customer.name}</p>
                        <p className="ml-2 text-sm text-gray-500">({customer.company})</p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500 mr-4">
                          <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Projects */}
                  {customer.projects && customer.projects.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Projects</h4>
                      <div className="space-y-2">
                        {customer.projects.map(project => (
                          <div key={project.id} className="border rounded-md p-3">
                            <p className="text-sm font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No customers found. Create your first customer to get started!</p>
          <button
            onClick={() => {
              setCurrentCustomer(null);
              setShowCustomerModal(true);
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      ) : (
        <>
          {/* Customer List */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <ul className="divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <li key={customer.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleCustomerExpansion(customer.id)}
                        className="flex items-center w-full text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">{customer.name}</p>
                            <p className="ml-2 text-sm text-gray-500">({customer.company})</p>
                          </div>
                          
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500 mr-4">
                              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{customer.phone}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-5 flex-shrink-0">
                          {expandedCustomer === customer.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      <div className="ml-4 flex-shrink-0 flex">
                        <button
                          onClick={() => {
                            setCurrentCustomer(customer);
                            setShowCustomerModal(true);
                          }}
                          className="mr-2 p-1 rounded-full text-gray-400 hover:text-blue-500"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleCustomerDelete(customer.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-red-500"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {customer.tags && customer.tags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap">
                          {customer.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="mr-2 mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Expanded content - Projects */}
                    {expandedCustomer === customer.id && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Projects</h4>
                          <button
                            onClick={() => {
                              setCurrentProject(null);
                              setCurrentCustomer(customer);
                              setShowProjectModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Project
                          </button>
                        </div>
                        
                        {customer.projects && customer.projects.length > 0 ? (
                          <div className="space-y-3">
                            {customer.projects.map(project => (
                              <div key={project.id} className="border rounded-md p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      project.status === ProjectStatus.INQUIRY
                                        ? 'bg-blue-100 text-blue-800'
                                        : project.status === ProjectStatus.IN_PROGRESS
                                        ? 'bg-teal-100 text-teal-800'
                                        : project.status === ProjectStatus.REVIEW
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {project.status.replace('-', ' ')}
                                    </span>
                                  </div>
                                  
                                  <div className="flex">
                                    <button
                                      onClick={() => {
                                        setCurrentProject(project);
                                        setCurrentCustomer(customer);
                                        setShowProjectModal(true);
                                      }}
                                      className="mr-1 p-1 rounded-full text-gray-400 hover:text-blue-500"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleProjectDelete(project.id)}
                                      className="p-1 rounded-full text-gray-400 hover:text-red-500"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="font-medium">Start:</span> {project.start_date && new Date(project.start_date).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Deadline:</span> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Budget:</span> {project.budget ? `₹${project.budget.toLocaleString()}` : 'None'}
                                  </div>
                                  {project.description && (
                                    <div className="col-span-2">
                                      <span className="font-medium">Notes:</span> {project.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No projects yet.</p>
                        )}
                        
                        {/* Notes section */}
                        {customer.notes && (
                          <div className="mt-4 border-t pt-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Notes</h4>
                            <p className="text-sm text-gray-600">{customer.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Kanban Board */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Status Board</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 overflow-x-auto kanban-scroll">
              {columnIds.map(columnId => {
                // Only show the column if it matches the selected status filter or no filter is selected
                if (statusFilter && statusFilter !== '' && columnId !== statusFilter) {
                  return null;
                }
                return (
                  <div key={columnId} className="bg-white rounded-lg shadow min-w-64">
                    <div className={`px-4 py-3 rounded-t-lg ${
                      columnId === ProjectStatus.INQUIRY
                        ? 'bg-blue-500 text-white'
                        : columnId === ProjectStatus.IN_PROGRESS
                        ? 'bg-teal-500 text-white'
                        : columnId === ProjectStatus.REVIEW
                        ? 'bg-purple-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      <h3 className="font-medium">{columnId.replace('-', ' ')}</h3>
                    </div>
                    
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="p-2 min-h-40"
                        >
                          {getColumnProjects(columnId as ProjectStatus).map((projectWithCustomer, index) => (
                            <Draggable
                              key={projectWithCustomer.id}
                              draggableId={projectWithCustomer.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2 p-3 bg-white rounded border border-gray-200 shadow-sm hover:shadow transition-shadow"
                                >
                                  <div className="text-sm font-medium text-blue-600 mb-1">
                                    {projectWithCustomer.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mb-2">
                                    {projectWithCustomer.customer.name} - {projectWithCustomer.customer.company}
                                  </div>
                                  {projectWithCustomer.deadline && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <span className="mr-1 font-medium">Deadline:</span>
                                      {new Date(projectWithCustomer.deadline).toLocaleDateString()}
                                    </div>
                                  )}
                                  {projectWithCustomer.budget && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <span className="mr-1 font-medium">Budget:</span>
                                      ₹{projectWithCustomer.budget.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </>
      )}
      
      {/* Customer Modal */}
      {showCustomerModal && (
        <CustomerForm
          customer={currentCustomer}
          onClose={() => setShowCustomerModal(false)}
          onSubmit={currentCustomer ? handleCustomerUpdate : handleCustomerCreate}
          availableTags={availableTags}
        />
      )}
      
      {/* Project Modal */}
      {showProjectModal && currentCustomer && (
        <ProjectForm
          project={currentProject}
          customer={currentCustomer}
          onClose={() => setShowProjectModal(false)}
          onSubmit={currentProject ? handleProjectUpdate : handleProjectCreate}
        />
      )}
    </div>
  );
}

export default KanbanBoard;