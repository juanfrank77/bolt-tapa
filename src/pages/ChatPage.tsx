import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLoaderData, useFetcher } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { useModels, useSelectedModel } from '../context/ModelContext';
import { isGuestUser } from '../hooks/useAuth';
import { sendMessageToModel, getDisplayName, getProviderName, type ChatMessage as OpenRouterChatMessage } from '../lib/openrouter'; // Renamed ChatMessage to OpenRouterChatMessage to avoid conflict
import tapaIcon from '../assets/tapa-icon.png';
import { ThemeToggle, MascotGuide } from '../components'; // Assuming ThemeToggle is correctly exported from '../components'
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
  Warning,
  Crown,
  Sparkle
} from '@phosphor-icons/react';

// --- Type Definitions ---
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  tokens?: number;
  responseTime?: number;
}

// Interface for props passed to custom ReactMarkdown code renderer
interface CodeProps {
  node?: any; // The AST node, typically not used directly for simple rendering
  inline?: boolean; // Indicates if it's an inline code snippet or a block
  className?: string; // Class names from markdown (e.g., language-js)
  children?: React.ReactNode; // The content of the code block
  // Allow other standard HTML attributes that might be passed (e.g., 'style', 'data-*')
  [key: string]: any;
}
// --- End Type Definitions ---


// Guest user chat limit
const GUEST_CHAT_LIMIT = 5;

