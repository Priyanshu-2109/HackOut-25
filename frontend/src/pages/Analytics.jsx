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
    console.log('🔄 Refreshing analytics data...');
    setLoading(true);
    try {
      const data = LocalStorageService.updateInfrastructureFromOptimization();
      setInfrastructureData(data);
      console.log('✅ Analytics data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewData = () => {
    console.log('🎲 Generating new analytics sample data...');
    setLoading(true);
    try {
      const data = LocalStorageService.generateSampleData();
      setInfrastructureData(data);
      console.log('✅ New analytics sample data generated successfully');
    } catch (error) {
      console.error('❌ Error generating analytics data:', error);
    } finally {
      setLoading(false);
    }
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

  // Generate monthly production data based on plants
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseProduction = productionPlants.reduce((sum, plant) => {
      return sum + parseInt(plant.productionRate?.replace(/[^\d]/g, '') || 0);
    }, 0);
    
    return months.map((month, index) => {
      // Add seasonal variation
      const seasonalFactor = 0.8 + 0.4 * Math.sin(index * Math.PI / 6);
      return Math.floor(baseProduction * seasonalFactor * (0.8 + Math.random() * 0.4));
    });
  };

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
  } : {
    labels: ['2024', '2025', '2026', '2027', '2028'],
    datasets: [{
      label: "Projected Demand (Metric Tons)",
      data: [1000, 1250, 1563, 1954, 2442],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    }],
  };

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
  } : {
    labels: ['Solar Electrolysis', 'Wind Electrolysis', 'Offshore Wind'],
    datasets: [{
      label: "Capacity (MW)",
      data: [15, 25, 18],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
      ],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(16, 185, 129)",
        "rgb(245, 158, 11)",
      ],
      borderWidth: 2,
    }],
  };

  // Monthly production data
  const monthlyProductionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: "Monthly Production (kg)",
        data: generateMonthlyData(),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
      },
    ],
  };

  // Storage utilization
  const storageUtilization = storageFacilities.map((facility) => {
    const utilization = parseInt(facility.utilization?.replace('%', '') || 0);
    return {
      name: facility.name,
      utilization: utilization,
      capacity: facility.capacity,
      currentLevel: facility.currentLevel
    };
  });

  const storageChartData = storageUtilization.length > 0 ? {
    labels: storageUtilization.map((item) => item.name),
    datasets: [
      {
        label: "Storage Utilization (%)",
        data: storageUtilization.map((item) => item.utilization),
        backgroundColor: storageUtilization.map((item) => 
          item.utilization > 80 ? "rgba(239, 68, 68, 0.8)" :
          item.utilization > 60 ? "rgba(245, 158, 11, 0.8)" :
          "rgba(34, 197, 94, 0.8)"
        ),
        borderColor: storageUtilization.map((item) => 
          item.utilization > 80 ? "rgb(239, 68, 68)" :
          item.utilization > 60 ? "rgb(245, 158, 11)" :
          "rgb(34, 197, 94)"
        ),
        borderWidth: 2,
      },
    ],
  } : {
    labels: ['Facility 1', 'Facility 2'],
    datasets: [{
      label: "Utilization (%)",
      data: [75, 60],
      backgroundColor: ["rgba(245, 158, 11, 0.8)", "rgba(34, 197, 94, 0.8)"],
      borderColor: ["rgb(245, 158, 11)", "rgb(34, 197, 94)"],
      borderWidth: 2,
    }],
  };

  // Calculate KPIs
  const totalCapacity = productionPlants.reduce((sum, plant) => {
    return sum + parseFloat(plant.capacity?.replace(/[^\d.]/g, '') || 0);
  }, 0);

  const totalProduction = productionPlants.reduce((sum, plant) => {
    return sum + parseInt(plant.productionRate?.replace(/[^\d]/g, '') || 0);
  }, 0);

  const averageEfficiency = productionPlants.length > 0 ? 
    productionPlants.reduce((sum, plant) => {
      return sum + parseInt(plant.efficiency?.replace('%', '') || 0);
    }, 0) / productionPlants.length : 0;

  const averageStorageUtilization = storageUtilization.length > 0 ?
    storageUtilization.reduce((sum, item) => sum + item.utilization, 0) / storageUtilization.length : 0;

  const kpis = [
    {
      title: "Total Capacity",
      value: `${totalCapacity.toFixed(1)} MW`,
      change: "+12%",
      trend: "up",
      icon: ChartBarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Monthly Production",
      value: `${totalProduction.toLocaleString()} kg`,
      change: "+8%",
      trend: "up",
      icon: ArrowTrendingUpIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Efficiency",
      value: `${averageEfficiency.toFixed(1)}%`,
      change: "+3%",
      trend: "up",
      icon: MapIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Storage Utilization",
      value: `${averageStorageUtilization.toFixed(1)}%`,
      change: averageStorageUtilization > 80 ? "High" : "Normal",
      trend: averageStorageUtilization > 80 ? "up" : "neutral",
      icon: CurrencyDollarIcon,
      color: averageStorageUtilization > 80 ? "text-red-600" : "text-yellow-600",
      bgColor: averageStorageUtilization > 80 ? "bg-red-50" : "bg-yellow-50",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights from your hydrogen infrastructure 
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={generateNewData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate New Data
            </button>
          </div>
        </div>

        {/* Data Status Alert */}
        {productionPlants.length === 0 && storageFacilities.length === 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                No infrastructure data found. Run an optimization first or generate sample data to view analytics.
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  <p className={`text-xs mt-1 ${kpi.color}`}>{kpi.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Demand Forecast Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Hydrogen Demand Forecast
            </h3>
            <div style={{ height: "300px" }}>
              <Line data={demandChartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Production Capacity Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Production Capacity by Type
            </h3>
            <div style={{ height: "300px" }}>
              <Doughnut data={productionChartData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'right'
                  }
                }
              }} />
            </div>
          </motion.div>

          {/* Monthly Production Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Monthly Production Trend
            </h3>
            <div style={{ height: "300px" }}>
              <Bar data={monthlyProductionData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Storage Utilization Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Storage Facility Utilization
            </h3>
            <div style={{ height: "300px" }}>
              <Bar data={storageChartData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Infrastructure Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Infrastructure Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Production Plants</h4>
              <p className="text-3xl font-bold text-blue-600">{productionPlants.length}</p>
              <p className="text-sm text-blue-600">
                {productionPlants.filter(p => p.status === 'Active').length} Active
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 mb-2">Storage Facilities</h4>
              <p className="text-3xl font-bold text-green-600">{storageFacilities.length}</p>
              <p className="text-sm text-green-600">
                {storageFacilities.filter(s => s.status === 'Operational').length} Operational
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">Total Capacity</h4>
              <p className="text-3xl font-bold text-purple-600">{totalCapacity.toFixed(1)} MW</p>
              <p className="text-sm text-purple-600">Combined Output</p>
            </div>
          </div>
        </motion.div>

        {/* Data Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                LocalStorageService.clearData(LocalStorageService.KEYS.INFRASTRUCTURE_DATA);
                setInfrastructureData({ productionPlants: [], storageFacilities: [], demandForecast: [] });
              }}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Analytics Data
            </button>
            <button
              onClick={() => {
                LocalStorageService.clearAllData();
                setInfrastructureData({ productionPlants: [], storageFacilities: [], demandForecast: [] });
              }}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Data
            </button>
            <button
              onClick={generateNewData}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate New Sample Data
            </button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All analytics are generated from localStorage data. 
              Charts and KPIs are calculated based on your optimization results or sample data.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
