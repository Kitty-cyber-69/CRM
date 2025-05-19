import React from 'react';
import Link from 'next/link';

const TopBar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
      {/* Logo for mobile - shown only on small screens */}
      <div className="lg:hidden flex items-center">
        <div className="bg-blue-600 p-1 rounded-md mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <span className="text-black font-extrabold tracking-wide uppercase">CustomerCompass</span>
      </div>

      {/* Large screen title (hidden on mobile) */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-extrabold tracking-wide uppercase text-black">CustomerCompass</h1>
      </div>

      {/* Search bar - hidden on mobile */}
      <div className="hidden md:block flex-grow max-w-xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center">
        {/* Notification icon */}
        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User profile icon */}
        <button className="p-2 ml-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
