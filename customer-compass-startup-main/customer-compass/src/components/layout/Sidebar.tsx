import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Leads', path: '/leads', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Customers', path: '/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Projects', path: '/projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' }
  ];

  // Current company section
  const currentCompany = {
    name: 'Acme Inc',
    type: 'Business Team',
  };

  return (
    <div className="w-64 h-screen bg-blue-600 text-white flex flex-col">
      {/* Logo section */}
      <div className="p-4 flex items-center">
        <div className="bg-white p-2 rounded-md mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <span className="text-l font-bold uppercase text-white">CustomerCompass</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name} className="mb-2">
                <Link href={item.path} className={`flex items-center py-2 px-4 ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'} rounded-sm mx-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="text-white">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Current company section */}
      <div className="p-4 mt-auto border-t border-blue-700 bg-blue-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-blue-600 font-bold">
            A
          </div>
          <div className="ml-3">
            <div className="font-medium text-white">{currentCompany.name}</div>
            <div className="text-xs text-white opacity-80">{currentCompany.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
