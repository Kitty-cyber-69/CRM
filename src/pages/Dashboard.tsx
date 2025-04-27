import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Clock, IndianRupee, LineChart, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProjectStatus, KPIData } from '../types';
import { format } from 'date-fns';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function Dashboard() {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalCustomers: 0,
    totalProjects: 0,
    projectsByStatus: {
      [ProjectStatus.INQUIRY]: 0,
      [ProjectStatus.IN_PROGRESS]: 0,
      [ProjectStatus.REVIEW]: 0,
      [ProjectStatus.COMPLETED]: 0,
    },
    upcomingDeadlines: [],
    totalBudget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get customers count
        const { count: customersCount, error: customersError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });

        if (customersError) throw customersError;

        // Get projects data
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*');

        if (projectsError) throw projectsError;

        // Calculate KPIs
        const projectsByStatus = {
          [ProjectStatus.INQUIRY]: 0,
          [ProjectStatus.IN_PROGRESS]: 0,
          [ProjectStatus.REVIEW]: 0,
          [ProjectStatus.COMPLETED]: 0,
        };

        let totalBudget = 0;

        projects.forEach(project => {
          projectsByStatus[project.status as ProjectStatus]++;
          totalBudget += project.budget || 0;
        });

        // Get upcoming deadlines (projects with deadlines in the next 14 days)
        const now = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(now.getDate() + 14);

        const upcomingDeadlines = projects
          .filter(project => {
            if (!project.deadline) return false;
            const deadlineDate = new Date(project.deadline);
            return deadlineDate >= now && deadlineDate <= twoWeeksLater;
          })
          .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
          .slice(0, 5);

        setKpiData({
          totalCustomers: customersCount || 0,
          totalProjects: projects.length,
          projectsByStatus,
          upcomingDeadlines,
          totalBudget,
        });
        setFilteredProjects(projects);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = kpiData.upcomingDeadlines.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customer.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(kpiData.upcomingDeadlines);
    }
  }, [searchTerm, kpiData.upcomingDeadlines]);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = kpiData.upcomingDeadlines.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex items-center w-full sm:w-64">
            <input
              type="text"
              placeholder="Search projects..."
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
          <Link 
            to="/board"
            className="btn btn-primary flex items-center justify-center"
          >
            <Kanban className="mr-2 h-4 w-4" />
            View Board
          </Link>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-sm font-medium text-gray-700">Search Results</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {searchResults.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                    <div className="flex mt-1">
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
                  </div>
                  <div className="ml-3 flex flex-col items-end">
                    <span className="text-sm text-gray-500">
                      {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      {project.budget ? `₹${project.budget.toLocaleString()}` : 'No budget'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{selectedProject.name}</h3>
                <button
                  onClick={() => setShowProjectDetails(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProject.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Customer</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProject.customer.name} ({selectedProject.customer.company})
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Description</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProject.description || 'No description'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Start Date</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProject.start_date ? format(new Date(selectedProject.start_date), 'MMM d, yyyy') : 'Not set'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Deadline</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProject.deadline ? format(new Date(selectedProject.deadline), 'MMM d, yyyy') : 'Not set'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Budget</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProject.budget ? `₹${selectedProject.budget.toLocaleString()}` : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowProjectDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{kpiData.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 text-teal-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{kpiData.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{kpiData.projectsByStatus[ProjectStatus.IN_PROGRESS]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Budget</p>
              <p className="text-2xl font-semibold text-gray-900">₹{kpiData.totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Projects by Status</h2>
            <div className="p-2 rounded-full bg-gray-100 text-gray-500">
              <LineChart className="h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">Inquiry</p>
                <p className="text-sm font-medium text-gray-700">
                  {kpiData.projectsByStatus[ProjectStatus.INQUIRY]}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(kpiData.projectsByStatus[ProjectStatus.INQUIRY] / kpiData.totalProjects) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">In Progress</p>
                <p className="text-sm font-medium text-gray-700">
                  {kpiData.projectsByStatus[ProjectStatus.IN_PROGRESS]}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(kpiData.projectsByStatus[ProjectStatus.IN_PROGRESS] / kpiData.totalProjects) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">Review</p>
                <p className="text-sm font-medium text-gray-700">
                  {kpiData.projectsByStatus[ProjectStatus.REVIEW]}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(kpiData.projectsByStatus[ProjectStatus.REVIEW] / kpiData.totalProjects) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">Completed</p>
                <p className="text-sm font-medium text-gray-700">
                  {kpiData.projectsByStatus[ProjectStatus.COMPLETED]}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(kpiData.projectsByStatus[ProjectStatus.COMPLETED] / kpiData.totalProjects) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                    <div className="flex mt-1">
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
                  </div>
                  <div className="ml-3 flex flex-col items-end">
                    <span className="text-sm text-gray-500">
                      {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      {project.budget ? `₹${project.budget.toLocaleString()}` : 'No budget'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No upcoming deadlines</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kanban() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 9v12"/><path d="M15 9v12"/></svg>;
}

export default Dashboard;