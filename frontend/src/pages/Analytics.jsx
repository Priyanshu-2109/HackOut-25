import React, { useState } from "react";
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
import {
  demandForecast,
  productionPlants,
  storageFacilities,
} from "../assets/assets";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  MapIcon,
  CurrencyDollarIcon,
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

  // Demand forecast chart data
  const demandChartData = {
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
  };

  // Production capacity by type
  const productionByType = productionPlants.reduce((acc, plant) => {
    acc[plant.type] = (acc[plant.type] || 0) + parseInt(plant.capacity);
    return acc;
  }, {});

  const productionChartData = {
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
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Storage utilization
  const storageUtilization = storageFacilities.map((facility) => {
    const current = parseInt(facility.currentLevel.replace(/[^\d]/g, ""));
    const total = parseInt(facility.capacity.replace(/[^\d]/g, ""));
    return {
      name: facility.name.split(" ")[0],
      utilization: Math.round((current / total) * 100),
    };
  });

  const storageChartData = {
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
  };

  // Cost breakdown
  const costBreakdownData = {
    labels: ["Production", "Storage", "Transportation", "Maintenance"],
    datasets: [
      {
        data: [45, 25, 20, 10],
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
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive analytics and insights for green hydrogen
            infrastructure
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {kpi.value}
                  </p>
                  <p className={`text-sm mt-1 ${getTrendColor(kpi.trend)}`}>
                    {kpi.change} from last period
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getKpiColor(kpi.color)}`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demand Forecast */}
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

          {/* Production by Type */}
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

          {/* Storage Utilization */}
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

          {/* Cost Breakdown */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Infrastructure Cost Breakdown
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={costBreakdownData} options={doughnutOptions} />
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">96.8%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
              <div className="text-xs text-green-600 mt-1">
                +0.5% this month
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                1,247
              </div>
              <div className="text-sm text-gray-600">kg H2/day Production</div>
              <div className="text-xs text-green-600 mt-1">+18% this month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">842</div>
              <div className="text-sm text-gray-600">km Pipeline Network</div>
              <div className="text-xs text-green-600 mt-1">+285 km added</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Trends */}
        <motion.div
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Trends & Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  Production Efficiency
                </h4>
                <span className="text-green-600 text-sm font-medium">
                  ↑ 12% improvement
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Wind-based hydrogen production showing significant efficiency
                gains due to upgraded turbines and optimized electrolysis
                processes.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  Storage Optimization
                </h4>
                <span className="text-green-600 text-sm font-medium">
                  ↑ 8% capacity utilization
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Implementation of smart storage management algorithms has
                improved capacity utilization across all facilities.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Cost Reduction</h4>
                <span className="text-green-600 text-sm font-medium">
                  ↓ 15% operational costs
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Optimized pipeline routing and predictive maintenance have
                significantly reduced operational expenses.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
