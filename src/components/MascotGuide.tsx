import React, { useState, useEffect, useRef } from 'react';
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
  className?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const MASCOT_MESSAGES = [
  {
    id: '1',
    content: "Hi there! I'm TAPA, your friendly AI companion! 🍕 Welcome to the world of artificial intelligence!",
    timestamp: new Date(Date.now() - 5000),
  },
  {
    id: '2',
    content: "I'm here to help you navigate through different AI models and make the most of your experience. Think of me as your personal guide in this exciting journey!",
    timestamp: new Date(Date.now() - 4000),
  },
  {
    id: '3',
    content: "You can choose from various AI models above - each one has unique strengths! Free models like GPT-3.5 and Claude Haiku are perfect for getting started.",
    timestamp: new Date(Date.now() - 3000),
  },
  {
    id: '4',
    content: "Want to try something more advanced? Premium models like GPT-4 offer enhanced reasoning and can handle more complex tasks. Just upgrade your plan when you're ready!",
    timestamp: new Date(Date.now() - 2000),
  },
  {
    id: '5',
    content: "Feel free to ask me anything about using TAPA, understanding AI models, or getting the most out of your conversations. I'm here to help! 😊",
    timestamp: new Date(Date.now() - 1000),
  }
];

const QUICK_QUESTIONS = [
  "How do I choose the right AI model?",
  "What's the difference between free and premium models?",
  "How do I start a conversation?",
  "Can you explain what tokens are?",
  "How do I upgrade my plan?"
];

const MASCOT_RESPONSES: { [key: string]: string } = {
  "How do I choose the right AI model?": "Great question! 🤔 Each AI model has different strengths:\n\n• **GPT-3.5 & Claude Haiku** (Free) - Perfect for everyday tasks, quick questions, and learning\n• **GPT-4 & Claude Sonnet** (Premium) - Better for complex reasoning, detailed analysis, and creative work\n• **Enterprise models** - Advanced features for professional use\n\nStart with free models to get comfortable, then upgrade when you need more power!",
  
  "What's the difference between free and premium models?": "Excellent question! 💡 Here's the breakdown:\n\n**Free Models:**\n• Fast responses\n• Great for basic tasks\n• Perfect for learning AI\n• No cost!\n\n**Premium Models:**\n• More sophisticated reasoning\n• Better at complex tasks\n• Longer context memory\n• Enhanced creativity\n\nThink of it like upgrading from a bicycle to a sports car - both get you there, but one has more power! 🚗",
  
  "How do I start a conversation?": "Super easy! 🚀 Just follow these steps:\n\n1. **Choose a model** from the cards above\n2. **Click 'Start Chatting'** on any available model\n3. **Type your message** in the chat box\n4. **Press Enter** to send\n\nThat's it! The AI will respond and you can have a natural conversation. Try asking about anything - from homework help to creative writing! ✨",
  
  "Can you explain what tokens are?": "Sure thing! 🎯 Tokens are like the 'words' that AI models understand:\n\n• **1 token ≈ 0.75 words** in English\n• **'Hello world'** = about 2 tokens\n• **Longer messages** = more tokens\n\nWhy does this matter? Some models have token limits for conversations, and premium services might charge based on tokens used. But don't worry - for normal chatting, you rarely need to think about this! 📊",
  
  "How do I upgrade my plan?": "Ready to unlock more power? 🔓 Here's how:\n\n1. **Click your profile** in the top right\n2. **Select 'Upgrade Plan'** from the menu\n3. **Choose Premium or Enterprise** based on your needs\n4. **Complete the payment** process\n\nPremium gives you access to GPT-4, Claude Sonnet, and other advanced models. Enterprise includes everything plus priority support and custom features! 💎"
};

export const MascotGuide: React.FC<MascotGuideProps> = ({ 
  className = "", 
  isMinimized = false, 
  onToggleMinimize 
}) => {
  const [messages, setMessages] = useState<MascotMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        "That's a great question! 🤔 While I have responses for common questions, I'm still learning. Try asking about choosing AI models, understanding plans, or how to get started with conversations!";
      
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
            src="/src/assets/Tapa-mascot3.png" 
            alt="TAPA Mascot" 
            className="w-8 h-8"
          />
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <img 
            src="/src/assets/Tapa-mascot3.png" 
            alt="TAPA Mascot" 
            className="w-10 h-10 rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-bold text-white">TAPA Guide</h3>
            <p className="text-sm text-purple-100">Your AI Companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
            {!message.isUser && (
              <img 
                src="/src/assets/Tapa-mascot3.png" 
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkle className="w-4 h-4" weight="fill" />
              <span>Quick questions you can ask:</span>
            </div>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="block w-full text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
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
            className={`p-2 rounded-lg transition-colors ${
              userInput.trim()
                ? 'bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white hover:shadow-lg'
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