"use client";

// app/components/ConfigurationCreator.tsx
import React, { useState } from 'react';

export default function ConfigurationCreator({ onNewConfiguration }) {
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newConfiguration = { name, system_prompt: systemPrompt, avatar };
      const response = await fetch('/api/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfiguration),
      });
      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }
      const result = await response.json();
      console.log('Configuration created:', result);
      onNewConfiguration(newConfiguration); // Callback to update parent component
      // Reset fields
      setName('');
      setSystemPrompt('');
      setAvatar('');
    } catch (error) {
      console.error('Error creating configuration:', error);
      // Implement error handling as needed
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <input
        className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Configuration Name"
        required
      />
      <textarea
        className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mt-2"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        placeholder="System Prompt"
        required
      />
      <input
        className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mt-2"
        type="text"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        placeholder="Avatar Path"
        required
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        type="submit"
      >
        Save Configuration
      </button>
    </form>
  );
}