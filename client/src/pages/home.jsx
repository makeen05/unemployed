import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      setLoadingStep('Analyzing repository...'); 
      console.log('Step 1: Analyzing repo...'); 
      const response = await axios.post('http://localhost:3000/api/analyze', {
        repoUrl
      });
  
      const repoData = response.data.data;
      console.log('Step 1 complete - repoData:', repoData); 
  
      setLoadingStep('Finding job listings...'); 
      console.log('Step 2: Scraping jobs...'); 
      const jobsResponse = await axios.post('http://localhost:3000/api/scrape-jobs', {
        repoData, 
        city, 
        country, 
        minSalary: minSalary ? parseInt(minSalary) : undefined
      });
      
      console.log('Step 2 complete - Full response:', jobsResponse.data); 
      
      setLoadingStep('Preparing results...'); 
      
 
      navigate('/jobs', { 
        state: { 
          repoData, 
          jobs: jobsResponse.data.jobs,
          aiAnalysis: repoData.aiAnalysis,
          city,
          country
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      console.error('Error:', err); 
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            unemployed.
          </h1>
          <p className="text-base text-gray-500 font-light pt-2">
            Find your perfect job match based on your personal projects.
          </p> 
        </div>

        
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository URL
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-4 bg-gray-50 text-gray-900 text-base rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  disabled={loading}
                >
                  <option value="">Select Country</option>
                  <option value="australia">Australia</option>
                  <option value="hongkong">Hong Kong</option>
                  <option value="indonesia">Indonesia</option>
                  <option value="malaysia">Malaysia</option>
                  <option value="new zealand">New Zealand</option>
                  <option value="philippines">Philippines</option>
                  <option value="singapore">Singapore</option>
                  <option value="thailand">Thailand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-3 py-2.5 bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Minimum Salary (optional)
              </label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="e.g., 80000"
                className="w-full px-3 py-2.5 bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !repoUrl}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? 'Analyzing...' : 'Analyze Repository'}
            </button>
          </form>

          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>

     
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
            <div className="text-center">
              
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-gray-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-gray-400 rounded-full animate-spin" style={{ animationDuration: '0.6s' }}></div>
              </div>
              
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {loadingStep}
              </h3>
              <p className="text-gray-600 text-sm">
                This may take a few moments...
              </p>
              
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;