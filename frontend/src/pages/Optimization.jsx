import React, { useState } from "react";
import { motion } from "framer-motion";
import { optimizationScenarios, costAnalysis } from "../assets/assets";
import {
  CpuChipIcon,
  ChartBarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const Optimization = () => {
  const [selectedScenario, setSelectedScenario] = useState(
    optimizationScenarios[0]
  );
  const [optimizationParams, setOptimizationParams] = useState({
    budget: 500,
    timeframe: 5,
    priority: "cost",
    region: "north-america",
    demandGrowth: "moderate",
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);

    // Simulate optimization process
    setTimeout(() => {
      setOptimizationResults({
        newPlants: 3,
        newPipelines: 2,
        newStorage: 2,
        costSavings: "18%",
        efficiencyGain: "25%",
        recommendations: [
          {
            type: "Production Plant",
            location: "Nebraska, USA",
            coordinates: [41.4925, -99.9018],
            capacity: "5.2 MW",
            cost: "$8.5M",
            reason: "Optimal wind resources and grid connectivity",
          },
          {
            type: "Storage Facility",
            location: "Colorado, USA",
            coordinates: [39.5501, -105.7821],
            capacity: "80,000 kg",
            cost: "$32M",
            reason: "Strategic location for distribution network",
          },
          {
            type: "Pipeline",
            route: "Nebraska to Colorado Distribution Hub",
            length: "285 km",
            cost: "$75M",
            reason: "Connects new production to storage efficiently",
          },
        ],
      });
      setIsOptimizing(false);
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
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
      `}</style>
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
                      className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full appearance-none cursor-pointer slider"
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
                    className="w-full px-2 py-2 border-1 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
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
                    className="w-full px-2 py-2 border-1 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
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
                    className="w-full px-2 py-2 border-1 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
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
                    className="w-full px-2 py-2  border-1 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all duration-200 hover:border-blue-300"
                  >
                    <option value="conservative">
                      Conservative (15% annually)
                    </option>
                    <option value="moderate">Moderate (25% annually)</option>
                    <option value="aggressive">
                      Aggressive (40% annually)
                    </option>
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
            className="lg:col-span-2 space-y-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Predefined Scenarios */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl gap-2 font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                <span>Optimization Scenarios</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {optimizationScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`p-6 rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                      selectedScenario.id === scenario.id
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">
                      {scenario.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {scenario.description}
                    </p>
                    <div className="space-y-2 text-xs text-gray-500 bg-white/60 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">{scenario.parameters.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className="font-medium">{scenario.parameters.priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeframe:</span>
                        <span className="font-medium">{scenario.parameters.timeframe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-2 space-x-3 mb-6">
                <CurrencyDollarIcon className="h-7 w-7 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Cost Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(costAnalysis).map(([category, data]) => (
                  <div key={category} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                      {category}
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">
                          {data.current}
                        </div>
                        <div className="text-sm text-gray-500">Current</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-xl font-bold text-green-700">
                          {data.optimized}
                        </div>
                        <div className="text-sm text-green-600">Optimized</div>
                      </div>
                      <div className="bg-emerald-100 p-2 rounded-lg text-center">
                        <div className="text-sm font-bold text-emerald-700">
                          ↓ {data.savings} savings
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="flex items-center gap-2 space-x-3 mb-6">
                  <ChartBarIcon className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Optimization Results
                  </h3>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-1 border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {optimizationResults.newPlants}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">New Plants</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-1 border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {optimizationResults.newPipelines}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">New Pipelines</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-1 border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {optimizationResults.newStorage}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Storage Facilities
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-1 border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {optimizationResults.costSavings}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cost Savings</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-bold text-gray-900 gap-2 mb-6 text-lg flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                    <span>Recommended Infrastructure</span>
                  </h4>
                  <div className="space-y-6">
                    {optimizationResults.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-6 border-1 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex gap-2 items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <MapPinIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-gray-900 text-lg">
                                {rec.type}
                              </h5>
                              <span className="text-lg font-bold mb-2 text-green-600 bg-green-100 px-4 py-2 rounded-lg">
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
                              {rec.capacity && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">
                                    Capacity
                                  </p>
                                  <p className="text-gray-800 font-semibold">
                                    {rec.capacity}
                                  </p>
                                </div>
                              )}
                              {rec.length && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">
                                    Length
                                  </p>
                                  <p className="text-gray-800 font-semibold">
                                    {rec.length}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="bg-blue-50 p-4 mt-3 rounded-lg border-l-4 border-blue-400">
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
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Optimization;
