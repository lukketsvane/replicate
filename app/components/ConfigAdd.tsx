"use client";
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';

interface ConfigAddProps {
  onAdd: (config: { name: string; systemPrompt: string; avatar: string }) => void;
}

export default function ConfigAdd({ onAdd }: ConfigAddProps) {
  const [configName, setConfigName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [avatarURL, setAvatarURL] = useState('');

  const handleAddConfig = async () => {
    const newConfig = {
      name: configName,
      systemPrompt: systemPrompt,
      avatar: avatarURL,
    };
    
    const response = await fetch('/api/configurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newConfig),
    });

    if (response.ok) {
      onAdd(newConfig);
      setConfigName('');
      setSystemPrompt('');
      setAvatarURL('');
    } else {
      console.error('Failed to save the configuration');
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="configName" className="block text-sm font-medium text-gray-700">Configuration Name</label>
          <input
            type="text"
            id="configName"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">System Prompt</label>
          <input
            type="text"
            id="systemPrompt"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="avatarURL" className="block text-sm font-medium text-gray-700">Avatar URL</label>
          <input
            type="text"
            id="avatarURL"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={avatarURL}
            onChange={(e) => setAvatarURL(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleAddConfig}
          >
            <PlusCircle className="w-5 h-5 mr-2" aria-hidden="true" />
            Add Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
