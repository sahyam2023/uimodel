import { useState, useRef, useEffect } from 'react';
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

// All knowledge packs are 100% preserved and now function correctly.
const baseKnowledge = [ { keywords: ['hello', 'hi', 'hey'], answer: 'Hello there! I am i2v Analyst, your predictive intelligence system. How may I assist?' }, { keywords: ['how are you', 'how r u'], answer: "All systems are operating at optimal capacity." }, { keywords: ['who are you', 'what are you'], answer: "I am i2v Analyst - an advanced predictive intelligence system." }, { keywords: ['thanks', 'thank you'], answer: "Acknowledged. Please feel free to submit additional queries." }, { keywords: ['help', 'capabilities'], answer: 'I specialize in predictive analytics and can also provide info about the system.' }, { keywords: ['status'], answer: 'All systems nominal.' }];
const aiKnowledge = [ { keywords: ['model', 'models', 'algorithm'], answer: 'The system utilizes a custom-tuned Transformer-based architecture, specifically optimized for sequence and time-series data analysis.' }, { keywords: ['gpu', 'cpu', 'hardware', 'nvidia'], answer: 'Analysis and training processes are accelerated using a distributed cluster of NVIDIA A100 Tensor Core GPUs for maximum computational efficiency.' }, { keywords: ['optimize', 'tune', 'hyperparameters'], answer: 'Hyperparameter tuning is an automated process, employing a Bayesian optimization algorithm to dynamically adjust learning rates and batch sizes.' }, { keywords: ['overfitting'], answer: 'To mitigate overfitting, the system employs L2 regularization, a dropout rate of 0.3, and early stopping protocols based on validation loss.' }, { keywords: ['validation', 'validate', 'test set'], answer: 'Model integrity is ensured through rigorous validation against a reserved 20% test set to provide an unbiased measure of real-world performance.' }, { keywords: ['training data', 'dataset'], answer: 'The current model is being trained on a dataset of approximately 1.5 million records, augmented with real-time data feeds.' }];
const cloudKnowledge = [ { keywords: ['cloud', 'aws', 'azure', 'gcp'], answer: 'The platform is built on a hybrid-cloud architecture, leveraging AWS for scalability and GCP for specialized AI/ML processing.' }, { keywords: ['scalability', 'scale', 'load'], answer: 'The system is designed for horizontal scalability using Kubernetes for container orchestration, allowing automatic scaling based on workload.' }, { keywords: ['server', 'infrastructure'], answer: 'Our infrastructure is fully containerized and managed via Infrastructure-as-Code (IaC) principles using Terraform, ensuring reproducible and stable environments.' }, { keywords: ['database', 'storage'], answer: 'We utilize a multi-tiered data storage solution, including a high-performance data warehouse and an object storage service like Amazon S3.' }];
const dataScienceKnowledge = [ { keywords: ['data pipeline', 'etl'], answer: 'Our data ingestion pipeline is a real-time ETL process, transforming data from multiple sources into a standardized analytical format.' }, { keywords: ['data quality', 'clean data'], answer: 'Data quality is paramount. Automated scripts run continuously to detect anomalies, handle missing values, and normalize data schemas.' }, { keywords: ['business intelligence', 'bi', 'dashboard'], answer: 'While my core function is predictive analytics, model outputs are often fed into BI dashboards like Tableau or Power BI for strategic insights.' }, { keywords: ['api', 'integration'], answer: 'Yes, predictive results can be accessed via a secure REST API endpoint for seamless integration into other enterprise applications.' }];
const securityKnowledge = [ { keywords: ['security', 'secure', 'encryption'], answer: 'Security is a core design principle. All data is encrypted using AES-256, both in transit and at rest. Access is controlled via strict IAM policies.' }, { keywords: ['compliance', 'gdpr', 'soc 2'], answer: 'The platform is designed to be compliant with major regulatory standards like GDPR and SOC 2, with all actions logged for full auditability.' }, { keywords: ['firewall', 'network'], answer: 'Our network architecture is protected by multiple layers of security, including web application firewalls (WAF) and DDoS mitigation services.' }];
const qaKnowledgeBase = [...baseKnowledge, ...aiKnowledge, ...cloudKnowledge, ...dataScienceKnowledge, ...securityKnowledge];

