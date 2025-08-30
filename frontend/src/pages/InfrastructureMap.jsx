import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  productionPlants,
  storageFacilities,
  pipelines,
} from "../assets/assets";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different facility types
const createCustomIcon = (color, type) => {
  const svgIcon = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
        ${type}
      </text>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const productionIcon = createCustomIcon("#3B82F6", "P");
const storageIcon = createCustomIcon("#10B981", "S");

const InfrastructureMap = () => {
  const [activeLayer, setActiveLayer] = useState({
    plants: true,
    storage: true,
    pipelines: true,
  });
  const [selectedFacility, setSelectedFacility] = useState(null);

  const toggleLayer = (layer) => {
    setActiveLayer((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "operational":
        return "text-green-600";
      case "maintenance":
        return "text-yellow-600";
      case "under construction":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getPipelineColor = (status) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "#10B981";
      case "under construction":
        return "#3B82F6";
      case "maintenance":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
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
            Infrastructure Map
          </h1>
          <p className="text-xl text-gray-600">
            Interactive visualization of global green hydrogen infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Controls */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Map Layers
              </h3>

              <div className="space-y-4">
                <label className="flex gap-2 items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayer.plants}
                    onChange={() => toggleLayer("plants")}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Production Plants</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayer.storage}
                    onChange={() => toggleLayer("storage")}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2 space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Storage Facilities</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayer.pipelines}
                    onChange={() => toggleLayer("pipelines")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex items-center gap-2 space-x-2">
                    <div className="w-4 h-1 bg-purple-500 rounded"></div>
                    <span className="text-gray-700">Pipelines</span>
                  </div>
                </label>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Plants:</span>
                    <span className="font-medium">
                      {productionPlants.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Facilities:</span>
                    <span className="font-medium">
                      {storageFacilities.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pipeline Routes:</span>
                    <span className="font-medium">{pipelines.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div style={{ height: "600px" }}>
                <MapContainer
                  center={[40.0, -20.0]}
                  zoom={3}
                  style={{ height: "100%", width: "100%" }}
                  className="rounded-xl"
                  zoomControl={true}
                  scrollWheelZoom={true}
                  doubleClickZoom={true}
                  touchZoom={true}
                  boxZoom={true}
                  keyboard={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Production Plants */}
                  {activeLayer.plants &&
                    productionPlants.map((plant) => (
                      <Marker
                        key={`plant-${plant.id}`}
                        position={plant.coordinates}
                        icon={productionIcon}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {plant.name}
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Location:</span>{" "}
                                {plant.location}
                              </p>
                              <p>
                                <span className="font-medium">Type:</span>{" "}
                                {plant.type}
                              </p>
                              <p>
                                <span className="font-medium">Capacity:</span>{" "}
                                {plant.capacity}
                              </p>
                              <p>
                                <span className="font-medium">Production:</span>{" "}
                                {plant.productionRate}
                              </p>
                              <p>
                                <span className="font-medium">Efficiency:</span>{" "}
                                {plant.efficiency}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>
                                <span
                                  className={`ml-1 ${getStatusColor(
                                    plant.status
                                  )}`}
                                >
                                  {plant.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  {/* Storage Facilities */}
                  {activeLayer.storage &&
                    storageFacilities.map((facility) => (
                      <Marker
                        key={`storage-${facility.id}`}
                        position={facility.coordinates}
                        icon={storageIcon}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {facility.name}
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Location:</span>{" "}
                                {facility.location}
                              </p>
                              <p>
                                <span className="font-medium">Type:</span>{" "}
                                {facility.type}
                              </p>
                              <p>
                                <span className="font-medium">Capacity:</span>{" "}
                                {facility.capacity}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Current Level:
                                </span>{" "}
                                {facility.currentLevel}
                              </p>
                              <p>
                                <span className="font-medium">Pressure:</span>{" "}
                                {facility.pressure}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>
                                <span
                                  className={`ml-1 ${getStatusColor(
                                    facility.status
                                  )}`}
                                >
                                  {facility.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  {/* Pipelines */}
                  {activeLayer.pipelines &&
                    pipelines.map((pipeline) => (
                      <Polyline
                        key={`pipeline-${pipeline.id}`}
                        positions={pipeline.coordinates}
                        color={getPipelineColor(pipeline.status)}
                        weight={4}
                        opacity={0.8}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold text-gray-900 mb-2">
                              Pipeline Route
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Route:</span>{" "}
                                {pipeline.route}
                              </p>
                              <p>
                                <span className="font-medium">Length:</span>{" "}
                                {pipeline.length}
                              </p>
                              <p>
                                <span className="font-medium">Diameter:</span>{" "}
                                {pipeline.diameter}
                              </p>
                              <p>
                                <span className="font-medium">Capacity:</span>{" "}
                                {pipeline.capacity}
                              </p>
                              <p>
                                <span className="font-medium">Pressure:</span>{" "}
                                {pipeline.pressure}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>
                                <span
                                  className={`ml-1 ${getStatusColor(
                                    pipeline.status
                                  )}`}
                                >
                                  {pipeline.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Polyline>
                    ))}
                </MapContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Map Legend
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Production Plants
                  </h4>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Solar/Wind/Hydro Facilities
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Storage Facilities
                  </h4>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Underground/Above Ground
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Pipeline Status
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">Operational</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600">
                        Under Construction
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-600">Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureMap;
