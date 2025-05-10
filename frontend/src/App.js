import { useState, useEffect } from 'react';
import CVUpload from './components/CVUpload';
import ChatInterface from './components/ChatInterface';
import CVList from './components/CVList';
import './App.css';
import { API_BASE_URL } from './config/api';

function App() {
  const [cvs, setCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch CVs from API when component mounts
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      // Add a cache-busting query parameter
      const response = await fetch(`${API_BASE_URL}/api/cvs/?_=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch CVs');
      const data = await response.json();
      setCVs(data);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">CV Chatbot</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 bg-white shadow rounded-lg p-4">
            <CVUpload onCVUploaded={fetchCVs} />
            <CVList 
              cvs={cvs} 
              loading={loading} 
              selectedCV={selectedCV} 
              onSelectCV={setSelectedCV} 
              refreshCVs={fetchCVs}
            />
          </div>
          <div className="col-span-1 md:col-span-2 bg-white shadow rounded-lg p-4">
            <ChatInterface selectedCV={selectedCV} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
