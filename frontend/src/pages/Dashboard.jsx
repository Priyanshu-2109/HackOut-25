import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  productionPlants,
  pipelines,
  storageFacilities,
} from "../assets/assets";
import ProductionPlantCard from "../components/dashboard/ProductionPlantCard";
import PipelineCard from "../components/dashboard/PipelineCard";
import StorageFacilityCard from "../components/dashboard/StorageFacilityCard";
import {
  BuildingOffice2Icon,
  RectangleGroupIcon,
  CubeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Plants",
      value: productionPlants.length,
      icon: BuildingOffice2Icon,
      color: "bg-green-500",
      change: "+2 this month",
    },
    {
      title: "Active Pipelines",
      value: pipelines.filter((p) => p.status === "Operational").length,
      icon: RectangleGroupIcon,
      color: "bg-blue-500",
      change: "+1 this week",
    },
    {
      title: "Storage Facilities",
      value: storageFacilities.length,
      icon: CubeIcon,
      color: "bg-purple-500",
      change: "All operational",
    },
    {
      title: "Total Capacity",
      value: "12.8 MW",
      icon: ChartBarIcon,
      color: "bg-yellow-500",
      change: "+15% efficiency",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your Green Hydrogen infrastructure
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
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
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Production Plants Section */}
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

        {/* Pipelines Section */}
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

        {/* Storage Facilities Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Storage Facilities
            </h2>
            <span className="text-sm text-gray-500">
              {storageFacilities.filter((s) => s.status === "Active").length} of{" "}
              {storageFacilities.length} active
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {storageFacilities.map((facility) => (
              <StorageFacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <h4 className="font-medium text-gray-900 mb-1">Add New Plant</h4>
              <p className="text-sm text-gray-600">
                Register a new production facility
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <h4 className="font-medium text-gray-900 mb-1">Plan Pipeline</h4>
              <p className="text-sm text-gray-600">
                Design optimal pipeline routes
              </p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <h4 className="font-medium text-gray-900 mb-1">
                Optimize Storage
              </h4>
              <p className="text-sm text-gray-600">
                Analyze storage capacity needs
              </p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
