'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';

// Define the Customer type
type Customer = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: number;
};

// Initial customers data
const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'Olivia Martinez',
    company: 'Innovate LLC',
    email: 'olivia@innovate.com',
    phone: '555-234-5678',
    projects: 2
  },
  {
    id: 2,
    name: 'Daniel Johnson',
    company: 'Johnson & Partners',
    email: 'daniel@johnsonpartners.com',
    phone: '555-876-5432',
    projects: 1
  },
  {
    id: 3,
    name: 'Sophia Clark',
    company: 'Bright Ideas Co.',
    email: 'sophia@brightideas.com',
    phone: '555-567-8901',
    projects: 2
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'projects'>>({
    name: '',
    company: '',
    email: '',
    phone: ''
  });

  // Handle input change for new customer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value
    });
  };

  // Handle add new customer
  const handleAddCustomer = () => {
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    setCustomers([
      ...customers,
      {
        id: newId,
        ...newCustomer,
        projects: 0
      }
    ]);
    setShowAddCustomer(false);
    setNewCustomer({
      name: '',
      company: '',
      email: '',
      phone: ''
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-black">Customers</h1>
            <p className="text-gray-700">Manage your customer relationships</p>
          </div>
          
          <button 
            onClick={() => setShowAddCustomer(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Customer
          </button>
        </div>
        
        {/* Customers table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Projects
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {customer.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 hover:underline">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {customer.projects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Add Customer Modal */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow">
              <h2 className="text-xl font-semibold mb-4 text-black">Add New Customer</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Full Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={newCustomer.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Company Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Email Address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
