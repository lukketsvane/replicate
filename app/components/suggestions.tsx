"use client";
import React from 'react';

const Suggestions = ({ selectedConfig }) => {
  // Define conversation starters based on the selected configuration
  const conversationStarters = getConversationStarters(selectedConfig);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Conversation Starters</h3>
      <div className="grid grid-cols-2 gap-2">
        {conversationStarters.map((starter, index) => (
          <button
            key={index}
            className="bg-blue-200 hover:bg-blue-300 text-blue-800 py-2 px-3 rounded-md text-sm"
            onClick={() => handleStarterClick(starter)} // Define a function to handle click
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
};

const getConversationStarters = (selectedConfig) => {
  // Define conversation starters based on the selected configuration
  // You can implement logic to fetch conversation starters based on the selected configuration here
  // For example, you can make an API request to retrieve starters associated with the selectedConfig
  // For demonstration, we'll use a static set of starters here
  if (selectedConfig === 'ConfigurationA') {
    return [
      "Conversation Starter 1 for ConfigurationA",
      "Conversation Starter 2 for ConfigurationA",
    ];
  } else if (selectedConfig === 'ConfigurationB') {
    return [
      "Conversation Starter 1 for ConfigurationB",
      "Conversation Starter 2 for ConfigurationB",
    ];
  } else {
    // Default starters if no specific configuration is selected
    return [
      "Default Conversation Starter 1",
      "Default Conversation Starter 2",
    ];
  }
};

const handleStarterClick = (starter) => {
  // Handle the click on a conversation starter (you can send it as a message to the chatbot)
  console.log(`Sending: "${starter}" to the chatbot`);
  // You can implement the logic to send the starter as a message to the chatbot here
};

export default Suggestions;