// --- ChatMessage Component ---
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
            : 'bg-white border border-gray-200 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white' // Dark mode styles added
        }`}>
          {message.isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          ) : (
            <div className="prose prose-sm max-w-none leading-relaxed">
              <ReactMarkdown
                components={{
                  // Customize code blocks
                  code: ({ node, inline, className, children, ...props }: CodeProps) => { // Using CodeProps here
                    return inline ? (
                      <code
                        className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono dark:bg-gray-600 dark:text-gray-100" // Dark mode styles added
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto dark:bg-gray-900 dark:text-gray-100 dark:border dark:border-gray-700"> {/* Dark mode styles added */}
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
                      className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-200" // Dark mode styles added
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  // Customize headings
                  h1: ({ children, ...props }) => (
                    <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white" {...props}> {/* Dark mode styles added */}
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white" {...props}> {/* Dark mode styles added */}
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-white" {...props}> {/* Dark mode styles added */}
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
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-2 dark:border-gray-600 dark:text-gray-300" {...props}> {/* Dark mode styles added */}
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
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"> {/* Dark mode styles added */}
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
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-700" // Dark mode styles added
              title="Copy message"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-gray-500 dark:hover:text-green-400 dark:hover:bg-green-900" // Dark mode styles added
              title="Good response"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900" // Dark mode styles added
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
        <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : ''} dark:text-gray-400`}> {/* Dark mode styles added */}
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// --- TypingIndicator Component ---
const TypingIndicator: React.FC<{ modelConfig: any }> = ({ modelConfig }) => (
  <div className="flex gap-4 mb-6">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${modelConfig.avatar}`}>
      <Robot className="w-5 h-5 text-white" weight="bold" />
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl p-4 dark:bg-gray-700 dark:border-gray-600"> {/* Dark mode styles added */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

// --- GuestLimitReached Component ---
const GuestLimitReached: React.FC = () => (
  <div className="border-t border-gray-100 p-6 dark:border-gray-700"> {/* Dark mode styles added */}
    <div className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-2xl p-6 text-white text-center">
      <Crown className="w-12 h-12 mx-auto mb-4" weight="bold" />
      <h3 className="text-xl font-bold mb-2">You've reached your guest limit!</h3>
      <p className="text-purple-100 mb-6">
        You've used all 5 free messages as a guest. Sign up for a free account to continue chatting and unlock more features!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center"> {/* Responsive: column on small, row on medium+ */}
        <Link
          to="/signup"
          className="bg-white text-[#812dea] px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Sign Up Free
        </Link>
        <Link
          to="/login"
          className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:border-white/50 transition-colors dark:border-white/50 dark:hover:border-white" // Dark mode styles added
        >
          Sign In
        </Link>
      </div>
      <div className="flex items-center justify-center mt-4 text-sm text-purple-100">
        <Sparkle className="w-4 h-4 mr-2" weight="fill" />
        <span>Free forever • No credit card required</span>
      </div>
    </div>
  </div>
);

// --- ChatPage Main Component ---
const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  // Ensure useLoaderData matches your actual loader setup (e.g., in App.tsx or your Router)
  const { user,  } = useLoaderData() as ChatLoaderData;
  const { availableModels, loading: modelsLoading, error: modelsError } = useModels();
  const { selectedModel, setSelectedModel } = useSelectedModel();
  const fetcher = useFetcher();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMascotMinimized, setIsMascotMinimized] = useState(true);
  const [guestChatCount, setGuestChatCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user is a guest
  const isGuest = user ? isGuestUser(user) : false;
  const hasReachedGuestLimit = isGuest && guestChatCount >= GUEST_CHAT_LIMIT;

  // For backward compatibility/fallback, define a model config
  const modelConfig = selectedModel ? {
    name: getDisplayName(selectedModel),
    avatar: 'bg-gradient-to-r from-blue-500 to-purple-600',
    color: 'from-blue-500 to-purple-600'
  } : {
    name: 'AI Assistant',
    avatar: 'bg-gradient-to-r from-gray-500 to-gray-600',
    color: 'from-gray-500 to-gray-600'
  };

  // Scroll to bottom when new messages are added or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize with welcome message when a model is selected and no messages exist
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
  }, [selectedModel, messages.length]); // Fix: Added messages.length to dependency array

  // Reset messages and guest count when the selected model changes
  useEffect(() => {
    if (selectedModel) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello! I'm ${getDisplayName(selectedModel)}. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setGuestChatCount(0); // Reset guest count when model changes
    }
  }, [selectedModel]);

  // Reset guest count when user changes (e.g., guest logs in or out)
  useEffect(() => {
    setGuestChatCount(0);
  }, [user]);

  // Converts our internal message format to the OpenRouter API format
  const convertToOpenRouterMessages = (messages: Message[]): OpenRouterChatMessage[] => {
    return messages
      .filter(msg => msg.id !== 'welcome') // Exclude the initial welcome message from API calls
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedModel || hasReachedGuestLimit) return;

    const userMessage: Message = {
      id: Date.now().toString(), // Unique ID for the message
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]); // Add user's message to chat history
    setInputValue(''); // Clear input field
    setIsLoading(true); // Indicate loading state
    setIsTyping(true); // Show typing indicator

    // Increment guest chat count if user is a guest
    if (isGuest) {
      setGuestChatCount(prev => prev + 1);
    }

    try {
      // Prepare messages (including the new user message) for the API call
      const chatMessages = convertToOpenRouterMessages([...messages, userMessage]);

      // Send message to the AI model via OpenRouter API
      const result = await sendMessageToModel(selectedModel.id, chatMessages);

      setIsTyping(false); // Hide typing indicator

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(), // Unique ID for AI response
        content: result.content,
        isUser: false,
        timestamp: new Date(),
        tokens: result.tokensUsed,
        responseTime: result.responseTime
      };

      setMessages(prev => [...prev, aiMessage]); // Add AI's response to chat history

      // Log interaction to database using fetcher (if user is not a guest)
      if (!isGuest) {
        const formData = new FormData();
        formData.append('modelName', selectedModel?.id || 'unknown');
        formData.append('prompt', userMessage.content);
        formData.append('response', result.content);
        formData.append('tokensUsed', result.tokensUsed.toString());
        formData.append('responseTimeMs', result.responseTime.toString());

        fetcher.submit(formData, { method: 'post' }); // Submit data to a Remix action or similar
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false); // Hide typing indicator on error

      // Display an error message to the user
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
      setIsLoading(false); // End loading state
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    const model = availableModels.find(m => m.id === modelId);
    setSelectedModel(model || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Send message on Enter key, allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      handleSendMessage();
    }
  };

  // --- Loading State for Models ---
  if (modelsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"> {/* Dark mode background added */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading AI models...</p> {/* Dark mode text added */}
        </div>
      </div>
    );
  }

  // --- Error State for Models ---
  if (modelsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"> {/* Dark mode background added */}
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">Unable to Load Models</h2> {/* Dark mode text added */}
          <p className="text-gray-600 mb-6 dark:text-gray-300">{modelsError}</p> {/* Dark mode text added */}
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

  // --- Main Chat Page Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"> {/* Dark mode background added */}
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-700"> {/* Dark mode styles added */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8"> {/* Responsive padding */}
          <div className="grid grid-cols-3 items-center py-4 gap-4 sm:gap-0"> {/* Responsive grid gap */}
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
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-3 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700" // Dark mode styles added
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
                    className="text-lg font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer min-w-0 dark:text-white" // Dark mode text added
                  >
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {getDisplayName(model)}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-600 pl-1 dark:text-gray-400"> {/* Dark mode text added */}
                    {selectedModel ? getProviderName(selectedModel) : 'AI Model'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Theme Toggle and Guest Status */}
            <div className="flex items-center justify-end">
              {isGuest && (
                <div className="hidden md:flex items-center space-x-2 text-sm"> {/* Hidden on small, flex on medium+ */}
                  <span className="text-gray-600 dark:text-gray-400">Guest:</span> {/* Dark mode text added */}
                  <span className={`font-medium ${hasReachedGuestLimit ? 'text-red-600' : 'text-blue-600'}`}>
                    {guestChatCount}/{GUEST_CHAT_LIMIT}
                  </span>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages and Input Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col dark:bg-gray-800"> {/* Dark mode background added */}
            {/* Guest Notice */}
            {isGuest && !hasReachedGuestLimit && (
              <div className="bg-blue-50 border-b border-blue-200 p-4 dark:bg-blue-950 dark:border-blue-800"> {/* Dark mode styles added */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" weight="bold" />
                    </div>
                    <div>
                      <p className="text-blue-900 font-medium dark:text-blue-200">You're chatting as a guest</p> {/* Dark mode text added */}
                      <p className="text-blue-700 text-sm dark:text-blue-300"> {/* Dark mode text added */}
                        {GUEST_CHAT_LIMIT - guestChatCount} messages remaining. Sign up to continue unlimited chatting!
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800" // Dark mode styles added
                  >
                    Sign Up Free
                  </Link>
                </div>
              </div>
            )}

            {/* Messages Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"> {/* Responsive padding */}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} modelConfig={modelConfig} />
              ))}
              {isTyping && <TypingIndicator modelConfig={modelConfig} />}
              <div ref={messagesEndRef} /> {/* Used for auto-scrolling to the bottom */}
            </div>

            {/* Input Area or Guest Limit Reached Message */}
            {hasReachedGuestLimit ? (
              <GuestLimitReached />
            ) : (
              <div className="border-t border-gray-100 p-6 dark:border-gray-700"> {/* Dark mode styles added */}
                {/* API Error Notice if no model is selected */}
                {!selectedModel && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800"> {/* Dark mode styles added */}
                    <div className="flex items-center">
                      <Warning className="w-5 h-5 text-yellow-600 mr-2 dark:text-yellow-400" /> {/* Dark mode text added */}
                      <p className="text-yellow-800 text-sm dark:text-yellow-200"> {/* Dark mode text added */}
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
                    disabled={isLoading || !selectedModel || hasReachedGuestLimit}
                    className="flex-1 resize-none rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-600 dark:focus:ring-opacity-50" // Dark mode styles added
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading || !selectedModel || hasReachedGuestLimit}
                    className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                      inputValue.trim() && !isLoading && selectedModel && !hasReachedGuestLimit
                        ? `bg-gradient-to-r ${modelConfig.color} text-white hover:shadow-lg transform hover:-translate-y-0.5`
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-500' // Dark mode styles added
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    ) : (
                      <PaperPlaneTilt className="w-5 h-5" weight="bold" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400"> {/* Dark mode text added */}
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <span>{inputValue.length}/2000</span>
                </div>
              </div>
            )}
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