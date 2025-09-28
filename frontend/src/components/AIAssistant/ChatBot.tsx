import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Knowledge base for standard Q&A
const qaKnowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    answer: 'Hello there! I am The Analyst, your predictive intelligence system. How may I assist with your data analysis needs today?'
  },
  {
    keywords: ['how are you', 'how is it going', 'how do you do'],
    answer: "All systems are operating at optimal capacity. My data processing engines are running efficiently across 127 concurrent analytical streams."
  },
  {
    keywords: ['who are you', 'what are you', 'introduce yourself'],
    answer: "I am The Analyst - an advanced predictive intelligence system designed to process multi-dimensional data streams and generate probabilistic projections across various domains."
  },
  {
    keywords: ['thanks', 'thank you', 'appreciated'],
    answer: "Acknowledged. Please feel free to submit additional queries for analysis at any time."
  },
  {
    keywords: ['help', 'what can you do', 'capabilities'],
    answer: 'I specialize in predictive analytics, probability assessments, trend forecasting, and data correlation analysis. Ask me about the likelihood of any future event or outcome.'
  },
  {
    keywords: ['status', 'system status', 'are you online'],
    answer: 'All systems nominal. Currently processing 847 data feeds with 99.7% uptime. Predictive algorithms are calibrated and ready.'
  }
];

// Comprehensive list of predictive keywords (sorted by length for optimal matching)
const predictiveKeywords = [
  'what is the probability of',
  'what are the chances of',
  'what is the likelihood of',
  'what are the odds of',
  'give me a forecast for',
  'can you predict the',
  'what is the chance of',
  'how likely is it that',
  'will there be',
  'is it likely that',
  'forecast the',
  'predict the',
  'how likely is',
  'probability of',
  'likelihood of',
  'chances of',
  'chance of',
  'odds of',
  'predict',
  'forecast',
  'will'
].sort((a, b) => b.length - a.length);

// Follow-up question indicators
const followUpKeywords = [
  'why', 'how', 'explain that', 'tell me more', 'what about it', 
  'elaborate', 'can you explain', 'how so', 'what makes you say',
  'based on what', 'why is that', 'how did you calculate',
  'what data shows', 'how is that possible'
];

// Abstract/nonsensical concepts that should be deflected
const abstractKeywords = [
  'color of', 'smell of', 'feeling of', 'taste of', 'sound of',
  'emotion of', 'spirit of', 'soul of', 'essence of', 'meaning of',
  'philosophy of', 'concept of', 'idea of', 'thought of'
];

// Stop words to filter from topic extraction
const stopWords = new Set([
  'a', 'an', 'the', 'in', 'on', 'for', 'of', 'to', 'is', 'are', 
  'will', 'be', 'my', 'your', 'his', 'her', 'their', 'our', 
  'this', 'that', 'these', 'those', 'and', 'or', 'but'
]);

