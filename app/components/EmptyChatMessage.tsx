"use client";

interface EmptyChatMessageProps {
  configName: string;
  configDescription: string; // Add configDescription prop
} 

const EmptyChatMessage: React.FC<EmptyChatMessageProps> = ({ configName, configDescription }) => {
  const defaultMessage = "How can I help you today?";
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-xl font-light">{configName || defaultMessage}</p>
        {configDescription && ( // Display description if available
          <p className="text-sm text-gray-500">{configDescription}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyChatMessage;
