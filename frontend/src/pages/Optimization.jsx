import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CpuChipIcon,
  ChartBarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const Optimization = () => {
  const [optimizationParams, setOptimizationParams] = useState({
    budget: 500,
    timeframe: 5,
    priority: "cost",
    region: "north-america",
    demandGrowth: "moderate",
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [savedConfigurations, setSavedConfigurations] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedParams = localStorage.getItem('optimizationParams');
    const savedResults = localStorage.getItem('optimizationResults');
    const savedConfigs = localStorage.getItem('savedConfigurations');

    if (savedParams) {
      setOptimizationParams(JSON.parse(savedParams));
    }
    if (savedResults) {
      setOptimizationResults(JSON.parse(savedResults));
    }
    if (savedConfigs) {
      setSavedConfigurations(JSON.parse(savedConfigs));
    }
  }, []);

  // Save to localStorage whenever params change
  useEffect(() => {
    localStorage.setItem('optimizationParams', JSON.stringify(optimizationParams));
  }, [optimizationParams]);

  const generateRecommendations = (params) => {
    const recommendations = [];
    const regions = {
      'north-america': ['Texas, USA', 'California, USA', 'Alberta, Canada'],
      'europe': ['Germany', 'Netherlands', 'Norway'],
      'asia-pacific': ['Japan', 'Australia', 'South Korea'],
      'global': ['Various Global Locations']
    };

    const selectedRegions = regions[params.region] || regions['global'];
    
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
      recommendations.push({
        type: ['Production Plant', 'Storage Facility', 'Pipeline'][Math.floor(Math.random() * 3)],
        location: selectedRegions[Math.floor(Math.random() * selectedRegions.length)],
        capacity: `${(Math.random() * 10 + 1).toFixed(1)} MW`,
        cost: `$${(Math.random() * 50 + 5).toFixed(1)}M`,
        reason: generateReason(params.priority)
      });
    }
    
    return recommendations;
  };

  const generateReason = (priority) => {
    const reasons = {
      cost: ['Cost-effective location', 'Minimal infrastructure investment', 'Low operational costs'],
      efficiency: ['High efficiency potential', 'Optimal resource utilization', 'Maximum output capacity'],
      sustainability: ['Low environmental impact', 'Renewable energy proximity', 'Sustainable operations'],
      speed: ['Rapid deployment capability', 'Quick market entry', 'Fast construction timeline']
    };
    
    const reasonList = reasons[priority] || reasons.cost;
    return reasonList[Math.floor(Math.random() * reasonList.length)];
  };

  const handleOptimize = async () => {
    console.log('🔍 Starting optimization process...', optimizationParams);
    setIsOptimizing(true);

    // Generate dynamic results based on localStorage data
    setTimeout(() => {
      try {
        const results = {
          timestamp: new Date().toISOString(),
          parameters: { ...optimizationParams },
          newPlants: Math.floor(Math.random() * 5) + 1,
          newPipelines: Math.floor(Math.random() * 4) + 1,
          newStorage: Math.floor(Math.random() * 3) + 1,
          costSavings: `${Math.floor(Math.random() * 25) + 10}%`,
          efficiencyGain: `${Math.floor(Math.random() * 30) + 15}%`,
          recommendations: generateRecommendations(optimizationParams),
        };
        
        setOptimizationResults(results);
        localStorage.setItem('optimizationResults', JSON.stringify(results));
        console.log('✅ Optimization completed successfully:', results);
        
        // Save configuration to history
        const newConfig = {
          id: Date.now(),
          name: `Configuration ${savedConfigurations.length + 1}`,
          params: { ...optimizationParams },
          results: results,
          createdAt: new Date().toISOString()
        };
        
        const updatedConfigs = [...savedConfigurations, newConfig];
        setSavedConfigurations(updatedConfigs);
        localStorage.setItem('savedConfigurations', JSON.stringify(updatedConfigs));
        
      } catch (error) {
        console.error('❌ Error during optimization:', error);
      } finally {
        setIsOptimizing(false);
      }
    }, 3000);
  };

  const handleParamChange = (param, value) => {
    setOptimizationParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Infrastructure Optimization
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered optimization for green hydrogen infrastructure planning 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Optimization Parameters */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-16">
              <div className="flex items-center space-x-2 mb-1">
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Optimization Parameters
                </h3>
              </div>

              <div className="space-y-8">
                {/* Budget */}
                <div className="py-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Budget (Million USD)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      value={optimizationParams.budget}
                      onChange={(e) =>
                        handleParamChange("budget", e.target.value)
                      }
                      className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((optimizationParams.budget - 100) / 900) * 100}%, #e5f3ff ${((optimizationParams.budget - 100) / 900) * 100}%, #e5f3ff 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">$100M</span>
                      <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                        ${optimizationParams.budget}M
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">$1000M</span>
                    </div>
                  </div>
                </div>

                {/* Timeframe */}
                <div className="py-3">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Timeframe (Years)
                  </label>
                  <select
                    value={optimizationParams.timeframe}
                    onChange={(e) =>
                      handleParamChange("timeframe", e.target.value)
                    }
                    className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
                  >
                    <option value={3}>3 Years</option>
                    <option value={5}>5 Years</option>
                    <option value={7}>7 Years</option>
                    <option value={10}>10 Years</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="py-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Optimization Priority
                  </label>
                  <select
                    value={optimizationParams.priority}
                    onChange={(e) =>
                      handleParamChange("priority", e.target.value)
                    }
                    className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="cost">Cost Minimization</option>
                    <option value="efficiency">Efficiency Maximization</option>
                    <option value="sustainability">Environmental Impact</option>
                    <option value="speed">Rapid Deployment</option>
                  </select>
                </div>

                {/* Region */}
                <div className="py-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Target Region
                  </label>
                  <select
                    value={optimizationParams.region}
                    onChange={(e) =>
                      handleParamChange("region", e.target.value)
                    }
                    className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="global">Global</option>
                  </select>
                </div>

                {/* Demand Growth */}
                <div className="py-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Demand Growth Scenario
                  </label>
                  <select
                    value={optimizationParams.demandGrowth}
                    onChange={(e) =>
                      handleParamChange("demandGrowth", e.target.value)
                    }
                    className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="conservative">Conservative (15% annually)</option>
                    <option value="moderate">Moderate (25% annually)</option>
                    <option value="aggressive">Aggressive (40% annually)</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isOptimizing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Optimizing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <CpuChipIcon className="h-5 w-5" />
                        <span>Run Optimization</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Saved Configurations */}
            {savedConfigurations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  <span>Saved Configurations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedConfigurations.slice(-4).map((config) => (
                    <div
                      key={config.id}
                      className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer transition-all duration-300"
                      onClick={() => {
                        setOptimizationParams(config.params);
                        setOptimizationResults(config.results);
                      }}
                    >
                      <h4 className="font-bold text-gray-900 mb-3">{config.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Created: {new Date(config.createdAt).toLocaleDateString()}
                      </p>
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span className="font-medium">${config.params.budget}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Priority:</span>
                          <span className="font-medium">{config.params.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      localStorage.removeItem('savedConfigurations');
                      setSavedConfigurations([]);
                    }}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All Configurations
                  </button>
                </div>
              </div>
            )}

            {/* Current Parameters Display */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                <span>Current Configuration</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Budget</div>
                  <div className="text-lg font-bold text-blue-600">${optimizationParams.budget}M</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Timeframe</div>
                  <div className="text-lg font-bold text-green-600">{optimizationParams.timeframe} Years</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">Priority</div>
                  <div className="text-lg font-bold text-purple-600 capitalize">{optimizationParams.priority}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600">Region</div>
                  <div className="text-lg font-bold text-orange-600 capitalize">{optimizationParams.region.replace('-', ' ')}</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg md:col-span-2">
                  <div className="text-sm text-gray-600">Demand Growth</div>
                  <div className="text-lg font-bold text-indigo-600 capitalize">{optimizationParams.demandGrowth}</div>
                </div>
              </div>
            </div>

            {/* Optimization Results */}
            {optimizationResults && (
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <ChartBarIcon className="h-7 w-7 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Optimization Results
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    Generated: {new Date(optimizationResults.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {optimizationResults.newPlants}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">New Plants</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {optimizationResults.newPipelines}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">New Pipelines</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {optimizationResults.newStorage}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Storage Facilities
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {optimizationResults.costSavings}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cost Savings</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-6 text-lg flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                    <span>Recommended Infrastructure</span>
                  </h4>
                  <div className="space-y-6">
                    {optimizationResults.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <MapPinIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-gray-900 text-lg">
                                {rec.type}
                              </h5>
                              <span className="text-lg font-bold text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                                {rec.cost}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">
                                  Location
                                </p>
                                <p className="text-gray-800 font-semibold">
                                  {rec.location}
                                </p>
                              </div>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">
                                  Capacity
                                </p>
                                <p className="text-gray-800 font-semibold">
                                  {rec.capacity}
                                </p>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                              <p className="text-sm font-medium text-blue-800 italic">
                                💡 {rec.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Results Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setOptimizationResults(null);
                      localStorage.removeItem('optimizationResults');
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear Results
                  </button>
                </div>
              </motion.div>
            )}

            {/* localStorage Management */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                <span>Data Management</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('optimizationParams');
                    setOptimizationParams({
                      budget: 500,
                      timeframe: 5,
                      priority: "cost",
                      region: "north-america",
                      demandGrowth: "moderate",
                    });
                  }}
                  className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Reset Parameters
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('optimizationResults');
                    setOptimizationResults(null);
                  }}
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Clear Results
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    setOptimizationParams({
                      budget: 500,
                      timeframe: 5,
                      priority: "cost",
                      region: "north-america",
                      demandGrowth: "moderate",
                    });
                    setOptimizationResults(null);
                    setSavedConfigurations([]);
                  }}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> All data is stored locally in your browser. 
                  No information is sent to external databases. Use the buttons above to manage your local data.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Optimization;
