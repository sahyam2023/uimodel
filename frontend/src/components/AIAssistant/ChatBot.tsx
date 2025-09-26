import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage } from '@/types';

const qaKnowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey'],
    answer: 'Hello there! How can I assist you with your model training today?'
  },
  {
    keywords: ['how are you', 'how is it going'],
    answer: "I'm just a set of algorithms, but I'm operating at peak efficiency! Thanks for asking."
  },
  {
    keywords: ['who are you', 'what are you'],
    answer: "I'm your AI assistant, here to help you navigate the workspace and answer questions about your models."
  },
  {
    keywords: ['thanks', 'thank you'],
    answer: "You're welcome! Let me know if there's anything else I can help with."
  },
  {
    keywords: ['training time', 'how long to train'],
    answer: 'Model training typically takes between 3 to 10 minutes, depending on the dataset size and model complexity.'
  },
  {
    keywords: ['what model', 'which algorithm'],
    answer: 'We are using a custom-tuned version of a Transformer-based architecture, specifically optimized for sequence and time-series data.'
  },
  {
    keywords: ['dataset size', 'how much data'],
    answer: 'The current dataset contains approximately 1.5 million records, split into training, validation, and test sets.'
  },
  {
    keywords: ['hyperparameters', 'tuning'],
    answer: 'Key hyperparameters include a learning rate of 0.001, a batch size of 64, and 10 training epochs. These are configurable in the workspace.'
  },
  {
    keywords: ['can i stop', 'interrupt training'],
    answer: 'Yes, you can manually stop the training process at any time using the "Stop Training" button in the Training Card.'
  },
  {
    keywords: ['what happens after training', 'next step'],
    answer: 'After training is complete, the model results, including accuracy and performance metrics, will be displayed in the Deployment Card.'
  },
  {
    keywords: ['gpu', 'hardware'],
    answer: 'Training is accelerated using NVIDIA A100 GPUs to ensure efficient processing.'
  },
  {
    keywords: ['validation set', 'how is it validated'],
    answer: 'The model is validated against a separate 20% validation set to measure its performance on unseen data during training.'
  },
  {
    keywords: ['overfitting', 'prevent overfitting'],
    answer: 'We use techniques like dropout with a rate of 0.3 and early stopping to prevent overfitting.'
  },
  {
    keywords: ['change parameters', 'adjust settings'],
    answer: 'You can adjust model parameters like learning rate, epochs, and batch size in the "Configuration" card before starting the training.'
  },
  {
    keywords: ['what data', 'data format'],
    answer: 'The model expects data in CSV format, with features in separate columns and the target variable clearly identified.'
  },
  {
    keywords: ['monitor progress', 'track training'],
    answer: 'You can monitor live training progress, including accuracy and loss, in the "Live Monitoring" sidebar that appears during training.'
  }
];

interface ChatBotProps {
  isTraining?: boolean;
  hasResults?: boolean;
  accuracy?: number;
}

export function ChatBot({ isTraining = false, hasResults = false, accuracy }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();

  const getContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Check knowledge base first
    for (const qa of qaKnowledgeBase) {
      for (const keyword of qa.keywords) {
        if (lowerInput.includes(keyword)) {
          return qa.answer;
        }
      }
    }
    
    if (lowerInput.includes('status')) {
      if (location.pathname === '/dashboard') {
        return 'System status is normal. All clusters are operational.';
      } else if (location.pathname === '/workspace') {
        if (isTraining) {
          return 'The model is currently training. You can see live progress in the monitoring panel.';
        } else if (hasResults) {
          return 'Model generation is complete. You can view the results now.';
        } else {
          return 'Ready to start model training. Please upload your data and configure parameters.';
        }
      }
      return 'All systems are running normally.';
    }
    
    if (lowerInput.includes('accuracy') && hasResults && accuracy) {
      return `The current model achieved ${accuracy}% accuracy on the validation set.`;
    }
    
    if (lowerInput.includes('help')) {
      if (location.pathname === '/workspace') {
        return 'I can help you with model training. Upload your data, configure parameters, and start training. I\'ll monitor the progress for you.';
      } else if (location.pathname === '/dashboard') {
        return 'This dashboard shows your AI infrastructure overview. You can monitor model performance, compute usage, and system metrics.';
      }
      return 'I can help you navigate the platform and answer questions about your AI models.';
    }
        
    return "sorry please try later.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: getContextualResponse(inputValue),
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg z-50"
        size="sm"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 h-96 bg-slate-900 border-slate-700 shadow-xl z-40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-indigo-400" />
              <span>AI Assistant</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}