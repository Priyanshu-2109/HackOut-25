import React from "react";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

const ProductionPlantCard = ({ plant }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BuildingOffice2Icon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {plant.name}
            </h3>
            <p className="text-sm text-gray-600">{plant.location}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            plant.status
          )}`}
        >
          {plant.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Production Rate</p>
          <p className="text-lg font-semibold text-gray-900">
            {plant.productionRate}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Capacity</p>
          <p className="text-lg font-semibold text-gray-900">
            {plant.capacity}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Efficiency</p>
          <p className="text-lg font-semibold text-gray-900">
            {plant.efficiency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductionPlantCard;
