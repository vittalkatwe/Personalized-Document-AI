import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import AIPlanet from '../images/aiplanet.png';
import Logo from '../images/logo.png';
import { SendHorizontal } from 'lucide-react';
import './index.css'

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
    return `${nameWithoutExt.slice(0, maxLength - 3)}...${extension}`;
  };

  const LoadingIndicator = () => (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
        <img src={Logo} alt="Logo" width={100} height={100} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Analyzing document and composing response
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading && selectedFile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, selectedFile]);

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(response => response.json())
      .then(() => setServerStatus('online'))
      .catch(() => setServerStatus('offline'));
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload PDF');
      }

      const data = await response.json();
      console.log(data.message);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload PDF');
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    const userQuestion = question.trim();
    setMessages(prev => [...prev, { type: 'user', content: userQuestion }]);
    setQuestion('');

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get answer');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error('Error getting answer:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error while processing your question.'
      }]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  if (serverStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (serverStatus === 'offline') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Server Offline</h1>
          <p className="text-gray-600">Please start the FastAPI server first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={AIPlanet} alt="Planet" className="h-12" />
          </div>
          
          <div className="flex items-center gap-4">
            {selectedFile && (
              <div className="flex items-center gap-2 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                <svg
                  className="w-4 h-4 text-gray-600 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 2v7h7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm text-gray-600 truncate">
                  {truncateFileName(selectedFile.name)}
                </span>
              </div>
            )}
            <button
              onClick={() => document.getElementById('pdf-upload')?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
              disabled={isLoading}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="upload-pdf">Upload PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full relative custom-scrollbar">
        <div className="absolute inset-0 pt-6 pb-24 overflow-y-auto custom-scrollbar">
          <div className="px-4 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-purple-200 text-purple-600' 
                    : 'bg-green-100'
                }`}>
                  {message.type === 'user' ? 'S' : (
                    <img src={Logo} alt="Logo" width={100} height={100} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleQuestionSubmit} className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Send a message..."
              className={`w-full px-9 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                selectedFile
                  ? "bg-gray-100 text-gray-900 focus:ring-black-400 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={isLoading || !selectedFile}
            />
            <button
              type="submit"
              disabled={isLoading || !selectedFile || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>
        </form>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="pdf-upload"
          disabled={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
