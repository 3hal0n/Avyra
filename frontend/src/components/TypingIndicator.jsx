import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start space-x-3 max-w-3xl">
        <div className="p-2 rounded-full bg-blue-100">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
        <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-sm shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.16s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.32s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
