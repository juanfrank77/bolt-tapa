import React, { useState, useEffect, useRef } from 'react';
import tapaMascot from '../assets/Tapa-mascot3.png';
import { 
  ChatCircle, 
  Sparkle, 
  ArrowRight, 
  X,
  Minus,
  Maximize
} from '@phosphor-icons/react';

interface MascotMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser?: boolean;
}

interface MascotGuideProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  className?: string;
}

const MASCOT_MESSAGES = [
  {
    id: '1',
    content: "Hi there! I'm TAPA, your friendly AI companion! Welcome to the wonderful world of AI!",
    timestamp: new Date(Date.now() - 5000),
  },
  {
    id: '2',
    content: "I'm here to help you navigate through different AI models and make the most of your experience. Think of me as your personal guide in this exciting journey!",
    timestamp: new Date(Date.now() - 4000),
  },
  {
    id: '3',
    content: "You can choose from various AI models above - each one has unique strengths! Free models like Gemma 3 and Llama 4 Scout are perfect for getting started.",
    timestamp: new Date(Date.now() - 3000),
  },
  {
    id: '4',
    content: "Feel free to ask me anything about using this app, understanding AI models, or getting the most out of your conversations. I'm here to help! 😊",
    timestamp: new Date(Date.now() - 1000),
  }
];

const QUICK_QUESTIONS = [
  "What's the difference between free and premium models?",
  "How do I start a conversation?",
  "Can you explain what tokens are?"
];

const MASCOT_RESPONSES: { [key: string]: string } = {  
  "What's the difference between free and premium models?": "Excellent question! 💡 Here's the breakdown:\n\n**Free Models:**\n• Fast responses\n• Great for basic tasks\n• Perfect for learning AI\n• No cost!\n\n**Premium Models:**\n• More sophisticated reasoning\n• Better at complex tasks\n• Longer context memory\n• Enhanced creativity\n\nThink of it like upgrading from a bicycle to a sports car - both get you there, but one has more power! 🚗",
  
  "How do I start a conversation?": "Super easy! 🚀 Just follow these steps:\n\n1. **Click 'Start Chatting'** on the button you'll find on the dashboard\n2. **Type your message** in the chat box\n4. **Press Enter** to send\n\nThat's it! The AI will respond and you can have a natural conversation. Try asking about anything - from help with your work to creative writing! ✨",
  
  "Can you explain what tokens are?": "Sure thing! 🎯 Tokens are like the 'words' that AI models understand:\n\n• **1 token ≈ 0.75 words** in English\n• **'Hello world'** = about 2 tokens\n• **Longer messages** = more tokens\n\nWhy does this matter? Some models have token limits for conversations, and premium services might charge based on tokens used. But don't worry - for normal chatting, you rarely need to think about this! 📊",
};

export const MascotGuide: React.FC<MascotGuideProps> = ({ 
  isMinimized = false, 
  onToggleMinimize,
  className = ''
}) => {
  const [messages, setMessages] = useState<MascotMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-play initial messages
  useEffect(() => {
    if (currentMessageIndex < MASCOT_MESSAGES.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, MASCOT_MESSAGES[currentMessageIndex]]);
        setCurrentMessageIndex(prev => prev + 1);
      }, currentMessageIndex === 0 ? 1000 : 2000);

      return () => clearTimeout(timer);
    } else {
      // Show quick questions after all initial messages
      const timer = setTimeout(() => {
        setShowQuickQuestions(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: MascotMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setShowQuickQuestions(false);

    // Add mascot response
    setTimeout(() => {
      const response = MASCOT_RESPONSES[content] || 
        "That's a great question! 🤔 While I have responses for common questions, I'm still learning. Try asking about choosing AI models, understanding tokens, or how to get started with conversations!";
      
      const mascotResponse: MascotMessage = {
        id: `mascot-${Date.now()}`,
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mascotResponse]);
      
      // Show quick questions again after response
      setTimeout(() => {
        setShowQuickQuestions(true);
      }, 1000);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(userInput);
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={onToggleMinimize}
          className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <img 
            src={tapaMascot} 
            alt="TAPA Mascot" 
            className="w-8 h-8"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full max-h-[600px] transition-all duration-300 ease-out animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <img 
            src={tapaMascot} 
            alt="TAPA Mascot" 
            className="w-10 h-10 rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-bold text-white">TAPA</h3>
            <p className="text-sm text-purple-100">Your AI Companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 transform"
            >
              <Minus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: '320px' }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
            {!message.isUser && (
              <img 
                src={tapaMascot} 
                alt="TAPA Mascot" 
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
            <div className={`max-w-xs ${message.isUser ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-2xl ${
                message.isUser 
                  ? 'bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm whitespace-pre-line leading-relaxed">
                  {message.content}
                </div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : ''}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Quick Questions */}
        {showQuickQuestions && messages.length > 0 && (
          <div className="space-y-2 animate-fade-in-up animate-delay-300">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkle className="w-4 h-4" weight="fill" />
              <span>Quick questions you can ask:</span>
            </div>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="block w-full text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 hover:scale-105 transform hover:shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask TAPA anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={() => handleSendMessage(userInput)}
            disabled={!userInput.trim()}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 transform ${
              userInput.trim()
                ? 'bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white hover:shadow-lg hover:shadow-purple-500/25'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="w-4 h-4" weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MascotGuide;