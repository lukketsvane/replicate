"use client";
interface EmptyChatMessageProps {
    configName: string;
  }
  
  const EmptyChatMessage: React.FC<EmptyChatMessageProps> = ({ configName }) => {
    const defaultMessage = "How can I help you today?";
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-xl font-light">{configName || defaultMessage}</p>
        </div>
      </div>
    );
  };
  
  export default EmptyChatMessage;
  