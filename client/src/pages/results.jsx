import { useLocation, useNavigate } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.data;

  // If no data, redirect to home
  if (!result) {
    navigate('/');
    return null;
  }

  const aiAnalysis = result.data.aiAnalysis;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            unemployed.
          </h1>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* AI Analysis - Project Description */}
          {aiAnalysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                🤖 AI Analysis
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {aiAnalysis.project_description}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full font-medium">
                  {aiAnalysis.role_focus}
                </span>
              </div>
            </div>
          )}

          {/* Job Keywords */}
          {aiAnalysis && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💼 Recommended Job Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {aiAnalysis && aiAnalysis.tech_stack && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🛠️ Tech Stack Identified
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.tech_stack.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repository Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📁 Repository Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Repository</p>
                <p className="text-base text-gray-900 font-medium">
                  {result.data.owner}/{result.data.repo}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {result.data.fileCount} files analyzed
                </p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Languages Detected
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.data.languages.map(lang => (
                <span 
                  key={lang} 
                  className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Files Analyzed
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Files Analyzed ({Object.keys(result.data.files).length})
            </h3>
            <div className="space-y-3">
              {Object.entries(result.data.files).map(([filename, content]) => (
                <details 
                  key={filename} 
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <summary className="cursor-pointer px-4 py-3 hover:bg-gray-100 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 font-mono">
                        📄 {filename}
                      </span>
                      <span className="text-xs text-gray-500">
                        {typeof content === 'string' ? content.length : 0} chars
                      </span>
                    </div>
                  </summary>
                  <pre className="p-4 bg-gray-900 text-gray-100 text-xs overflow-x-auto">
                    {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Results;