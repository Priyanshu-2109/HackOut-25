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
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Optimization Parameters
                </h3>
              </div>

              <div className="space-y-6">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (Million USD)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={optimizationParams.budget}
                    onChange={(e) =>
                      handleParamChange("budget", e.target.value)
                    }
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>$100M</span>
                    <span className="font-medium">
                      ${optimizationParams.budget}M
                    </span>
                    <span>$1000M</span>
                  </div>
                </div>

                {/* Timeframe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe (Years)
                  </label>
                  <select
                    value={optimizationParams.timeframe}
                    onChange={(e) =>
                      handleParamChange("timeframe", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={3}>3 Years</option>
                    <option value={5}>5 Years</option>
                    <option value={7}>7 Years</option>
                    <option value={10}>10 Years</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Optimization Priority
                  </label>
                  <select
                    value={optimizationParams.priority}
                    onChange={(e) =>
                      handleParamChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cost">Cost Minimization</option>
                    <option value="efficiency">Efficiency Maximization</option>
                    <option value="sustainability">Environmental Impact</option>
                    <option value="speed">Rapid Deployment</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Region
                  </label>
                  <select
                    value={optimizationParams.region}
                    onChange={(e) =>
                      handleParamChange("region", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="global">Global</option>
                  </select>
                </div>

                {/* Demand Growth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demand Growth Scenario
                  </label>
                  <select
                    value={optimizationParams.demandGrowth}
                    onChange={(e) =>
                      handleParamChange("demandGrowth", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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

                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Predefined Scenarios */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Optimization Scenarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {optimizationScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedScenario.id === scenario.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {scenario.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {scenario.description}
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div>Budget: {scenario.parameters.budget}</div>
                      <div>Priority: {scenario.parameters.priority}</div>
                      <div>Timeframe: {scenario.parameters.timeframe}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Cost Analysis
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(costAnalysis).map(([category, data]) => (
                  <div key={category} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 capitalize mb-2">
                      {category}
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-900">
                        {data.current}
                      </div>
                      <div className="text-sm text-gray-600">Current</div>
                      <div className="text-lg font-bold text-green-600">
                        {data.optimized}
                      </div>
                      <div className="text-sm text-gray-600">Optimized</div>
                      <div className="text-sm font-medium text-green-600">
                        ↓ {data.savings} savings
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Results */}
            {optimizationResults && (
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Optimization Results
                  </h3>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {optimizationResults.newPlants}
                    </div>
                    <div className="text-sm text-gray-600">New Plants</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {optimizationResults.newPipelines}
                    </div>
                    <div className="text-sm text-gray-600">New Pipelines</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {optimizationResults.newStorage}
                    </div>
                    <div className="text-sm text-gray-600">
                      Storage Facilities
                    </div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {optimizationResults.costSavings}
                    </div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Recommended Infrastructure
                  </h4>
                  <div className="space-y-4">
                    {optimizationResults.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="h-5 w-5 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">
                                {rec.type}
                              </h5>
                              <span className="text-sm font-medium text-green-600">
                                {rec.cost}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Location:</span>{" "}
                              {rec.location}
                            </p>
                            {rec.capacity && (
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Capacity:</span>{" "}
                                {rec.capacity}
                              </p>
                            )}
                            {rec.length && (
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Length:</span>{" "}
                                {rec.length}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 italic">
                              {rec.reason}
                            </p>
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
