'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Tabs for the Dashboard page
const tabs = ['Overview', 'Leads', 'Projects', 'Revenue'];

// Mock data for dashboard
const dashboardData = {
  // Summary metrics
  monthlyRevenue: {
    value: '$0',
    percentChange: 12,
    period: 'This month'
  },
  newLeads: {
    value: '0',
    percentChange: 8,
    period: 'This month'
  },
  conversionRate: {
    value: '20%',
    percentChange: -5,
    period: 'From contacted leads'
  },
  completedProjects: {
    value: '0',
    percentChange: -2,
    period: 'This month'
  },

  // Lead Funnel data
  leadFunnel: [
    { name: 'New', value: 17, color: '#4a90e2' },
    { name: 'Contacted', value: 17, color: '#5a9bd4' },
    { name: 'Proposal', value: 17, color: '#7fb9f5' },
    { name: 'Negotiation', value: 17, color: '#9fcbf7' },
    { name: 'Converted', value: 17, color: '#45d9a1' },
    { name: 'Lost', value: 17, color: '#f76c6c' },
  ],

  // Project Status data
  projectStatus: [
    { name: 'Planning', value: 20, color: '#4a90e2' },
    { name: 'Active', value: 40, color: '#ffa500' },
    { name: 'On Hold', value: 20, color: '#a052b3' },
    { name: 'Completed', value: 2, color: '#45d9a1' },
    { name: 'Cancelled', value: 18, color: '#ff6666' },
  ]
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Render stat card with metric value and trend
  const StatCard = ({ title, value, change, period, gradient }: 
    { title: string; value: string; change: number; period: string; gradient: string }) => {
    
    const isPositive = change > 0;
    
    return (
      <div className={`border rounded-lg p-4 ${gradient}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-black">{title}</h3>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-2xl font-bold text-black">{value}</div>
        <div className="flex items-center mt-1">
          <div className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isPositive ? '+' : ''}{change}%
          </div>
          <span className="ml-2 text-xs text-gray-700">{period}</span>
        </div>
      </div>
    );
  };

  // Render a chart section with title and description
  const ChartSection = ({ title, description, children }: 
    { title: string; description: string; children: React.ReactNode }) => {
    return (
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-1 text-black">{title}</h3>
        <p className="text-sm text-gray-700 mb-4">{description}</p>
        {children}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-black">Dashboard</h1>
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard 
            title="Monthly Revenue" 
            value={dashboardData.monthlyRevenue.value} 
            change={dashboardData.monthlyRevenue.percentChange} 
            period={dashboardData.monthlyRevenue.period} 
            gradient="border-green-200"
          />
          <StatCard 
            title="New Leads" 
            value={dashboardData.newLeads.value} 
            change={dashboardData.newLeads.percentChange} 
            period={dashboardData.newLeads.period} 
            gradient="border-blue-200"
          />
          <StatCard 
            title="Conversion Rate" 
            value={dashboardData.conversionRate.value} 
            change={dashboardData.conversionRate.percentChange} 
            period={dashboardData.conversionRate.period} 
            gradient="border-orange-200"
          />
          <StatCard 
            title="Completed Projects" 
            value={dashboardData.completedProjects.value} 
            change={dashboardData.completedProjects.percentChange} 
            period={dashboardData.completedProjects.period} 
            gradient="border-red-200"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-700 hover:text-black hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Funnel Chart */}
          <ChartSection 
            title="Lead Funnel" 
            description="Distribution of leads by current status"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.leadFunnel}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardData.leadFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 mt-4">
              {dashboardData.leadFunnel.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <div className="text-xs text-black">{entry.name}: {entry.value}%</div>
                </div>
              ))}
            </div>
          </ChartSection>

          {/* Project Status Chart */}
          <ChartSection 
            title="Project Status" 
            description="Distribution of projects by current status"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.projectStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardData.projectStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 mt-4">
              {dashboardData.projectStatus.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <div className="text-xs text-black">{entry.name}: {entry.value}%</div>
                </div>
              ))}
            </div>
          </ChartSection>
        </div>
      </div>
    </Layout>
  );
}
