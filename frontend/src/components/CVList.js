import { useState } from 'react';
import { API_BASE_URL } from '../config/api';
function CVList({ cvs, loading, selectedCV, onSelectCV, refreshCVs }) {
  const [deleting, setDeleting] = useState(null); // Track which CV is being deleted
  
  const handleDelete = async (cvId) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      setDeleting(cvId);
      try {
        const response = await fetch(`${API_BASE_URL}/api/cvs/${cvId}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // If the currently selected CV is the one being deleted, clear the selection
          if (selectedCV && selectedCV.id === cvId) {
            onSelectCV(null);
          }
          // Refresh the CV list
          refreshCVs();
        } else {
          alert('Failed to delete CV');
        }
      } catch (error) {
        console.error('Error deleting CV:', error);
        alert('Error deleting CV');
      } finally {
        setDeleting(null);
      }
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">Loading CVs...</div>;
  }

  if (cvs.length === 0) {
    return <div className="text-center py-4 text-gray-500">No CVs uploaded yet</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Your CVs</h2>
      {/* Add a fixed height container with overflow scroll */}
      <div className="max-h-64 overflow-y-auto pr-2 pb-2 border border-gray-100 rounded">
        <ul className="divide-y divide-gray-200">
          {cvs.map((cv) => (
            <li key={cv.id} className="py-2 px-1">
              <div className="flex items-center">
                <button
                  onClick={() => onSelectCV(cv)}
                  className={`flex-grow text-left px-3 py-2 rounded-md ${
                    selectedCV && selectedCV.id === cv.id
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{cv.name}</div>
                  <div className="text-sm text-gray-500">
                    Uploaded: {new Date(cv.uploaded_at).toLocaleDateString()}
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(cv.id)}
                  disabled={deleting === cv.id}
                  className={`ml-2 p-2 rounded-md text-red-600 hover:bg-red-50 ${
                    deleting === cv.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Delete CV"
                >
                  {deleting === cv.id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Add a refresh button */}
      <button 
        onClick={refreshCVs}
        className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh List
      </button>
    </div>
  );
}

export default CVList;