import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  LayersControl,
  LayerGroup,
  useMapEvents,
  Polygon,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { LocalStorageService } from "../utils/localStorageService";
import AdvancedLocalStorageService from "../utils/advancedLocalStorageService";
import { comprehensiveLocalStorageService } from "../utils/comprehensiveLocalStorageService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  MapPinIcon,
  BuildingOffice2Icon,
  CubeIcon,
  RectangleGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CogIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  TruckIcon,
  BanknotesIcon,
  BeakerIcon,
  ClockIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BoltIcon,
  InformationCircleIcon,
  ChartPieIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
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
const createCustomIcon = (color, symbol) => {
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3" opacity="0.9"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
        ${symbol}
      </text>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Asset icons
const assetIcons = {
  plant: createCustomIcon("#10B981", "P"),
  storage: createCustomIcon("#3B82F6", "S"),
  pipeline: "#6B7280",
  renewable: createCustomIcon("#F59E0B", "R"),
  demand: createCustomIcon("#EF4444", "D"),
  zone: createCustomIcon("#8B5CF6", "Z"),
};

// Map click event handler
function MapEvents({ onMapClick, showingSiteSelection, onAddInfrastructure, addingInfrastructure }) {
  useMapEvents({
    click(e) {
      if (showingSiteSelection) {
        onMapClick(e.latlng);
      } else if (addingInfrastructure) {
        onAddInfrastructure(e.latlng);
      }
    },
  });
  return null;
}

// Add Infrastructure Modal Component
const AddInfrastructureModal = ({ isOpen, onClose, location, onSave }) => {
  const [infrastructureType, setInfrastructureType] = useState('plant');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('Active');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSave = () => {
    if (!name || !capacity) {
      showError('Please fill in all required fields');
      return;
    }

    const newInfrastructure = {
      id: `infrastructure_${Date.now()}`,
      name,
      type: infrastructureType,
      latitude: location.lat,
      longitude: location.lng,
      capacity: `${capacity} MW`,
      status,
      cost: cost ? `$${cost}M` : 'TBD',
      description,
      efficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`,
      createdBy: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isUserAdded: true,
      coordinates: [location.lat, location.lng]
    };

    onSave(newInfrastructure);
    showSuccess('Infrastructure added successfully!');
    onClose();
    
    // Reset form
    setName('');
    setCapacity('');
    setCost('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Infrastructure</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Infrastructure Type *
            </label>
            <select
              value={infrastructureType}
              onChange={(e) => setInfrastructureType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="plant">Hydrogen Production Plant</option>
              <option value="storage">Storage Facility</option>
              <option value="pipeline">Pipeline Network</option>
              <option value="renewable">Renewable Energy Source</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter infrastructure name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (MW) *
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Enter capacity"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Active">Active</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Planned">Planned</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Cost (Million $)
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Enter estimated cost"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="text-xs text-gray-500">
            Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            Add Infrastructure
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const InfrastructureMapping = () => {
  const [infrastructureData, setInfrastructureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Center of USA
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [siteSelectionMode, setSiteSelectionMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('infrastructure');
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const mapRef = useRef(null);

  // New state for infrastructure management
  const [addingInfrastructure, setAddingInfrastructure] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInfrastructureLocation, setNewInfrastructureLocation] = useState(null);
  const [userInfrastructure, setUserInfrastructure] = useState([]);
  const [collaborativeInfrastructure, setCollaborativeInfrastructure] = useState([]);

  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  // Enhanced state management
  const [renewableSources, setRenewableSources] = useState([]);
  const [demandCenters, setDemandCenters] = useState([]);
  const [regulatoryZones, setRegulatoryZones] = useState([]);
  const [siteEvaluations, setSiteEvaluations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [costAnalysis, setCostAnalysis] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState([]);
  const [environmentalImpact, setEnvironmentalImpact] = useState(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(null);

  const [filters, setFilters] = useState({
    showPlants: true,
    showStorage: true,
    showPipelines: true,
    showRenewable: true,
    showDemand: true,
    showZones: true,
    showEvaluations: false,
    plantStatus: 'all',
    storageUtilization: 'all',
    renewableType: 'all',
    demandType: 'all',
    zoneType: 'all',
  });

  // Load comprehensive data from localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load basic infrastructure data
        let data = LocalStorageService.getInfrastructureData();
        
        if (!LocalStorageService.hasInfrastructureData()) {
          const optimizationResults = LocalStorageService.getOptimizationResults();
          if (!optimizationResults) {
            data = LocalStorageService.generateSampleData();
          } else {
            data = LocalStorageService.updateInfrastructureFromOptimization();
          }
        }
        
        // Load advanced data
        const renewables = AdvancedLocalStorageService.getRenewableSources();
        const demand = AdvancedLocalStorageService.getDemandCenters();
        const zones = AdvancedLocalStorageService.getRegulatoryZones();
        const evaluations = AdvancedLocalStorageService.getSiteEvaluations();
        const projectsData = AdvancedLocalStorageService.getProjects();
        const cost = AdvancedLocalStorageService.getCostAnalysis();
        const risk = AdvancedLocalStorageService.getRiskAssessment();
        const environmental = AdvancedLocalStorageService.getEnvironmentalImpact();
        const predictive = AdvancedLocalStorageService.getPredictiveAnalytics();
        
        // Set all data
        setInfrastructureData(data);
        setRenewableSources(renewables);
        setDemandCenters(demand);
        setRegulatoryZones(zones);
        setSiteEvaluations(evaluations);
        setProjects(projectsData);
        setCostAnalysis(cost);
        setRiskAssessment(risk);
        setEnvironmentalImpact(environmental);
        setPredictiveAnalytics(predictive);
        
      } catch (error) {
        console.error('Error loading infrastructure data:', error);
        const data = LocalStorageService.generateSampleData();
        setInfrastructureData(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Enhanced map click handler for comprehensive site analysis
  const handleMapClick = async (latlng) => {
    if (!siteSelectionMode) return;
    
    setSelectedLocation([latlng.lat, latlng.lng]);
    setLoading(true);
    
    try {
      // Perform comprehensive site analysis
      const analysis = AdvancedLocalStorageService.performSiteAnalysis([latlng.lat, latlng.lng]);
      setRecommendations(analysis.recommendations);
      setSelectedAsset(analysis);
      
      // Update site evaluations list
      const updatedEvaluations = AdvancedLocalStorageService.getSiteEvaluations();
      setSiteEvaluations(updatedEvaluations);
      
    } catch (error) {
      console.error('Error analyzing site:', error);
      setRecommendations([{
        type: 'info',
        title: 'Site Selected',
        description: `Location: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
        priority: 'medium'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new infrastructure to the map
  const handleAddInfrastructure = (latlng) => {
    setNewInfrastructureLocation(latlng);
    setShowAddModal(true);
    setAddingInfrastructure(false);
  };

  // Save new infrastructure
  const handleSaveInfrastructure = (newInfrastructure) => {
    try {
      // Save to comprehensive local storage
      const storageKey = 
        newInfrastructure.type === 'plant' ? 'hydrogrid_production_plants' :
        newInfrastructure.type === 'storage' ? 'hydrogrid_storage_facilities' :
        newInfrastructure.type === 'pipeline' ? 'hydrogrid_pipeline_networks' :
        'hydrogrid_renewable_sources';

      const existingData = comprehensiveLocalStorageService.getItem(storageKey) || [];
      const updatedData = [...existingData, newInfrastructure];
      comprehensiveLocalStorageService.setItem(storageKey, updatedData);

      // Also save to user infrastructure list
      const userInfraList = comprehensiveLocalStorageService.getItem('user_infrastructure') || [];
      userInfraList.push(newInfrastructure);
      comprehensiveLocalStorageService.setItem('user_infrastructure', userInfraList);
      setUserInfrastructure(userInfraList);

      // Simulate collaborative feature - randomly add infrastructure from "other users"
      simulateCollaborativeInfrastructure();

      // Refresh the map data
      refreshMapData();
      
      console.log('🏭 New infrastructure added:', newInfrastructure);
    } catch (error) {
      console.error('❌ Error saving infrastructure:', error);
      showError('Failed to save infrastructure');
    }
  };

  // Simulate collaborative infrastructure from other users
  const simulateCollaborativeInfrastructure = () => {
    const collaborativeData = comprehensiveLocalStorageService.getItem('collaborative_infrastructure') || [];
    
    // Add random infrastructure from "other users" occasionally
    if (Math.random() > 0.7) {
      const randomInfrastructure = {
        id: `collab_${Date.now()}`,
        name: `Community ${['Hydrogen Hub', 'Solar Plant', 'Wind Farm'][Math.floor(Math.random() * 3)]}`,
        type: ['plant', 'storage', 'renewable'][Math.floor(Math.random() * 3)],
        latitude: 39.8283 + (Math.random() - 0.5) * 10,
        longitude: -98.5795 + (Math.random() - 0.5) * 20,
        capacity: `${(Math.random() * 100 + 50).toFixed(0)} MW`,
        status: 'Active',
        cost: `$${(Math.random() * 5 + 1).toFixed(1)}M`,
        createdBy: ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown'][Math.floor(Math.random() * 4)],
        createdAt: new Date().toISOString(),
        isCollaborative: true,
        efficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`
      };

      collaborativeData.push(randomInfrastructure);
      comprehensiveLocalStorageService.setItem('collaborative_infrastructure', collaborativeData);
      setCollaborativeInfrastructure(collaborativeData);
      
      showSuccess(`New infrastructure added by ${randomInfrastructure.createdBy}!`);
    }
  };

  // Refresh map data
  const refreshMapData = () => {
    const data = comprehensiveLocalStorageService.getComprehensiveDashboardData();
    setInfrastructureData(data.infrastructure);
  };

  // Load user and collaborative infrastructure
  useEffect(() => {
    const userInfraList = comprehensiveLocalStorageService.getItem('user_infrastructure') || [];
    const collabInfraList = comprehensiveLocalStorageService.getItem('collaborative_infrastructure') || [];
    setUserInfrastructure(userInfraList);
    setCollaborativeInfrastructure(collabInfraList);

    // Set up periodic updates to simulate real-time collaboration
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        simulateCollaborativeInfrastructure();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Toggle add infrastructure mode
  const toggleAddInfrastructure = () => {
    setAddingInfrastructure(!addingInfrastructure);
    setSiteSelectionMode(false);
    if (addingInfrastructure) {
      showWarning('Infrastructure adding mode disabled');
    } else {
      showSuccess('Click on the map to add new infrastructure');
    }
  };

  if (loading && !infrastructureData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive infrastructure data...</p>
        </div>
      </div>
    );
  }

  const { productionPlants = [], storageFacilities = [], pipelines = [] } = infrastructureData || {};

  // Enhanced filtering with all data sources
  const filteredPlants = productionPlants.filter(plant => {
    if (!filters.showPlants) return false;
    if (filters.plantStatus !== 'all' && plant.status.toLowerCase() !== filters.plantStatus) return false;
    return true;
  });

  const filteredStorage = storageFacilities.filter(facility => {
    if (!filters.showStorage) return false;
    if (filters.storageUtilization === 'high' && parseInt(facility.utilization?.replace('%', '') || 0) < 80) return false;
    if (filters.storageUtilization === 'low' && parseInt(facility.utilization?.replace('%', '') || 0) > 50) return false;
    return true;
  });

  const filteredPipelines = pipelines.filter(pipeline => {
    if (!filters.showPipelines) return false;
    return true;
  });

  const filteredRenewable = renewableSources.filter(source => {
    if (!filters.showRenewable) return false;
    if (filters.renewableType !== 'all' && source.type !== filters.renewableType) return false;
    return true;
  });

  const filteredDemand = demandCenters.filter(center => {
    if (!filters.showDemand) return false;
    if (filters.demandType !== 'all' && center.type !== filters.demandType) return false;
    return true;
  });

  const filteredZones = regulatoryZones.filter(zone => {
    if (!filters.showZones) return false;
    if (filters.zoneType !== 'all' && zone.type !== filters.zoneType) return false;
    return true;
  });

  const filteredEvaluations = siteEvaluations.filter(evaluation => {
    if (!filters.showEvaluations) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Green Hydrogen Infrastructure Mapping
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive mapping and optimization platform for hydrogen ecosystem planning
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleAddInfrastructure}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  addingInfrastructure ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50'
                }`}
                title="Add new infrastructure to the map"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {addingInfrastructure ? 'Cancel Add' : 'Add Infrastructure'}
              </button>
              <button
                onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showAdvancedPanel ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <CogIcon className="h-4 w-4 mr-2" />
                Advanced Tools
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button
                onClick={() => {
                  setSiteSelectionMode(!siteSelectionMode);
                  setSelectedLocation(null);
                  setRecommendations([]);
                }}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  siteSelectionMode ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                {siteSelectionMode ? 'Exit Analysis Mode' : 'Site Analysis Mode'}
              </button>
            </div>
          </div>

          {/* Advanced Tools Panel */}
          <AnimatePresence>
            {showAdvancedPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex space-x-6 border-b border-gray-200 pb-3 mb-4">
                    <button
                      onClick={() => setActiveTab('infrastructure')}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'infrastructure' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Infrastructure Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'projects' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Projects
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'analytics' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Predictive Analytics
                    </button>
                    <button
                      onClick={() => setActiveTab('costs')}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'costs' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <BanknotesIcon className="h-4 w-4 mr-2" />
                      Cost Analysis
                    </button>
                    <button
                      onClick={() => setActiveTab('environmental')}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'environmental' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <BeakerIcon className="h-4 w-4 mr-2" />
                      Environmental Impact
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-32">
                    {activeTab === 'infrastructure' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-900">Production Plants</h4>
                          <p className="text-2xl font-bold text-green-700 mt-2">{filteredPlants.length}</p>
                          <p className="text-xs text-green-600">Active facilities</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900">Storage Facilities</h4>
                          <p className="text-2xl font-bold text-blue-700 mt-2">{filteredStorage.length}</p>
                          <p className="text-xs text-blue-600">Storage sites</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-yellow-900">Renewable Sources</h4>
                          <p className="text-2xl font-bold text-yellow-700 mt-2">{filteredRenewable.length}</p>
                          <p className="text-xs text-yellow-600">Energy sources</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-red-900">Demand Centers</h4>
                          <p className="text-2xl font-bold text-red-700 mt-2">{filteredDemand.length}</p>
                          <p className="text-xs text-red-600">Consumer hubs</p>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'projects' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.slice(0, 4).map((project) => (
                          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'analytics' && predictiveAnalytics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900">Demand Forecast</h4>
                          <p className="text-xl font-bold text-blue-700 mt-2">
                            {predictiveAnalytics.demandForecast?.nextYear?.value?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-xs text-blue-600">tonnes next year</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-900">Efficiency Gains</h4>
                          <p className="text-xl font-bold text-green-700 mt-2">
                            {predictiveAnalytics.performanceOptimization?.efficiencyGains || 'N/A'}
                          </p>
                          <p className="text-xs text-green-600">projected improvement</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-purple-900">Cost Reduction</h4>
                          <p className="text-xl font-bold text-purple-700 mt-2">
                            {predictiveAnalytics.performanceOptimization?.costReduction || 'N/A'}
                          </p>
                          <p className="text-xs text-purple-600">operational savings</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'costs' && costAnalysis && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-yellow-900">Total CAPEX</h4>
                          <p className="text-lg font-bold text-yellow-700 mt-2">
                            ${((costAnalysis.capitalExpenditure?.plants || 0) + 
                                (costAnalysis.capitalExpenditure?.storage || 0) + 
                                (costAnalysis.capitalExpenditure?.pipelines || 0)).toFixed(1)}M
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-900">NPV</h4>
                          <p className="text-lg font-bold text-green-700 mt-2">
                            {costAnalysis.netPresentValue || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900">IRR</h4>
                          <p className="text-lg font-bold text-blue-700 mt-2">
                            {costAnalysis.internalRateOfReturn || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-red-900">Payback</h4>
                          <p className="text-lg font-bold text-red-700 mt-2">
                            {costAnalysis.paybackPeriod || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'environmental' && environmentalImpact && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-900">CO2 Impact</h4>
                          <p className="text-lg font-bold text-green-700 mt-2">
                            {environmentalImpact.carbonFootprint?.netAnnual?.value?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-xs text-green-600">tonnes CO2/year</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900">Water Usage</h4>
                          <p className="text-lg font-bold text-blue-700 mt-2">
                            {environmentalImpact.waterUsage?.total?.value || 'N/A'}
                          </p>
                          <p className="text-xs text-blue-600">L/kg H2</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-purple-900">Land Use</h4>
                          <p className="text-lg font-bold text-purple-700 mt-2">
                            {environmentalImpact.landUse?.total?.value || 'N/A'}
                          </p>
                          <p className="text-xs text-purple-600">hectares</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Enhanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Map Filters
                </h3>
                
                <div className="space-y-6">
                  {/* Layer Controls */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Infrastructure Layers</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'showPlants', label: 'Production Plants', count: filteredPlants.length, color: 'green' },
                        { key: 'showStorage', label: 'Storage Facilities', count: filteredStorage.length, color: 'blue' },
                        { key: 'showPipelines', label: 'Pipeline Networks', count: filteredPipelines.length, color: 'gray' },
                        { key: 'showRenewable', label: 'Renewable Sources', count: filteredRenewable.length, color: 'yellow' },
                        { key: 'showDemand', label: 'Demand Centers', count: filteredDemand.length, color: 'red' },
                        { key: 'showZones', label: 'Regulatory Zones', count: filteredZones.length, color: 'purple' },
                        { key: 'showEvaluations', label: 'Site Evaluations', count: filteredEvaluations.length, color: 'indigo' },
                      ].map(({ key, label, count, color }) => (
                        <label key={key} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters[key]}
                              onChange={(e) => setFilters({...filters, [key]: e.target.checked})}
                              className={`rounded border-gray-300 text-${color}-600`}
                            />
                            <span className="ml-2 text-sm text-gray-600">{label}</span>
                          </div>
                          <span className={`px-2 py-1 bg-${color}-100 text-${color}-800 text-xs rounded-full`}>
                            {count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Status Filters</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'plantStatus', label: 'Plant Status', options: [
                          { value: 'all', label: 'All Status' },
                          { value: 'active', label: 'Active' },
                          { value: 'maintenance', label: 'Maintenance' },
                        ]},
                        { key: 'renewableType', label: 'Renewable Type', options: [
                          { value: 'all', label: 'All Types' },
                          { value: 'wind', label: 'Wind' },
                          { value: 'solar', label: 'Solar' },
                          { value: 'hydro', label: 'Hydro' },
                          { value: 'offshore_wind', label: 'Offshore Wind' },
                        ]},
                      ].map(({ key, label, options }) => (
                        <div key={key}>
                          <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                          <select
                            value={filters[key]}
                            onChange={(e) => setFilters({...filters, [key]: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            {options.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setFilters({
                          showPlants: true,
                          showStorage: true,
                          showPipelines: true,
                          showRenewable: true,
                          showDemand: true,
                          showZones: true,
                          showEvaluations: false,
                          plantStatus: 'all',
                          storageUtilization: 'all',
                          renewableType: 'all',
                          demandType: 'all',
                          zoneType: 'all'
                        })}
                        className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Show All Infrastructure
                      </button>
                      <button
                        onClick={() => {
                          setFilters({...filters, showEvaluations: true});
                          setActiveTab('analytics');
                        }}
                        className="w-full px-3 py-2 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                      >
                        Show Site Analysis
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={showFilters ? "xl:col-span-2" : "xl:col-span-3"}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div style={{ height: "70vh" }}>
                <MapContainer
                  center={mapCenter}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  ref={mapRef}
                >
                  <MapEvents 
                    onMapClick={handleMapClick} 
                    showingSiteSelection={siteSelectionMode}
                    onAddInfrastructure={handleAddInfrastructure}
                    addingInfrastructure={addingInfrastructure}
                  />
                  
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="Satellite">
                      <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                    </LayersControl.BaseLayer>

                    {/* Production Plants Layer */}
                    <LayersControl.Overlay checked name="Production Plants">
                      <LayerGroup>
                        {filteredPlants.map((plant) => (
                          <Marker
                            key={plant.id}
                            position={plant.coordinates}
                            icon={assetIcons.plant}
                          >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                              <div className="text-center">
                                <div className="font-semibold">{plant.name}</div>
                                <div className="text-xs">{plant.capacity} | {plant.status}</div>
                                {plant.createdBy && (
                                  <div className="text-xs text-gray-500">by {plant.createdBy}</div>
                                )}
                              </div>
                            </Tooltip>
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-green-800">{plant.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {plant.type}<br/>
                                  <strong>Capacity:</strong> {plant.capacity}<br/>
                                  <strong>Production:</strong> {plant.productionRate}<br/>
                                  <strong>Status:</strong> {plant.status}<br/>
                                  <strong>Efficiency:</strong> {plant.efficiency}
                                  {plant.createdBy && (
                                    <React.Fragment>
                                      <br/><strong>Added by:</strong> {plant.createdBy}
                                      <br/><strong>Date:</strong> {new Date(plant.createdAt).toLocaleDateString()}
                                    </React.Fragment>
                                  )}
                                  {plant.isUserAdded && (
                                    <React.Fragment>
                                      <br/><span className="text-green-600 font-medium">✓ Your Addition</span>
                                    </React.Fragment>
                                  )}
                                  {plant.isCollaborative && (
                                    <React.Fragment>
                                      <br/><span className="text-blue-600 font-medium">🤝 Community Addition</span>
                                    </React.Fragment>
                                  )}
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                        
                        {/* User Added Infrastructure */}
                        {userInfrastructure.filter(infra => infra.type === 'plant').map((plant) => (
                          <Marker
                            key={plant.id}
                            position={[plant.latitude, plant.longitude]}
                            icon={assetIcons.plant}
                          >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                              <div className="text-center">
                                <div className="font-semibold">{plant.name}</div>
                                <div className="text-xs">{plant.capacity} | {plant.status}</div>
                                <div className="text-xs text-green-600">✓ Your Addition</div>
                              </div>
                            </Tooltip>
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-green-800">{plant.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> Hydrogen Production Plant<br/>
                                  <strong>Capacity:</strong> {plant.capacity}<br/>
                                  <strong>Status:</strong> {plant.status}<br/>
                                  <strong>Cost:</strong> {plant.cost}<br/>
                                  <strong>Efficiency:</strong> {plant.efficiency}<br/>
                                  <strong>Added by:</strong> {plant.createdBy}<br/>
                                  <strong>Date:</strong> {new Date(plant.createdAt).toLocaleDateString()}<br/>
                                  <span className="text-green-600 font-medium">✓ Your Addition</span>
                                  {plant.description && (
                                    <React.Fragment>
                                      <br/><strong>Description:</strong> {plant.description}
                                    </React.Fragment>
                                  )}
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                        
                        {/* Collaborative Infrastructure */}
                        {collaborativeInfrastructure.filter(infra => infra.type === 'plant').map((plant) => (
                          <Marker
                            key={plant.id}
                            position={[plant.latitude, plant.longitude]}
                            icon={assetIcons.plant}
                          >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                              <div className="text-center">
                                <div className="font-semibold">{plant.name}</div>
                                <div className="text-xs">{plant.capacity} | {plant.status}</div>
                                <div className="text-xs text-blue-600">🤝 Community</div>
                              </div>
                            </Tooltip>
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-green-800">{plant.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> Hydrogen Production Plant<br/>
                                  <strong>Capacity:</strong> {plant.capacity}<br/>
                                  <strong>Status:</strong> {plant.status}<br/>
                                  <strong>Cost:</strong> {plant.cost}<br/>
                                  <strong>Efficiency:</strong> {plant.efficiency}<br/>
                                  <strong>Added by:</strong> {plant.createdBy}<br/>
                                  <strong>Date:</strong> {new Date(plant.createdAt).toLocaleDateString()}<br/>
                                  <span className="text-blue-600 font-medium">🤝 Community Addition</span>
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Storage Facilities Layer */}
                    <LayersControl.Overlay checked name="Storage Facilities">
                      <LayerGroup>
                        {filteredStorage.map((facility) => (
                          <Marker
                            key={facility.id}
                            position={facility.coordinates}
                            icon={assetIcons.storage}
                          >
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-blue-800">{facility.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {facility.type}<br/>
                                  <strong>Capacity:</strong> {facility.capacity}<br/>
                                  <strong>Current Level:</strong> {facility.currentLevel}<br/>
                                  <strong>Utilization:</strong> {facility.utilization}<br/>
                                  <strong>Status:</strong> {facility.status}
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Pipelines Layer */}
                    <LayersControl.Overlay checked name="Pipelines">
                      <LayerGroup>
                        {filteredPipelines.map((pipeline) => (
                          pipeline.coordinates && pipeline.coordinates.length === 2 && (
                            <Polyline
                              key={pipeline.id}
                              positions={pipeline.coordinates}
                              color={assetIcons.pipeline}
                              weight={4}
                              opacity={0.7}
                            >
                              <Popup>
                                <div className="p-2">
                                  <h4 className="font-semibold text-gray-800">{pipeline.route}</h4>
                                  <p className="text-sm text-gray-600">
                                    <strong>Length:</strong> {pipeline.length}<br/>
                                    <strong>Diameter:</strong> {pipeline.diameter}<br/>
                                    <strong>Status:</strong> {pipeline.status}<br/>
                                    <strong>Capacity:</strong> {pipeline.capacity}
                                  </p>
                                </div>
                              </Popup>
                            </Polyline>
                          )
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Renewable Energy Sources Layer */}
                    <LayersControl.Overlay checked name="Renewable Sources">
                      <LayerGroup>
                        {filteredRenewable.map((source) => (
                          <Marker
                            key={source.id}
                            position={source.coordinates}
                            icon={createCustomIcon(
                              source.type === 'wind' ? '#10B981' :
                              source.type === 'solar' ? '#F59E0B' :
                              source.type === 'hydro' ? '#3B82F6' : '#8B5CF6', 
                              source.type === 'wind' ? 'W' :
                              source.type === 'solar' ? 'S' :
                              source.type === 'hydro' ? 'H' : 'O'
                            )}
                          >
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-green-800">{source.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {source.type}<br/>
                                  <strong>Capacity:</strong> {source.capacity}<br/>
                                  <strong>Availability:</strong> {source.availability}<br/>
                                  <strong>Cost/MWh:</strong> {source.costPerMWh}<br/>
                                  <strong>Status:</strong> {source.status}
                                </p>
                              </div>
                            </Popup>
                            <Tooltip permanent direction="top" offset={[0, -20]} className="text-xs">
                              {source.name}
                            </Tooltip>
                          </Marker>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Demand Centers Layer */}
                    <LayersControl.Overlay checked name="Demand Centers">
                      <LayerGroup>
                        {filteredDemand.map((center) => (
                          <Marker
                            key={center.id}
                            position={center.coordinates}
                            icon={createCustomIcon(
                              center.priority === 'high' ? '#EF4444' :
                              center.priority === 'medium' ? '#F59E0B' : '#10B981',
                              'D'
                            )}
                          >
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-red-800">{center.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {center.type}<br/>
                                  <strong>Current Demand:</strong> {center.currentDemand}<br/>
                                  <strong>Projected Demand:</strong> {center.projectedDemand}<br/>
                                  <strong>Growth Rate:</strong> {center.growthRate}<br/>
                                  <strong>Priority:</strong> {center.priority}
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Regulatory Zones Layer */}
                    <LayersControl.Overlay name="Regulatory Zones">
                      <LayerGroup>
                        {filteredZones.map((zone) => (
                          <Polygon
                            key={zone.id}
                            positions={zone.coordinates}
                            fillColor={zone.color}
                            fillOpacity={0.2}
                            color={zone.color}
                            weight={2}
                          >
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold" style={{ color: zone.color }}>
                                  {zone.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {zone.type}<br/>
                                  <strong>Status:</strong> {zone.status}<br/>
                                  <strong>Incentives:</strong> {zone.incentives.join(', ')}<br/>
                                  <strong>Restrictions:</strong> {zone.restrictions.join(', ')}
                                </p>
                              </div>
                            </Popup>
                          </Polygon>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Site Evaluations Layer */}
                    <LayersControl.Overlay name="Site Evaluations">
                      <LayerGroup>
                        {filteredEvaluations.map((evaluation, index) => (
                          <Marker
                            key={`eval_${index}`}
                            position={evaluation.coordinates}
                            icon={createCustomIcon(
                              evaluation.suitability === 'Excellent' ? '#10B981' :
                              evaluation.suitability === 'Good' ? '#F59E0B' :
                              evaluation.suitability === 'Fair' ? '#8B5CF6' : '#EF4444',
                              evaluation.overallScore?.toString().substring(0, 2) || '?'
                            )}
                          >
                            <Popup>
                              <div className="p-3 max-w-xs">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Site Analysis Result
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Overall Score:</span>
                                    <span className="font-medium">{evaluation.overallScore}/100</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Suitability:</span>
                                    <span className={`font-medium ${
                                      evaluation.suitability === 'Excellent' ? 'text-green-600' :
                                      evaluation.suitability === 'Good' ? 'text-yellow-600' :
                                      evaluation.suitability === 'Fair' ? 'text-purple-600' : 'text-red-600'
                                    }`}>
                                      {evaluation.suitability}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Selected Location Marker */}
                    {selectedLocation && (
                      <LayersControl.Overlay checked name="Analysis Point">
                        <Marker
                          position={selectedLocation}
                          icon={createCustomIcon("#FF0000", "📍")}
                        >
                          <Popup>
                            <div className="p-2">
                              <h4 className="font-semibold text-red-800">Analysis Point</h4>
                              <p className="text-sm text-gray-600">
                                Lat: {selectedLocation[0]?.toFixed(4)}<br/>
                                Lng: {selectedLocation[1]?.toFixed(4)}
                              </p>
                              {selectedAsset && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs font-medium">
                                    Score: {selectedAsset.overallScore}/100
                                  </p>
                                  <p className="text-xs">
                                    Suitability: {selectedAsset.suitability}
                                  </p>
                                </div>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      </LayersControl.Overlay>
                    )}
                  </LayersControl>
                </MapContainer>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Recommendations Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-1"
          >
            <div className="space-y-6">
              {/* Site Analysis Results */}
              {selectedAsset && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Site Analysis Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Score</span>
                        <span className="text-lg font-bold text-blue-600">
                          {selectedAsset.overallScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedAsset.overallScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Suitability: {selectedAsset.suitability}
                      </p>
                    </div>

                    {recommendations.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Key Insights:</h4>
                        {recommendations.slice(0, 3).map((rec, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${
                                rec.type === 'strength' ? 'text-green-700' :
                                rec.type === 'concern' ? 'text-red-700' :
                                rec.type === 'opportunity' ? 'text-blue-700' : 'text-gray-700'
                              }`}>
                                {rec.title}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Infrastructure Overview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BuildingOffice2Icon className="h-5 w-5 mr-2 text-green-600" />
                  Infrastructure Overview
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Production Plants', count: filteredPlants.length, color: 'green', icon: BuildingOffice2Icon },
                    { label: 'Storage Facilities', count: filteredStorage.length, color: 'blue', icon: CubeIcon },
                    { label: 'Pipeline Networks', count: filteredPipelines.length, color: 'gray', icon: RectangleGroupIcon },
                    { label: 'Renewable Sources', count: filteredRenewable.length, color: 'yellow', icon: BoltIcon },
                    { label: 'Demand Centers', count: filteredDemand.length, color: 'red', icon: MapPinIcon },
                  ].map(({ label, count, color, icon: Icon }) => (
                    <div key={label} className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg`}>
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 text-${color}-600 mr-2`} />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <span className={`text-sm font-bold text-${color}-600`}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowAdvancedPanel(true);
                      setActiveTab('projects');
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    View Projects
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAdvancedPanel(true);
                      setActiveTab('costs');
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <CalculatorIcon className="h-4 w-4 mr-2" />
                    Cost Analysis
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAdvancedPanel(true);
                      setActiveTab('environmental');
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <BeakerIcon className="h-4 w-4 mr-2" />
                    Environmental Impact
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { color: '#10B981', label: 'Production Plants (P)' },
                    { color: '#3B82F6', label: 'Storage Facilities (S)' },
                    { color: '#6B7280', label: 'Pipeline Networks', isLine: true },
                    { color: '#F59E0B', label: 'Renewable Sources (W/S/H/O)' },
                    { color: '#EF4444', label: 'Demand Centers (D)' },
                    { color: '#8B5CF6', label: 'Regulatory Zones', isArea: true },
                  ].map(({ color, label, isLine, isArea }) => (
                    <div key={label} className="flex items-center">
                      <div 
                        className={`mr-2 ${
                          isLine ? 'w-4 h-1' : 
                          isArea ? 'w-4 h-4 opacity-30' : 
                          'w-4 h-4 rounded-full'
                        }`}
                        style={{ backgroundColor: color }}
                      ></div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Infrastructure Modal */}
        <AddInfrastructureModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          location={newInfrastructureLocation}
          onSave={handleSaveInfrastructure}
        />

        {/* Status indicator for adding infrastructure */}
        {addingInfrastructure && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              Click on the map to add new infrastructure
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructureMapping;
