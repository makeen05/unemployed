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
  const { repoData, jobs } = location.state || {};

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Repo Info */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200 pb-8 lg:pb-0 lg:pr-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Repository</h2>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{repoData.repo}</h1>
            <p className="text-gray-600 text-sm mb-4">{repoData.description}</p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Stars</p>
                <p className="font-semibold text-gray-900">⭐ {repoData.stars || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Forks</p>
                <p className="font-semibold text-gray-900">🍴 {repoData.forks || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Languages</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {repoData.languages?.map(lang => (
                    <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Summary */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Matching Jobs</h2>
            <p className="text-3xl font-bold text-gray-900 mb-2">{jobs.length}</p>
            <p className="text-gray-600 text-sm">positions found in Sydney, NSW</p>
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
                {/** this line is fucked */}
                 
                <a  href={job.jobLink}
                  target="_blank" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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