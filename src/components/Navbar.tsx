import React from 'react';

interface NavbarProps {
  onNewApplication: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewApplication }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Job Application Tracker</h1>
        <button
          onClick={onNewApplication}
          className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Application
        </button>
      </div>
    </nav>
  );
};