import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  const formatMessage = (content) => {
    // Convert line breaks to HTML and make game names bold
    const gameNames = ['Spiderman', 'God of War', 'Miles Morales', 'Stray', 'NBA 2K25', 'Cyberpunk 2077', 'Kingdom Come', 'Dark Souls'];
    let formattedContent = content;
    
    gameNames.forEach(game => {
      const regex = new RegExp(`\\b${game}\\b`, 'gi');
      formattedContent = formattedContent.replace(regex, `**$&**`);
    });
    
    return formattedContent;
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`flex max-w-3xl ${isBot ? 'flex-row' : 'flex-row-reverse'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`p-2 rounded-full ${isBot ? 'bg-blue-100' : 'bg-green-100'}`}>
          {isBot ? (
            <Bot className="w-5 h-5 text-blue-600" />
          ) : (
            <User className="w-5 h-5 text-green-600" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
          } shadow-sm`}
        >
          <div className="whitespace-pre-wrap break-words">
            {formatMessage(message.content).split('**').map((part, index) => 
              index % 2 === 1 ? <strong key={index}>{part}</strong> : part
            )}
          </div>
          <div className={`text-xs mt-1 ${isBot ? 'text-gray-500' : 'text-blue-100'}`}>
            {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
