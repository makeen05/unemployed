import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
  
    // Extract data passed from the Home page
    const data = location.state?.data;
    const matchedJobs = data?.matchedJobs || []; // Replace with the actual key for matched jobs
  
    // Handle popup visibility
    const togglePopup = () => setShowPopup(!showPopup);
  
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
            Results
          </h1>
  
          {/* Display matched jobs */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Matched Jobs
            </h2>
            <ul className="space-y-4">
              {matchedJobs.length > 0 ? (
                matchedJobs.map((job, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{job.description}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No jobs matched your repository.</p>
              )}
            </ul>
          </div>
  
          {/* Button to show popup */}
          <button
            onClick={togglePopup}
            className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition"
          >
            {showPopup ? 'Close Popup' : 'Show Popup'}
          </button>
  
          {/* Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Matched Jobs
                </h2>
                <ul className="space-y-4">
                  {matchedJobs.map((job, index) => (
                    <li key={index}>
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.description}</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={togglePopup}
                  className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
  
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
}

export default Results;
