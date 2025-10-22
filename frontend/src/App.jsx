import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🏗️ Real Estate Project Manager
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your project is set up and ready!
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <p className="text-green-600 mb-2">✅ Backend configured</p>
          <p className="text-green-600 mb-2">✅ Frontend ready</p>
          <p className="text-green-600">✅ Database initialized</p>
        </div>
      </div>
    </div>
  )
}

export default App
