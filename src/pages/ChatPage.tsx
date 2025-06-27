import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLoaderData, useFetcher } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { useModels, useSelectedModel } from '../context/ModelContext';
import { sendMessageToModel, getDisplayName, getProviderName, type ChatMessage } from '../lib/openrouter';
import tapaIcon from '../assets/tapa-icon.png';
import { ThemeToggle, MascotGuide } from '../components';
import type { ChatLoaderData } from '../routes/chat';
import { 
  Brain, 
  ArrowLeft, 
  PaperPlaneTilt, 
  User, 
  Robot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Warning
} from '@phosphor-icons/react';

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
          {message.isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          ) : (
            <div className="prose prose-sm max-w-none leading-relaxed">
              <ReactMarkdown
                components={{
                  // Customize code blocks
                  code: ({ node, inline, className, children, ...props }) => {
                    return inline ? (
                      <code
                        className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto">
                        <code className="font-mono text-sm" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  // Customize links
                  a: ({ children, href, ...props }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  // Customize headings
                  h1: ({ children, ...props }) => (
                    <h1 className="text-xl font-bold mb-2 text-gray-900" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-lg font-bold mb-2 text-gray-900" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-base font-bold mb-1 text-gray-900" {...props}>
                      {children}
                    </h3>
                  ),
                  // Customize lists
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1" {...props}>
                      {children}
                    </ol>
                  ),
                  // Customize paragraphs
                  p: ({ children, ...props }) => (
                    <p className="mb-2 last:mb-0" {...props}>
                      {children}
                    </p>
                  ),
                  // Customize blockquotes
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-2" {...props}>
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
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
        {!message.isUser && message.id !== 'welcome' && (
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
  const { availableModels, loading: modelsLoading, error: modelsError } = useModels();
  const { selectedModel, setSelectedModel } = useSelectedModel();
  const fetcher = useFetcher();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMascotMinimized, setIsMascotMinimized] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For backward compatibility, we'll use a fallback model config
  const modelConfig = selectedModel ? {
    name: getDisplayName(selectedModel),
    avatar: 'bg-gradient-to-r from-blue-500 to-purple-600',
    color: 'from-blue-500 to-purple-600'
  } : {
    name: 'AI Assistant',
    avatar: 'bg-gradient-to-r from-gray-500 to-gray-600',
    color: 'from-gray-500 to-gray-600'
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    if (selectedModel && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello! I'm ${getDisplayName(selectedModel)}. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedModel]);

  // Reset messages when model changes
  useEffect(() => {
    if (selectedModel) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello! I'm ${getDisplayName(selectedModel)}. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedModel]);

  // Convert our messages to OpenRouter format
  const convertToOpenRouterMessages = (messages: Message[]): ChatMessage[] => {
    return messages
      .filter(msg => msg.id !== 'welcome') // Exclude welcome message
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedModel) return;

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
      // Prepare messages for OpenRouter API
      const chatMessages = convertToOpenRouterMessages([...messages, userMessage]);
      
      // Send message to OpenRouter API
      const result = await sendMessageToModel(selectedModel.id, chatMessages);

      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.content,
        isUser: false,
        timestamp: new Date(),
        tokens: result.tokensUsed,
        responseTime: result.responseTime
      };

      setMessages(prev => [...prev, aiMessage]);

      // Log interaction to database using fetcher
      const formData = new FormData();
      formData.append('modelName', selectedModel?.id || 'unknown');
      formData.append('prompt', userMessage.content);
      formData.append('response', result.content);
      formData.append('tokensUsed', result.tokensUsed.toString());
      formData.append('responseTimeMs', result.responseTime.toString());
      
      fetcher.submit(formData, { method: 'post' });

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorContent = error instanceof Error 
        ? `Sorry, I encountered an error: ${error.message}` 
        : 'Sorry, I encountered an unexpected error. Please try again.';
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    const model = availableModels.find(m => m.id === modelId);
    setSelectedModel(model || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (modelsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI models...</p>
        </div>
      </div>
    );
  }

  // Show error if models failed to load
  if (modelsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Models</h2>
          <p className="text-gray-600 mb-6">{modelsError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center py-4">
            {/* Left: TAPA Logo */}
            <div className="flex items-center justify-start">
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

            {/* Center: Model Selector */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${modelConfig.color} rounded-xl flex items-center justify-center`}>
                  <Brain className="w-6 h-6 text-white" weight="bold" />
                </div>
                <div>
                  <select
                    value={selectedModel?.id || ''}
                    onChange={handleModelChange}
                    className="text-lg font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer min-w-0"
                  >
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {getDisplayName(model)}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-600">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Right: Theme Toggle */}
            <div className="flex items-center justify-end">
              <ThemeToggle />
            </div>
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
              {/* API Error Notice */}
              {!selectedModel && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Warning className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 text-sm">
                      No model selected. Please select a model to start chatting.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  maxLength={2000}
                  disabled={isLoading || !selectedModel}
                  className="flex-1 resize-none rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-4"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !selectedModel}
                  className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                    inputValue.trim() && !isLoading && selectedModel
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

      {/* Mascot Guide */}
      <MascotGuide 
        isMinimized={isMascotMinimized}
        onToggleMinimize={() => setIsMascotMinimized(!isMascotMinimized)}
      />
    </div>
  );
};

export default ChatPage;