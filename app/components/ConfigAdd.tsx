"use client";

import React, { useEffect, useState } from 'react';
import { X, Menu, PlusCircle, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import ConfigAdd from './ConfigAdd';

export default function Sidebar({ setSystemPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfigAdd, setShowConfigAdd] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);

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

  const handleDeleteConfig = async () => {
    if (selectedConfigId) {
      await fetch(`/api/configurations/${selectedConfigId}`, { method: 'DELETE' });
      setConfigurations(configurations.filter((config) => config.id !== selectedConfigId));
      setSelectedConfigId(null);
      setShowDeleteConfirmation(false);
    }
  };

  const handleSidebarOpen = () => setIsOpen(true);
  const handleSidebarClose = () => setIsOpen(false);

  const handleConfigurationClick = (config) => {
    setSystemPrompt(config.system_prompt);
    handleSidebarClose();
  };

  return (
    <>
      <button onClick={handleSidebarOpen} className="absolute top-4 left-4 z-30">
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50"
          onClick={handleSidebarClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-white p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <button onClick={handleSidebarClose} className="absolute top-4 right-4">
          <X className="w-6 h-6" />
        </button>

        <nav className="mt-8">
          {configurations.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleConfigurationClick(config)}
            >
              <div className="flex items-center">
                <img src={config.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
                <span>{config.name}</span>
              </div>
              <div className="flex">
                <button onClick={() => {}} className="p-1">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => {
                    setShowDeleteConfirmation(true);
                    setSelectedConfigId(config.id);
                  }} className="p-1">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}

          <div
            className="flex items-center justify-between p-2 mt-4 text-gray-700 font-semibold bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={() => setShowConfigAdd(true)}
          >
            <PlusCircle className="w-6 h-6" />
            <span>Create Config</span>
          </div>
        </nav>
      </aside>

      {showConfigAdd && <ConfigAdd onAdd={handleAddNewConfig} />}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this configuration?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDeleteConfig}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
