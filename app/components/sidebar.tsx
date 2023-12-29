"use client";
// app/components/sidebar.tsx
import React, { useEffect, useState } from 'react';
import { X, Menu } from 'lucide-react';

export default function Sidebar({ setSystemPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await fetch('/api/configurations');
        if (!response.ok) {
          throw new Error('Failed to fetch configurations');
        }
        const configs = await response.json();
        setConfigurations(configs);
      } catch (error) {
        console.error('Error fetching configurations:', error);
        // Implement error handling as needed
      }
    };

    fetchConfigurations();
  }, []);

  const handleSidebarOpen = () => setIsOpen(true);
  const handleSidebarClose = () => setIsOpen(false);

  const handleConfigurationClick = (config) => {
    setSystemPrompt(config.system_prompt); // System prompt field name in database
    handleSidebarClose();
  };

  return (
    <>
      <button onClick={handleSidebarOpen} className="absolute top-4 left-4">
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-0 z-10 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleSidebarClose}
      />

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white p-4 overflow-y-auto z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <button onClick={handleSidebarClose} className="absolute top-4 right-4">
          <X className="w-6 h-6" />
        </button>

        <ul>
          {configurations.map((config) => (
            <li
              key={config.id} // Assuming 'id' is returned from the database
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleConfigurationClick(config)}
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