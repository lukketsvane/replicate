"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Camera } from 'lucide-react';
import Image from 'next/image';

interface ConfigAddProps {
  onAdd: (config: { name: string; description: string; systemPrompt: string; avatar: string; starters: string[] }) => void;
  onClose: () => void;
}

export default function ConfigAdd({ onAdd, onClose }: ConfigAddProps) {
  const [configName, setConfigName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [starters, setStarters] = useState(['', '', '', '']);
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const configAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configAddRef.current && !configAddRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAddConfig = async () => {
    const newConfig = {
      name: configName,
      description: description, // New field
      systemPrompt: systemPrompt,
      avatar: avatarURL,
      starters: starters.filter(starter => starter.trim() !== '') // Filter out empty strings
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
  const updateStarter = (index: number, value: string) => {
    setStarters(starters.map((starter, i) => (i === index ? value : starter)));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      setIsUploading(true);
      try {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });

        if (response.ok) {
          const data = await response.json();
          setAvatarURL(data.url);
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    inputFileRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div ref={configAddRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          id="description"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mb-4">
          <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">System Prompt</label>
          <input
            type="text"
            id="systemPrompt"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-32"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>
        <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Conversation starters</label>

              <div className="grid grid-cols-1 gap-1 mb-4">
        {starters.map((starter, index) => (
          <input
            key={index}
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Conversation starter ${index + 1}`}
            value={starter}
            onChange={(e) => updateStarter(index, e.target.value)}
          />
        ))}
      </div>
      </div>
        <div className="mb-4">
          <label htmlFor="avatarImage" className="block text-sm font-medium text-gray-700">Avatar Image</label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
            {avatarURL ? (
                <Image src={avatarURL} alt="Avatar preview" width={48} height={48} />
              ) : isUploading ? (
                <span>Uploading...</span>
              ) : (
                <Camera className="w-12 h-12 text-gray-300" aria-hidden="true" />
              )}
            </span>
            <button
              type="button"
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={triggerFileInput}
            >
              <Camera className="w-5 h-5 mr-2" aria-hidden="true" />
              Upload
            </button>
            <input
              ref={inputFileRef}
              id="avatarImage"
              name="avatarImage"
              type="file"
              className="sr-only"
              onChange={handleImageUpload}
            />
          </div>
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
