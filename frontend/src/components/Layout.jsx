import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Folder, 
  Users, 
  Truck, 
  Package 
} from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/workers', icon: Users, label: 'Workers' },
    { path: '/vendors', icon: Truck, label: 'Vendors' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === path 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}