"use client";
import React, { useState, useEffect } from 'react';
import { X, Menu, PlusCircle, MoreVertical, Trash2 } from 'lucide-react';
import ConfigAdd from './ConfigAdd';

interface Configuration {
  id: number;
  name: string;
  systemPrompt: string;
  avatar: string;
}
interface SidebarProps {
  setSystemPrompt: (prompt: string) => void;
  clearMessages: (messages: []) => void; // Add this
  setSelectedConfigName: (name: string) => void; // And this
}
export default function Sidebar({ setSystemPrompt, clearMessages, setSelectedConfigName }: SidebarProps) {  const [isOpen, setIsOpen] = useState(false);
  const [showConfigAdd, setShowConfigAdd] = useState(false);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<Configuration | null>(null);

  useEffect(() => {
    async function fetchConfigurations() {
      try {
        const response = await fetch('/api/configurations');
        if (!response.ok) {
          throw new Error('Failed to fetch configurations');
        }
        const configs: Configuration[] = await response.json();
        setConfigurations(configs);
      } catch (error) {
        console.error('Error fetching configurations:', error);
      }
    }

    fetchConfigurations();
  }, []);

  const handleAddNewConfig = (newConfig: Configuration) => {
    setConfigurations([...configurations, newConfig]);
    setShowConfigAdd(false);
  };

  const handleSidebarOpen = () => setIsOpen(true);
  const handleSidebarClose = () => setIsOpen(false);

  const handleConfigurationClick = (config: Configuration) => {
    setSystemPrompt(config.systemPrompt);
    clearMessages([]); // Clear messages when a configuration is selected
    setSelectedConfigName(config.name); // Set the selected configuration name
    handleSidebarClose();
  };

  const handleDeleteConfig = async (configId: number) => {
    try {
      // Note the use of query parameters for DELETE request
      const response = await fetch(`/api/configurations?id=${configId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }
      setConfigurations(configurations.filter((config) => config.id !== configId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const openDeleteConfirm = (config: Configuration, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfigToDelete(config);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setConfigToDelete(null);
  };

  return (
    <>
      <button onClick={handleSidebarOpen} className="absolute top-4 left-4">
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-0 z-10 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleSidebarClose}
      />

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white p-4 overflow-y-auto z-20 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
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
              <button onClick={(e) => openDeleteConfirm(config, e)} className="p-1">
                <MoreVertical className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-0 left-0 w-full h-16 bg-white p-4 flex items-center justify-between cursor-pointer z-20 border-t" onClick={() => setShowConfigAdd(true)}>
          <PlusCircle className="w-6 h-6 text-gray-700" />
          <span className="text-gray-700 font-semibold">Create Config</span>
        </div>
      </div>

      {showDeleteConfirm && configToDelete && (
        <div className="fixed inset-0 z-30 flex justify-center items-center">
          <div className="bg-black opacity-50 absolute inset-0" onClick={closeDeleteConfirm}></div>
          <div className="bg-white p-4 rounded-lg z-40 relative">
            <span className="block text-sm font-semibold mb-4">Delete configuration</span>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteConfig(configToDelete.id)}>
              Delete
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded ml-2" onClick={closeDeleteConfirm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showConfigAdd && <ConfigAdd onAdd={handleAddNewConfig} onClose={handleSidebarClose} />}
    </>
  );
}
