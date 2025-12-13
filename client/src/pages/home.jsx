import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      console.log('🔄 Step 1: Analyzing repo...'); 
      const response = await axios.post('http://localhost:3000/api/analyze', {
        repoUrl
      });
  
      const repoData = response.data.data;
      console.log('✅ Step 1 complete - repoData:', repoData); 
  
      console.log('🔄 Step 2: Scraping jobs...'); 
      const jobsResponse = await axios.post('http://localhost:3000/api/scrape-jobs', {
        repoData, 
        city, 
        country, 
        minSalary: minSalary ? parseInt(minSalary) : undefined
      });
      
      console.log('✅ Step 2 complete - Full response:', jobsResponse.data); 
      
      // Navigate to jobs page with both repoData and AI analysis
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
      console.error('❌ Error:', err); 
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            unemployed.
          </h1>
          <p className="text-base text-gray-500 font-light pt-2">
            Find your perfect job match based on your personal projects.
          </p> 
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Repository URL
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Minimum Salary (optional)
              </label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="e.g., 80000"
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;