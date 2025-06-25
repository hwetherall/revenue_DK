import { useState, useEffect } from 'react';
import { classifyBusiness, ClassificationResponse } from './lib/api';
import BusinessForm from './components/BusinessForm';
import ClassificationTable from './components/ClassificationTable';
import FileUpload from './components/FileUpload';

export default function App() {
  const [data, setData] = useState<ClassificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string>('Checking...');
  const [inputMode, setInputMode] = useState<'manual' | 'upload'>('manual');
  const [extractedData, setExtractedData] = useState<{ filename: string; text: string } | null>(null);

  // Check server health on mount
  useEffect(() => {
    fetch('/health')
      .then(res => res.json())
      .then(data => setServerStatus('Backend Connected ✅'))
      .catch(err => setServerStatus('Backend Not Responding ❌'));
  }, []);

  const handleSubmit = async (name: string, description: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await classifyBusiness(name, description);
      setData(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileExtracted = (filename: string, extractedText: string) => {
    setExtractedData({ filename, text: extractedText });
    setInputMode('upload');
    setError(null);
    setData(null);
  };

  const handleProcessFile = async () => {
    if (!extractedData) return;
    
    // Use the filename as the business name and the extracted text as description
    await handleSubmit(extractedData.filename.replace('.pdf', ''), extractedData.text);
  };

  const handleSwitchMode = (mode: 'manual' | 'upload') => {
    setInputMode(mode);
    setError(null);
    setData(null);
    if (mode === 'manual') {
      setExtractedData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          Business Model Classifier
        </h1>
        
        <div className="mb-4 text-sm text-gray-600">
          Server Status: <span className="font-medium">{serverStatus}</span>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-lg">
          {/* Mode Switcher */}
          <div className="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => handleSwitchMode('manual')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                inputMode === 'manual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => handleSwitchMode('upload')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                inputMode === 'upload'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload PDF
            </button>
          </div>

          {/* Input Method */}
          {inputMode === 'manual' ? (
            <BusinessForm onSubmit={handleSubmit} loading={loading} />
          ) : (
            <div className="space-y-4">
              <FileUpload onFileExtracted={handleFileExtracted} loading={loading} />
              
              {extractedData && (
                <div className="space-y-4">
                  <div className="rounded-md bg-green-50 p-4">
                    <h3 className="font-medium text-green-800">
                      ✅ PDF Processed: {extractedData.filename}
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Extracted {extractedData.text.length} characters of text
                    </p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Extracted Text Preview:</h4>
                    <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                      {extractedData.text.substring(0, 500)}
                      {extractedData.text.length > 500 && '...'}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProcessFile}
                    disabled={loading}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Classifying…' : 'Classify Business Model'}
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">Error: {error}</p>
            </div>
          )}

          {data && <ClassificationTable result={data} />}
        </div>
      </div>
    </div>
  );
}
