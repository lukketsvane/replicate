"use client";
import React, { useEffect, useState } from 'react';
import { X, Menu, PlusCircle, MoreVertical, Edit3 } from 'lucide-react';
import ConfigAdd from './ConfigAdd';

export default function Sidebar({ setSystemPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfigAdd, setShowConfigAdd] = useState(false);
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
      }
    };

    fetchConfigurations();
  }, []);

  const handleAddNewConfig = (newConfig) => {
    setConfigurations([...configurations, newConfig]);
    setShowConfigAdd(false);
  };

  const handleSidebarOpen = () => setIsOpen(true);
  const handleSidebarClose = () => setIsOpen(false);

  const handleConfigurationClick = (config) => {
    setSystemPrompt(config.system_prompt);
    handleSidebarClose();
  };

  const handleDeleteConfig = async (configId) => {
    try {
      const response = await fetch(`/api/configurations/${configId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }
      setConfigurations(configurations.filter((config) => config.id !== configId));
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
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
        className={`fixed top-0 left-0 w-146 h-full bg-white p-4 overflow-y-auto z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <button onClick={handleSidebarClose} className="absolute top-4 right-4">
          <X className="w-6 h-6" />
        </button>

        <ul>
          {configurations.map((config) => (
            <li
              key={config.id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer relative"
              onClick={() => handleConfigurationClick(config)}
            >
              <img src={config.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
              <span className="flex-1">{config.name}</span>
              <button onClick={(e) => { e.stopPropagation(); /* other code to show options */ }} className="p-1">
                <MoreVertical className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteConfig(config.id); }} className="p-1">
                <Edit3 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="fixed bottom-0 left-0 w-104 h-16 bg-white p-4 flex items-center justify-between cursor-pointer z-20 border-t"
     onClick={() => setShowConfigAdd(true)}>
        <PlusCircle className="w-6 h-6 text-gray-700" /> 
        <span className="text-gray-700 font-semibold">Create Config</span>
      </div>
      </div>

      {showConfigAdd && <ConfigAdd onAdd={handleAddNewConfig} />}
    </>
  );
}
