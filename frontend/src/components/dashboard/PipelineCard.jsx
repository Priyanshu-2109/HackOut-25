import React from "react";
import { RectangleGroupIcon } from "@heroicons/react/24/outline";

const PipelineCard = ({ pipeline }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "under construction":
        return "bg-blue-100 text-blue-800";
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
        <div className="flex gap-2 items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <RectangleGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pipeline Route
            </h3>
            <p className="text-sm text-gray-600">{pipeline.route}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            pipeline.status
          )}`}
        >
          {pipeline.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Length</p>
          <p className="text-lg font-semibold text-gray-900">
            {pipeline.length}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Diameter</p>
          <p className="text-lg font-semibold text-gray-900">
            {pipeline.diameter}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Capacity</p>
          <p className="text-lg font-semibold text-gray-900">
            {pipeline.capacity}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pressure</p>
          <p className="text-lg font-semibold text-gray-900">
            {pipeline.pressure}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PipelineCard;