// Other constants
const predictiveKeywords = ['what is the probability of', 'what are the chances of', 'what is the likelihood of', 'what are the odds of', 'give me a forecast for', 'can you predict the', 'what is the chance of', 'how likely is it that', 'will there be', 'is it likely that', 'forecast the', 'predict the', 'how likely is', 'probability of', 'likelihood of', 'chances of', 'chance of', 'odds of', 'predict', 'forecast', 'will'].sort((a, b) => b.length - a.length);
// FIX: Made this list more specific to avoid accidental triggers
const followUpKeywords = ['why?', 'why', 'explain that', 'tell me more', 'elaborate', 'can you explain', 'based on what'];
const abstractKeywords = ['color of', 'smell of', 'feeling of', 'taste of', 'sound of', 'emotion of', 'spirit of', 'soul of', 'meaning of'];
const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'for', 'of', 'to', 'is', 'are', 'will', 'be', 'my', 'your']);
const simpleHash = (str: string): number => { let hash = 0; for (let i = 0; i < str.length; i++) { const char = str.charCodeAt(i); hash = (hash << 5) - hash + char; hash |= 0; } return Math.abs(hash); };
const processingPhrases = ['Accessing data streams...', 'Correlating patterns...', 'Running predictive models...', 'Analyzing temporal data...', 'Finalizing projection...'];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState<string>(processingPhrases[0]);

  const lastTopic = useRef<string | null>(null);
  const lastPredictionDetails = useRef<{ confidence: number; correlation: string; } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isProcessing]);
  useEffect(() => { if (isOpen && messages.length === 0) { setMessages([{ id: 'init-1', text: 'Hello there! I am i2v Analyst, your predictive intelligence system. How may I assist with your data analysis needs today?', isUser: false, timestamp: new Date() }]); } }, [isOpen]);
  useEffect(() => { let interval: NodeJS.Timeout; if (isProcessing) { let i = 0; interval = setInterval(() => { i = (i + 1) % processingPhrases.length; setProcessingText(processingPhrases[i]); }, 700); } return () => clearInterval(interval); }, [isProcessing]);

  const getContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase().trim();

    // ========================================================================
    // FIX: The logic has been re-ordered for correctness.
    // ========================================================================

    // 1. Check for a direct answer in the knowledge base FIRST.
    for (const qa of qaKnowledgeBase) {
      // Use a slightly stricter check to avoid partial word matches (e.g., 'hi' in 'which')
      if (qa.keywords.some(k => new RegExp(`\\b${k}\\b`).test(lowerInput))) {
        lastTopic.current = null; // Clear memory as this is a new topic
        return qa.answer;
      }
    }

    // 2. ONLY if no direct answer is found, check if it's a follow-up.
    // The `followUpKeywords` list is now more specific.
    if (followUpKeywords.includes(lowerInput) && lastTopic.current) {
      const details = lastPredictionDetails.current;
      return `The probability for ${lastTopic.current} is based on a convergence of multiple weighted indicators. Our model has identified strong signals in the temporal data, which historically precede such outcomes with roughly ${details?.confidence || 85}% accuracy.`;
    }
    
    // 3. ONLY if it's not a known question or a follow-up, check if it's a new prediction.
    const foundPredictiveKeyword = predictiveKeywords.find(k => lowerInput.startsWith(k) || lowerInput.includes(` ${k} `));
    if (foundPredictiveKeyword) {
      const keywordIndex = lowerInput.indexOf(foundPredictiveKeyword);
      let rawTopic = lowerInput.substring(keywordIndex + foundPredictiveKeyword.length).replace(/[?.,!]+$/, '').trim();
      let topic = rawTopic.split(/\s+/).filter(word => !stopWords.has(word) && word.length > 0).slice(0, 5).join(' ');
      if (!topic) topic = 'the specified event';

      if (abstractKeywords.some(k => rawTopic.includes(k))) {
        return "An interesting query. However, my analytical framework is optimized for quantifiable, real-world phenomena, not abstract concepts.";
      }
      
      lastTopic.current = topic;

      const seed = simpleHash(topic);
      const confidence = 82 + (seed % 18);
      const correlation = (0.75 + ((seed % 25) / 100)).toFixed(2);
      lastPredictionDetails.current = { confidence, correlation };

      const processingReportOptions = [`Cross-referencing temporal data streams... analysis complete.`, `Analyzing multi-variant patterns... projection finalized.`, `Computing historical correlations... model output generated.`];
      const processingReport = processingReportOptions[seed % processingReportOptions.length];
      const acknowledgment = `Regarding your query on ${topic}, one moment.`;
      const outcome = `The predictive model indicates a ${confidence}% probability, with a positive correlation factor of ${correlation}.`;
      const caveat = "This represents a statistical projection. Real-world outcomes may be influenced by unforeseen variables.";
      return `${acknowledgment}\n\n${processingReport}\n\n${outcome}\n\n${caveat}`;
    }

    // 4. If all else fails, provide the final, intelligent fallback.
    lastTopic.current = null;
    return "My apologies, that query is outside my current knowledge base. I specialize in predictive analytics and information about the training process.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;
    const currentInput = inputValue;
    const userMessage: ChatMessage = { id: Date.now().toString(), text: currentInput, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setProcessingText(processingPhrases[0]);
    
    const isPredictive = predictiveKeywords.some(k => currentInput.toLowerCase().includes(k));
    const processingDelay = isPredictive ? (2500 + Math.random() * 1000) : (500 + Math.random() * 300);
    
    setTimeout(() => {
      const botResponse: ChatMessage = { id: (Date.now() + 1).toString(), text: getContextualResponse(currentInput), isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, processingDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };
  
  // The JSX for rendering the chat remains the same.
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && ( <Button onClick={() => setIsOpen(true)} className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"> <MessageCircle className="h-8 w-8 text-white" /> </Button> )}
      {isOpen && (
        <Card className="w-96 h-[600px] shadow-2xl border-gray-700 bg-gray-800 text-white flex flex-col rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold">i2v Analyst</CardTitle>
              <span className="text-sm text-gray-400">Predictive Intelligence System</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-gray-700 h-8 w-8 p-0"> <X className="h-5 w-5" /> </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] py-2 px-3 rounded-lg text-sm shadow-md ${message.isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                    <div className="whitespace-pre-wrap leading-snug">{message.text}</div>
                    <div className={`text-xs mt-1 text-right ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                    <div className="bg-gray-700 py-2 px-3 rounded-lg rounded-bl-none shadow-md">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <span className="text-sm text-gray-400">{processingText}</span>
                        </div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-700 bg-gray-900">
              <div className="flex items-center space-x-2">
                <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask a predictive question..." className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500" disabled={isProcessing} />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isProcessing} className="bg-blue-600 hover:bg-blue-700"> <Send className="h-4 w-4" /> </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}