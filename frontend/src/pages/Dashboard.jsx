import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LocalStorageService } from "../utils/localStorageService";
import comprehensiveLocalStorageService from "../utils/comprehensiveLocalStorageService";
import ProductionPlantCard from "../components/dashboard/ProductionPlantCard";
import PipelineCard from "../components/dashboard/PipelineCard";
import StorageFacilityCard from "../components/dashboard/StorageFacilityCard";
import {
  BuildingOffice2Icon,
  RectangleGroupIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user } = useAuth();
  const [infrastructureData, setInfrastructureData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load infrastructure data from comprehensive localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Use comprehensive service first, fallback to original service
        let data = comprehensiveLocalStorageService.getAllInfrastructureData();
        
        if (!data || Object.keys(data).length === 0) {
          // Fallback to original service
          data = LocalStorageService.getInfrastructureData();
        }
        
        // If still no data exists, initialize comprehensive data
        if (!data || Object.keys(data).length === 0) {
          console.log('🌱 Initializing comprehensive infrastructure data...');
          comprehensiveLocalStorageService.initializeAllData();
          data = comprehensiveLocalStorageService.getAllInfrastructureData();
        }
        
        setInfrastructureData(data);
      } catch (error) {
        console.error('Error loading infrastructure data:', error);
        // Emergency fallback to sample data
        const data = LocalStorageService.generateSampleData();
        setInfrastructureData(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = () => {
    console.log('🔄 Refreshing dashboard data...');
    setLoading(true);
    try {
      const data = LocalStorageService.updateInfrastructureFromOptimization();
      setInfrastructureData(data);
      console.log('✅ Dashboard data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewData = () => {
    console.log('🎲 Generating new sample data...');
    setLoading(true);
    try {
      const data = LocalStorageService.generateSampleData();
      setInfrastructureData(data);
      console.log('✅ New sample data generated successfully');
    } catch (error) {
      console.error('❌ Error generating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearInfrastructureData = () => {
    console.log('🗑️ Clearing infrastructure data...');
    try {
      LocalStorageService.clearData(LocalStorageService.KEYS.INFRASTRUCTURE_DATA);
      setInfrastructureData({ productionPlants: [], pipelines: [], storageFacilities: [] });
      console.log('✅ Infrastructure data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing infrastructure data:', error);
    }
  };

  const clearAllData = () => {
    console.log('🧹 Clearing all data...');
    try {
      LocalStorageService.clearAllData();
      setInfrastructureData({ productionPlants: [], pipelines: [], storageFacilities: [] });
      console.log('✅ All data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing all data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading infrastructure data...</p>
        </div>
      </div>
    );
  }

  const { productionPlants = [], pipelines = [], storageFacilities = [] } = infrastructureData || {};

  const stats = [
    {
      title: "Total Plants",
      value: productionPlants.length,
      icon: BuildingOffice2Icon,
      color: "bg-green-500",
      change: `${productionPlants.filter(p => p.status === "Active").length} active`,
    },
    {
      title: "Active Pipelines",
      value: pipelines.filter((p) => p.status === "Operational").length,
      icon: RectangleGroupIcon,
      color: "bg-blue-500",
      change: `${pipelines.length} total`,
    },
    {
      title: "Storage Facilities",
      value: storageFacilities.length,
      icon: CubeIcon,
      color: "bg-purple-500",
      change: `${storageFacilities.filter(s => s.status === "Operational").length} operational`,
    },
    {
      title: "Total Capacity",
      value: `${productionPlants.reduce((sum, plant) => sum + parseFloat(plant.capacity || 0), 0).toFixed(1)} MW`,
      icon: ChartBarIcon,
      color: "bg-yellow-500",
      change: "Combined output",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's an overview of your sustainable energy infrastructure (Data from localStorage)
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
              Generate Sample Data
            </button>
          </div>
        </div>

        {/* Data Status Alert */}
        {productionPlants.length === 0 && pipelines.length === 0 && storageFacilities.length === 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                No infrastructure data found. Run an optimization first or generate sample data to populate the dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Production Plants Section */}
        {productionPlants.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Production Plants
              </h2>
              <span className="text-sm text-gray-500">
                {productionPlants.filter((p) => p.status === "Active").length} of{" "}
                {productionPlants.length} active
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {productionPlants.map((plant) => (
                <ProductionPlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </section>
        )}

        {/* Pipelines Section */}
        {pipelines.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pipelines</h2>
              <span className="text-sm text-gray-500">
                {pipelines.filter((p) => p.status === "Operational").length} of{" "}
                {pipelines.length} operational
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {pipelines.map((pipeline) => (
                <PipelineCard key={pipeline.id} pipeline={pipeline} />
              ))}
            </div>
          </section>
        )}

        {/* Storage Facilities Section */}
        {storageFacilities.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Storage Facilities
              </h2>
              <span className="text-sm text-gray-500">
                {storageFacilities.filter((s) => s.status === "Operational").length} of{" "}
                {storageFacilities.length} operational
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {storageFacilities.map((facility) => (
                <StorageFacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </section>
        )}

        {/* Data Management Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={clearInfrastructureData}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              title="Clear only infrastructure data"
            >
              <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />
              Clear Infrastructure Data
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
              title="Clear all application data"
            >
              <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />
              Clear All Data
            </button>
            <button
              onClick={generateNewData}
              disabled={loading}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate fresh sample data"
            >
              <SparklesIcon className="h-4 w-4 inline mr-2" />
              {loading ? 'Generating...' : 'Generate New Sample Data'}
            </button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This dashboard shows data from your browser's localStorage. 
              Infrastructure data is generated based on your optimization results or sample data.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
