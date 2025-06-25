import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLoaderData, useFetcher } from 'react-router';
import { useModelAccess } from '../hooks/useDatabase';
import tapaIcon from '../assets/tapa-icon.png';
import { AI_MODEL_CONFIG, AI_MODELS } from '../constants/aiModels';
import type { ChatLoaderData } from '../routes/chat';
import { 
  Brain, 
  ArrowLeft, 
  PaperPlaneTilt, 
  User, 
  Robot,
  Lightning,
  Crown,
  Star,
  ChatCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Warning
} from '@phosphor-icons/react';

// Icon mapping for dynamic icon rendering
const ICON_MAP = {
  ChatCircle,
  Lightning,
  Brain,
  Star,
  Crown
};

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  tokens?: number;
  responseTime?: number;
}

const ChatMessage: React.FC<{ message: Message; modelConfig: any }> = ({ message, modelConfig }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 mb-6 ${message.isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.isUser 
          ? 'bg-gradient-to-r from-[#812dea] to-[#4ea6fd]' 
          : modelConfig.avatar
      }`}>
        {message.isUser ? (
          <User className="w-5 h-5 text-white" weight="bold" />
        ) : (
          <Robot className="w-5 h-5 text-white" weight="bold" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${message.isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          message.isUser 
            ? 'bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          
          {/* Message metadata for AI responses */}
          {!message.isUser && (message.tokens || message.responseTime) && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              {message.tokens && (
                <span>{message.tokens} tokens</span>
              )}
              {message.responseTime && (
                <span>{message.responseTime}ms</span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons for AI messages */}
        {!message.isUser && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy message"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Good response"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Poor response"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            {copied && (
              <span className="text-xs text-green-600 font-medium">Copied!</span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC<{ modelConfig: any }> = ({ modelConfig }) => (
  <div className="flex gap-4 mb-6">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${modelConfig.avatar}`}>
      <Robot className="w-5 h-5 text-white" weight="bold" />
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useLoaderData() as ChatLoaderData;
  const fetcher = useFetcher();
  
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-3.5-turbo');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { hasAccess, loading: accessLoading } = useModelAccess(selectedModelId);
  const modelConfig = AI_MODEL_CONFIG[selectedModelId as keyof typeof AI_MODEL_CONFIG];

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    if (modelConfig && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello! I'm ${modelConfig.name}. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [modelConfig, selectedModelId]);

  // Reset messages when model changes
  useEffect(() => {
    if (modelConfig) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello! I'm ${modelConfig.name}. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedModelId]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple response simulation based on model
    const responses = {
      'gpt-3.5-turbo': `I understand you're asking about "${userMessage}". As GPT-3.5 Turbo, I can help you with a wide range of tasks including answering questions, writing, coding, and problem-solving. What specific aspect would you like me to focus on?`,
      'claude-3-haiku': `Thanks for your message about "${userMessage}". I'm Claude 3 Haiku, designed for quick and efficient responses. I can help you with various tasks while being concise and to the point. How can I assist you further?`,
      'gpt-4': `Regarding "${userMessage}" - I'm GPT-4, and I can provide detailed analysis and sophisticated reasoning. I'd be happy to explore this topic in depth with you. What particular angle or aspect interests you most?`,
      'claude-3-sonnet': `I see you're interested in "${userMessage}". As Claude 3 Sonnet, I can offer balanced and thoughtful responses across many domains. I'm particularly good at creative tasks and nuanced analysis. What would you like to explore?`,
      'gpt-4-turbo': `Thank you for bringing up "${userMessage}". I'm GPT-4 Turbo with enhanced capabilities and the latest knowledge. I can provide comprehensive assistance with complex tasks. How can I best help you with this?`,
      'claude-3-opus': `Regarding "${userMessage}" - I'm Claude 3 Opus, Anthropic's most capable model. I excel at complex reasoning and nuanced understanding. I'm here to provide thoughtful, detailed assistance. What specific help do you need?`
    };

    return responses[selectedModelId as keyof typeof responses] || "I'm here to help! Could you please rephrase your question?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedModelId || !hasAccess) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const startTime = Date.now();
      const aiResponse = await simulateAIResponse(userMessage.content);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const estimatedTokens = Math.floor(aiResponse.length / 4); // Rough token estimation

      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
        tokens: estimatedTokens,
        responseTime
      };

      setMessages(prev => [...prev, aiMessage]);

      // Log interaction to database using fetcher
      const formData = new FormData();
      formData.append('modelName', selectedModelId);
      formData.append('prompt', userMessage.content);
      formData.append('response', aiResponse);
      formData.append('tokensUsed', estimatedTokens.toString());
      formData.append('responseTimeMs', responseTime.toString());
      
      fetcher.submit(formData, { method: 'post' });

    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModelId(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // Get the icon component dynamically
  const IconComponent = ICON_MAP[modelConfig.icon as keyof typeof ICON_MAP] || Brain;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${modelConfig.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" weight="bold" />
                </div>
                <div className="flex-1">
                  <select
                    value={selectedModelId}
                    onChange={handleModelChange}
                    className="text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    {AI_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-600">AI Assistant</p>
                </div>
              </div>
            </div>
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={tapaIcon} 
                alt="TAPA Logo" 
                className="w-8 h-8"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-[#812dea] to-[#4ea6fd] bg-clip-text text-transparent">
                TAPA
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} modelConfig={modelConfig} />
              ))}
              {isTyping && <TypingIndicator modelConfig={modelConfig} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-6">
              {/* Access denied message */}
              {!hasAccess && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Warning className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 text-sm">
                      You don't have access to this model. Please upgrade your plan or select a different model.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${modelConfig.name}...`}
                    className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-h-32"
                    rows={1}
                    disabled={isLoading || !hasAccess}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !hasAccess}
                  className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                    inputValue.trim() && !isLoading && hasAccess
                      ? `bg-gradient-to-r ${modelConfig.color} text-white hover:shadow-lg transform hover:-translate-y-0.5`
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  ) : (
                    <PaperPlaneTilt className="w-5 h-5" weight="bold" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>{inputValue.length}/2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;