import React from 'react';

const OptimizationTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🔧 Optimization Page Test
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          This is a test version of the Optimization page to verify it's working.
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Infrastructure Optimization
          </h2>
          <p className="text-gray-600 mb-4">
            AI-powered optimization for green hydrogen infrastructure planning
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Budget Planning</h3>
              <p className="text-blue-700">Optimize your infrastructure investment</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Site Selection</h3>
              <p className="text-green-700">AI-powered location recommendations</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Performance Prediction</h3>
              <p className="text-purple-700">Forecast system efficiency and ROI</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900">Risk Assessment</h3>
              <p className="text-orange-700">Identify and mitigate potential risks</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              ✅ Test Button - Optimization Working!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationTest;
