import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Gamepad2 } from 'lucide-react';
import GameSidebar from './GameSidebar';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { chatbotService } from '../services/chatbotService';

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm Avyra, your gaming assistant. I can help you find games, check system compatibility, and provide recommendations. What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const messagesEndRef = useRef(null);

  const quickActions = [
    'Recommend action games',
    'Show RPG games',
    'Check PC requirements',
    'Games under $50'
  ];

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadGames = async () => {
    try {
      const gameData = await chatbotService.getGames();
      setGames(gameData.games || []);
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        content: response.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  return (
    <div className="flex h-screen">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Robot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Avyra Game Assistant</h1>
              <p className="text-gray-600">Ask me about games, system requirements, or get recommendations!</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white/95 backdrop-blur-sm p-6 overflow-hidden">
          <div className="h-full overflow-y-auto chat-scrollbar pr-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/95 backdrop-blur-sm p-6 border-t border-gray-200">
          <div className="flex space-x-4 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                {action}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about games, requirements, recommendations..."
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Game Sidebar */}
      <GameSidebar games={games.slice(0, 4)} onGameClick={handleQuickAction} />
    </div>
  );
};

export default ChatbotInterface;
