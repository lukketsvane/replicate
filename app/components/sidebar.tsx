"use client";
// Sidebar.tsx
import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';

const configurations = [
  { name: 'Configuration 1', systemPrompt: 'System prompt for config 1', avatar: '/path/to/avatar1.png' },
  { name: 'Configuration 2', systemPrompt: 'System prompt for config 2', avatar: '/path/to/avatar2.png' },
  // Add more configurations as needed
];

export default function Sidebar({ setSystemPrompt }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSidebarOpen = () => {
    setIsOpen(true);
  };

  const handleSidebarClose = () => {
    setIsOpen(false);
  };

  const handleConfigurationClick = (systemPrompt) => {
    setSystemPrompt(systemPrompt);
    handleSidebarClose();
  };

  return (
    <>
      <button
        onClick={handleSidebarOpen}
        className="absolute top-4 left-4"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-0 z-10 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleSidebarClose}
      ></div>

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white p-4 overflow-y-auto z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={handleSidebarClose}
          className="absolute top-4 right-4"
        >
          <X className="w-6 h-6" />
        </button>

        <ul>
          {configurations.map((config) => (
            <li
              key={config.name}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleConfigurationClick(config.systemPrompt)}
            >
              <img src={config.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
              {config.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
