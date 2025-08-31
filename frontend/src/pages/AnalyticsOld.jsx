import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { LocalStorageService } from "../utils/localStorageService";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  MapIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("yearly");
  const [infrastructureData, setInfrastructureData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        let data = LocalStorageService.getInfrastructureData();
        
        // If no data exists, generate sample data
        if (!LocalStorageService.hasInfrastructureData()) {
          const optimizationResults = LocalStorageService.getOptimizationResults();
          if (!optimizationResults) {
            data = LocalStorageService.generateSampleData();
          } else {
            data = LocalStorageService.updateInfrastructureFromOptimization();
          }
        }
        
        setInfrastructureData(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        const data = LocalStorageService.generateSampleData();
        setInfrastructureData(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    const data = LocalStorageService.updateInfrastructureFromOptimization();
    setInfrastructureData(data);
    setLoading(false);
  };

  const generateNewData = () => {
    setLoading(true);
    const data = LocalStorageService.generateSampleData();
    setInfrastructureData(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const { productionPlants = [], storageFacilities = [], demandForecast = [], analyticsData = {} } = infrastructureData || {};

  // Demand forecast chart data
  const demandChartData = demandForecast.length > 0 ? {
    labels: demandForecast.map((item) => item.year),
    datasets: [
      {
        label: "Hydrogen Demand (Metric Tons)",
        data: demandForecast.map((item) => item.demand),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  } : { labels: [], datasets: [] };

  // Production capacity by type
  const productionByType = productionPlants.reduce((acc, plant) => {
    const capacity = parseFloat(plant.capacity?.replace(/[^\d.]/g, '') || 0);
    acc[plant.type] = (acc[plant.type] || 0) + capacity;
    return acc;
  }, {});

  const productionChartData = Object.keys(productionByType).length > 0 ? {
    labels: Object.keys(productionByType),
    datasets: [
      {
        label: "Production Capacity (MW)",
        data: Object.values(productionByType),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
          "rgb(236, 72, 153)",
        ],
        borderWidth: 2,
      },
    ],
  } : { labels: [], datasets: [] };

  // Storage utilization
  const storageUtilization = storageFacilities.map((facility) => {
    const current = parseInt(facility.currentLevel?.replace(/[^\d]/g, '') || 0);
    const total = parseInt(facility.capacity?.replace(/[^\d]/g, '') || 1);
    return {
      name: facility.name?.split(" ")[0] || 'Storage',
      utilization: Math.round((current / total) * 100),
    };
  });

  const storageChartData = storageUtilization.length > 0 ? {
    labels: storageUtilization.map((item) => item.name),
    datasets: [
      {
        label: "Storage Utilization (%)",
        data: storageUtilization.map((item) => item.utilization),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
      },
    ],
  } : { labels: [], datasets: [] };

  // Dynamic cost breakdown based on infrastructure data
  const totalPlants = productionPlants.length;
  const totalStorage = storageFacilities.length;
  const costBreakdownData = {
    labels: ["Production Plants", "Storage Facilities", "Infrastructure", "Maintenance"],
    datasets: [
      {
        data: [
          totalPlants * 10,
          totalStorage * 15,
          (totalPlants + totalStorage) * 5,
          Math.max(totalPlants + totalStorage, 1) * 3
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Key metrics from localStorage data
  const metrics = [
    {
      title: "Total Production Capacity",
      value: `${analyticsData.totalCapacity?.toFixed(1) || 0} MW`,
      change: "+12.5%",
      icon: ArrowTrendingUpIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Daily Production",
      value: `${analyticsData.totalProduction || 0} kg/day`,
      change: "+8.2%",
      icon: ChartBarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Storage Efficiency",
      value: `${analyticsData.efficiency?.toFixed(1) || 0}%`,
      change: "+3.1%",
      icon: MapIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Cost Savings",
      value: `${analyticsData.costSavings || 0}%`,
      change: "+5.7%",
      icon: CurrencyDollarIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const kpiData = [
    {
      title: "Total Production Capacity",
      value: "19.8 MW",
      change: "+15%",
      trend: "up",
      icon: ChartBarIcon,
      color: "blue",
    },
    {
      title: "Average Efficiency",
      value: "92.75%",
      change: "+3.2%",
      trend: "up",
      icon: ArrowTrendingUpIcon,
      color: "green",
    },
    {
      title: "Infrastructure Coverage",
      value: "8 Regions",
      change: "+2",
      trend: "up",
      icon: MapIcon,
      color: "purple",
    },
    {
      title: "Cost per kg H2",
      value: "$4.85",
      change: "-12%",
      trend: "down",
      icon: CurrencyDollarIcon,
      color: "emerald",
    },
  ];

  const getTrendColor = (trend) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const getKpiColor = (color) => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      emerald: "bg-emerald-500",
    };
    return colors[color] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive analytics from your localStorage data
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
            <button
              onClick={generateNewData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Sample Data
            </button>
          </div>
        </motion.div>

        {/* Data Status Alert */}
        {(!infrastructureData || productionPlants.length === 0) && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                No infrastructure data found. Run an optimization first or generate sample data to populate analytics.
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value}
                  </p>
                  <p className={`text-sm mt-1 ${metric.color}`}>
                    {metric.change} from baseline
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        {(productionPlants.length > 0 || demandForecast.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Demand Forecast */}
            {demandForecast.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hydrogen Demand Forecast
                </h3>
                <Line data={demandChartData} options={chartOptions} />
              </motion.div>
            )}

            {/* Production by Type */}
            {productionPlants.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Production Capacity by Type
                </h3>
                <Bar data={productionChartData} options={chartOptions} />
              </motion.div>
            )}

            {/* Storage Utilization */}
            {storageFacilities.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Storage Facility Utilization
                </h3>
                <Bar data={storageChartData} options={chartOptions} />
              </motion.div>
            )}

            {/* Cost Breakdown */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Infrastructure Investment Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut data={costBreakdownData} options={doughnutOptions} />
              </div>
            </motion.div>
          </div>
        )}

        {/* Infrastructure Summary */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Infrastructure Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {productionPlants.length}
              </div>
              <div className="text-sm text-gray-600">Production Plants</div>
              <div className="text-xs text-blue-600 mt-1">
                {productionPlants.filter(p => p.status === 'Active').length} active
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {storageFacilities.length}
              </div>
              <div className="text-sm text-gray-600">Storage Facilities</div>
              <div className="text-xs text-green-600 mt-1">
                {storageFacilities.filter(s => s.status === 'Operational').length} operational
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analyticsData.totalCapacity?.toFixed(1) || 0}
              </div>
              <div className="text-sm text-gray-600">MW Total Capacity</div>
              <div className="text-xs text-purple-600 mt-1">Combined output</div>
            </div>
          </div>
        </motion.div>

        {/* Infrastructure Details */}
        {productionPlants.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Production Plants Details
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plant Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productionPlants.map((plant) => (
                    <tr key={plant.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {plant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plant.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plant.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plant.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          plant.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {plant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Data Management Section */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                LocalStorageService.clearData(LocalStorageService.KEYS.INFRASTRUCTURE_DATA);
                setInfrastructureData({ productionPlants: [], storageFacilities: [], demandForecast: [], analyticsData: {} });
              }}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Analytics Data
            </button>
            <button
              onClick={() => {
                LocalStorageService.clearAllData();
                setInfrastructureData({ productionPlants: [], storageFacilities: [], demandForecast: [], analyticsData: {} });
              }}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Data
            </button>
            <button
              onClick={generateNewData}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate New Analytics Data
            </button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This analytics dashboard displays data from your browser's localStorage. 
              Charts and metrics are generated based on your infrastructure optimization results.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