// Simple deterministic hash function for consistency
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export default function AbsolutelyRobustChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Memory layer for contextual follow-ups
  const lastTopic = useRef<string | null>(null);
  const lastPredictionDetails = useRef<{
    confidence: number;
    correlation: string;
    methodology: string;
  } | null>(null);

  const getContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase().trim();

    // Handle follow-up questions first (Level 3: Contextual Memory)
    if (followUpKeywords.some(k => lowerInput.startsWith(k) || lowerInput.includes(k)) && lastTopic.current) {
      const seed = simpleHash(lastTopic.current);
      const details = lastPredictionDetails.current;
      
      const explanationTemplates = [
        `The high probability for ${lastTopic.current} is driven by convergent signals across multiple temporal data streams, showing a ${75 + (seed % 20)}% correlation with similar historical patterns.`,
        `Our multi-variant analysis of ${lastTopic.current} reveals significant anomalies in the recent data ingest, which historically precede such outcomes with ${details?.confidence || 85}% accuracy.`,
        `The forecast for ${lastTopic.current} is based on a weighted ensemble of 47 predictive indicators, with the primary driver being a pattern deviation detected in the ${seed % 2 === 0 ? 'temporal' : 'categorical'} correlation matrix.`,
        `Certainly. The assessment for ${lastTopic.current} leverages our proprietary trend analysis algorithm, which has identified ${3 + (seed % 5)} key inflection points in the underlying data structure.`
      ];
      
      return explanationTemplates[seed % explanationTemplates.length];
    }

    // Check standard knowledge base
    for (const qa of qaKnowledgeBase) {
      if (qa.keywords.some(k => lowerInput.includes(k))) {
        lastTopic.current = null; // Reset memory for non-predictive questions
        return qa.answer;
      }
    }

    // Level 1: Predictive Question Detection and Processing
    const foundKeyword = predictiveKeywords.find(k => 
      lowerInput.startsWith(k) || lowerInput.includes(` ${k} `) || lowerInput.includes(`${k} `)
    );
    
    if (foundKeyword) {
      // Dynamic topic extraction
      const keywordIndex = lowerInput.indexOf(foundKeyword);
      let rawTopic = lowerInput.substring(keywordIndex + foundKeyword.length)
        .replace(/[?.,!]+$/, '').trim();
      
      // Clean and filter topic
      const topicWords = rawTopic.split(/\s+/)
        .filter(word => !stopWords.has(word) && word.length > 0 && !/^\d+$/.test(word));
      
      let topic = topicWords.slice(0, 6).join(' ');
      if (!topic || topic.length < 2) topic = 'the specified event';
      
      // Level 4: Abstract/Nonsense Query Deflection
      if (abstractKeywords.some(k => rawTopic.includes(k)) || 
          /\b(number|letter|symbol|word)\s+\d+/.test(rawTopic) ||
          /(feeling|emotion|dream|thought|spirit|soul)(?!.*market|.*trend|.*economic)/.test(rawTopic)) {
        return "I appreciate the philosophical nature of your inquiry. However, my analytical framework is optimized for quantifiable, real-world phenomena with measurable data points. Abstract concepts fall outside my operational parameters.";
      }

      // Store topic in memory
      lastTopic.current = topic;
      
      // Level 2: Deterministic Consistency Engine
      const seed = simpleHash(topic);
      const confidence = 78 + (seed % 22); // 78-99% range
      const correlation = (0.72 + ((seed % 28) / 100)).toFixed(2); // 0.72-0.99 range
      const volatilityIndex = (seed % 15) + 5; // 5-19 range
      
      // Store prediction details for follow-ups
      lastPredictionDetails.current = {
        confidence,
        correlation,
        methodology: seed % 2 === 0 ? 'temporal regression' : 'multivariate clustering'
      };

      // Four-stage response structure
      const acknowledgment = `Regarding your query on ${topic}, initiating comprehensive data correlation analysis...`;
      
      const processingPhrase = seed % 3 === 0 
        ? "Cross-referencing 127 temporal data streams..." 
        : seed % 3 === 1 
        ? "Analyzing pattern matrices across multiple datasets..."
        : "Computing probabilistic projections from historical correlations...";
      
      const technicalDetails = [
        `volatility index of ${volatilityIndex}`,
        `convergence factor of ${correlation}`,
        `temporal displacement coefficient of ${(0.83 + (seed % 15) / 100).toFixed(2)}`,
        `multi-dimensional correlation strength of ${correlation}`
      ];
      
      const selectedDetail = technicalDetails[seed % technicalDetails.length];
      
      const outcome = `The predictive model indicates a ${confidence}% probability. Current analysis shows a ${selectedDetail} relative to baseline parameters.`;
      
      const caveat = "Please note: This represents a statistical projection based on available data patterns. Real-world outcomes may be influenced by variables outside the current analytical scope.";
      
      return `${acknowledgment} ${processingPhrase} ${outcome} ${caveat}`;
    }

    // Fallback responses
    if (lowerInput.includes('error') || lowerInput.includes('problem')) {
      return "All systems are functioning within normal parameters. If you're experiencing difficulties, please describe the specific issue for diagnostic analysis.";
    }
    
    if (lowerInput.includes('data') || lowerInput.includes('information')) {
      return "I have access to comprehensive multi-source data streams including temporal, categorical, and statistical datasets. What specific analysis would you like me to perform?";
    }

    // Reset memory for unrecognized queries
    lastTopic.current = null;
    return "I specialize in predictive analytics and probability assessments. Please ask me about the likelihood of future events, trends, or outcomes for optimal analysis.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Level 5: Simulated Processing Delay
    const processingDelay = 1200 + Math.random() * 800; // 1.2-2.0 seconds
    
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getContextualResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, processingDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-96 h-[500px] shadow-2xl border-2 border-blue-200 bg-gradient-to-b from-slate-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold">The Analyst</CardTitle>
              <span className="text-xs opacity-90">Predictive Intelligence System</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-800 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[400px] p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-gray-500 italic bg-blue-50 p-3 rounded-lg">
                  System initialized. Ready for predictive analysis queries.
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <span className="text-xs text-gray-600">Processing analysis...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about probabilities, forecasts, predictions..."
                  className="flex-1 text-sm border-gray-300 focus:border-blue-500"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}