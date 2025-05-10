import { useState } from 'react';
import { API_BASE_URL } from '../config/api';

function CVUpload({ onCVUploaded }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !name) {
      alert('Please provide both a file and a name');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    
    setUploading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/cvs/upload_cv/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      // Clear form
      setFile(null);
      setName('');
      
      // Refresh CV list
      if (onCVUploaded) onCVUploaded();
      
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">Upload New CV</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">CV Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter a name for this CV"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">CV File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept=".pdf,.doc,.docx"
          />
        </div>
        
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload CV'}
        </button>
      </form>
    </div>
  );
}

export default CVUpload;