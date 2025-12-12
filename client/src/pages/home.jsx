import { useState } from 'react'

function Home() {
    const [repoUrl, setRepoUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Analyzing:', repoUrl)
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900">
                        unemployed.
                    </h1>
                    <p className="text-base text-gray-500 font-light pt-2">
                        Find your perfect job match based on your personal projects.
                    </p> 
                </div>

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
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition"
                        >
                            Analyze Repository
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Home;