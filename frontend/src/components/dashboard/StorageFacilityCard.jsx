import React from "react";
import { CubeIcon } from "@heroicons/react/24/outline";

const StorageFacilityCard = ({ facility }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCapacityPercentage = () => {
    const current = parseInt(facility.currentLevel.replace(/[^\d]/g, ""));
    const total = parseInt(facility.capacity.replace(/[^\d]/g, ""));
    return Math.round((current / total) * 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const capacityPercentage = getCapacityPercentage();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CubeIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {facility.name}
            </h3>
            <p className="text-sm text-gray-600">{facility.location}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            facility.status
          )}`}
        >
          {facility.status}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Capacity</span>
          <span className="text-sm font-medium text-gray-900">
            {capacityPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getCapacityColor(
              capacityPercentage
            )}`}
            style={{ width: `${capacityPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{facility.currentLevel}</span>
          <span>{facility.capacity}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="text-sm font-semibold text-gray-900">{facility.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pressure</p>
          <p className="text-sm font-semibold text-gray-900">
            {facility.pressure}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageFacilityCard;
