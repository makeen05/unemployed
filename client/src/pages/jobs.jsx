import { useLocation, useNavigate } from 'react-router-dom';

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function Jobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { repoData, jobs, aiAnalysis, city, country } = location.state || {};

  if (!repoData || !jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No job data found</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back to Search
        </button>

        {/* Top Section - Repo Info, AI Analysis, and Jobs Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Repo Info */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Repository</h2>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{repoData.repo}</h1>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{repoData.description}</p>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Stars</span>
                <span className="font-semibold text-gray-900">⭐ {repoData.stars || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Forks</span>
                <span className="font-semibold text-gray-900">🍴 {repoData.forks || 0}</span>
              </div>
              <div className="pt-2">
                <p className="text-gray-500 mb-3">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {repoData.languages?.map(lang => (
                    <span key={lang} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis & Job Keywords */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🤖</span>
                  <h2 className="text-xs font-semibold text-blue-900 uppercase tracking-wide">AI Analysis</h2>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed mb-4">
                  {aiAnalysis.project_description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                    {aiAnalysis.role_focus}
                  </span>
                </div>
              </div>
            )}

            {/* Job Keywords */}
            {aiAnalysis && aiAnalysis.keywords && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💼</span>
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Recommended Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs Summary */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h2 className="text-xs font-semibold text-green-900 uppercase tracking-wide mb-3">Matching Jobs</h2>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="text-5xl font-bold text-gray-900">{jobs.length}</p>
                <span className="text-lg text-gray-600 font-medium">positions</span>
              </div>
               <p className="text-gray-600 text-sm">
                📍 Found in <span className="capitalize">{city}</span>{country ? <>, <span className="capitalize">{country}</span></> : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div key={job.id || idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {job.salary || 'Salary not specified'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-1">{job.advertiser?.name || 'Company Name'}</p>
              <p className="text-gray-500 text-xs mb-3">
                {job.joblocationInfo?.displayLocation || job.joblocationInfo?.location || 'Location not specified'}
              </p>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {stripHtml(job.content?.jobHook || job.content?.sections?.[0] || 'No description available')}
              </p>

              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex flex-wrap gap-2">
                  {job.workTypes && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {job.workTypes}
                    </span>
                  )}
                  {job.workArrangements && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      {job.workArrangements}
                    </span>
                  )}
                  {job.classificationInfo?.subClassification && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      {job.classificationInfo.subClassification}
                    </span>
                  )}
                </div>
                <a 
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Job →
                </a>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No jobs found matching your skills</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Search Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}