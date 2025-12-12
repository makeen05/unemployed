import { useState } from 'react'

function App() {
  const [repoUrl, setRepoUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', repoUrl)
    // We'll connect this to the backend later
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          GitHub Job Matcher
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <p className="text-gray-300 mb-6 text-center">
            Paste your GitHub repository URL to find matching jobs
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Analyze Repository
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App