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
  CameraIcon,
  ShareIcon,
  PrinterIcon,
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

// Icons for different asset types
const assetIcons = {
  plant: createCustomIcon("#10B981", "P"),
  storage: createCustomIcon("#3B82F6", "S"),
  hub: createCustomIcon("#8B5CF6", "H"),
  demand: createCustomIcon("#EF4444", "D"),
  renewable: createCustomIcon("#F59E0B", "R"),
  pipeline: "#6B7280",
};

// Sample renewable energy sources data
const renewableEnergySources = [
  { id: 1, name: "Solar Farm Alpha", type: "Solar", coordinates: [40.7128, -74.0060], capacity: "50 MW", status: "Operational" },
  { id: 2, name: "Wind Farm Beta", type: "Wind", coordinates: [34.0522, -118.2437], capacity: "75 MW", status: "Planned" },
  { id: 3, name: "Offshore Wind Delta", type: "Offshore Wind", coordinates: [41.8781, -87.6298], capacity: "120 MW", status: "Under Construction" },
  { id: 4, name: "Hydroelectric Gamma", type: "Hydroelectric", coordinates: [47.6062, -122.3321], capacity: "40 MW", status: "Operational" },
];

// Sample demand centers
const demandCenters = [
  { id: 1, name: "Industrial Zone A", type: "Industrial", coordinates: [39.7392, -104.9903], demand: "500 kg/day", priority: "High" },
  { id: 2, name: "Transport Hub B", type: "Transportation", coordinates: [29.7604, -95.3698], demand: "300 kg/day", priority: "Medium" },
  { id: 3, name: "Power Plant C", type: "Power Generation", coordinates: [33.4484, -112.0740], demand: "800 kg/day", priority: "High" },
];

// Regulatory zones
const regulatoryZones = [
  { id: 1, name: "Green Zone Alpha", center: [40.7128, -74.0060], radius: 100000, incentives: "High", regulations: "Favorable" },
  { id: 2, name: "Development Zone Beta", center: [34.0522, -118.2437], radius: 150000, incentives: "Medium", regulations: "Standard" },
  { id: 3, name: "Priority Zone Gamma", center: [41.8781, -87.6298], radius: 120000, incentives: "High", regulations: "Expedited" },
];

// MapEvents component to handle map interactions
function MapEvents({ onMapClick, showingSiteSelection }) {
  useMapEvents({
    click(e) {
      if (showingSiteSelection) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

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
  const [projectMode, setProjectMode] = useState(false);
  const [costAnalysisMode, setCostAnalysisMode] = useState(false);
  const [riskAssessmentMode, setRiskAssessmentMode] = useState(false);
  const [environmentalMode, setEnvironmentalMode] = useState(false);
  const mapRef = useRef(null);

  // Enhanced state management
  const [renewableSources, setRenewableSources] = useState([]);
  const [demandCenters, setDemandCenters] = useState([]);
  const [regulatoryZones, setRegulatoryZones] = useState([]);
  const [siteEvaluations, setSiteEvaluations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [costAnalysis, setCostAnalysis] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState([]);
  const [environmentalImpact, setEnvironmentalImpact] = useState(null);
  const [supplyChain, setSupplyChain] = useState(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(null);

  const [filters, setFilters] = useState({
    showPlants: true,
    showStorage: true,
    showPipelines: true,
    showRenewable: true,
    showDemand: true,
    showZones: true,
    showEvaluations: true,
    showProjects: false,
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
        const supply = AdvancedLocalStorageService.getSupplyChain();
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
        setSupplyChain(supply);
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

  // Generate site recommendations based on selected location
  const generateSiteRecommendations = (location) => {
    const lat = location.lat;
    const lng = location.lng;

    const recommendations = [];

    // Check proximity to renewable energy sources
    renewableEnergySources.forEach(source => {
      const distance = calculateDistance(lat, lng, source.coordinates[0], source.coordinates[1]);
      if (distance < 100) { // Within 100km
        recommendations.push({
          type: 'Renewable Proximity',
          score: 90 - (distance * 0.5),
          description: `Close to ${source.name} (${source.type}) - ${distance.toFixed(1)}km away`,
          category: 'Energy Source'
        });
      }
    });

    // Check proximity to demand centers
    demandCenters.forEach(center => {
      const distance = calculateDistance(lat, lng, center.coordinates[0], center.coordinates[1]);
      if (distance < 150) { // Within 150km
        const score = center.priority === 'High' ? 85 : 65;
        recommendations.push({
          type: 'Market Demand',
          score: score - (distance * 0.3),
          description: `Near ${center.name} - ${center.demand} demand, ${distance.toFixed(1)}km away`,
          category: 'Demand Center'
        });
      }
    });

    // Check regulatory zones
    regulatoryZones.forEach(zone => {
      const distance = calculateDistance(lat, lng, zone.center[0], zone.center[1]);
      if (distance < zone.radius / 1000) { // Within zone radius
        const incentiveScore = zone.incentives === 'High' ? 20 : zone.incentives === 'Medium' ? 10 : 5;
        recommendations.push({
          type: 'Regulatory Benefits',
          score: 75 + incentiveScore,
          description: `Within ${zone.name} - ${zone.incentives} incentives, ${zone.regulations} regulations`,
          category: 'Regulatory'
        });
      }
    });

    // Check proximity to existing infrastructure
    const { productionPlants = [], storageFacilities = [] } = infrastructureData || {};
    
    let infrastructureScore = 0;
    let nearbyInfrastructure = 0;

    productionPlants.forEach(plant => {
      const distance = calculateDistance(lat, lng, plant.coordinates[0], plant.coordinates[1]);
      if (distance < 50) {
        nearbyInfrastructure++;
        infrastructureScore += Math.max(20 - distance * 0.4, 5);
      }
    });

    storageFacilities.forEach(facility => {
      const distance = calculateDistance(lat, lng, facility.coordinates[0], facility.coordinates[1]);
      if (distance < 50) {
        nearbyInfrastructure++;
        infrastructureScore += Math.max(15 - distance * 0.3, 5);
      }
    });

    if (nearbyInfrastructure > 0) {
      recommendations.push({
        type: 'Infrastructure Synergy',
        score: Math.min(infrastructureScore, 80),
        description: `${nearbyInfrastructure} existing facilities nearby - potential for integration`,
        category: 'Infrastructure'
      });
    }

    // Overall site score
    const overallScore = recommendations.reduce((sum, rec) => sum + rec.score, 0) / Math.max(recommendations.length, 1);
    
    return {
      location,
      overallScore: Math.min(overallScore, 100),
      recommendations: recommendations.sort((a, b) => b.score - a.score)
    };
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Enhanced map click handler for comprehensive site analysis
  const handleMapClick = async (latlng) => {
    if (!siteSelectionMode) return;
    
    setSelectedLocation(latlng);
    setLoading(true);
    
    try {
      // Perform comprehensive site analysis
      const analysis = AdvancedLocalStorageService.performSiteAnalysis(
        [latlng.lat, latlng.lng],
        {
          analysisType: 'comprehensive',
          includeEnvironmental: environmentalMode,
          includeCost: costAnalysisMode,
          includeRisk: riskAssessmentMode
        }
      );
      
      setRecommendations(analysis.recommendations);
      setSelectedAsset(analysis);
      
      // Update site evaluations list
      const updatedEvaluations = AdvancedLocalStorageService.getSiteEvaluations();
      setSiteEvaluations(updatedEvaluations);
      
    } catch (error) {
      console.error('Error analyzing site:', error);
      // Fallback to basic recommendation
      const basicRecommendations = generateSiteRecommendations(latlng);
      setRecommendations([basicRecommendations]);
    } finally {
      setLoading(false);
    }
  };

  // Save new asset to localStorage
  const saveNewAsset = (assetData) => {
    const updatedData = { ...infrastructureData };
    
    if (assetData.type === 'plant') {
      updatedData.productionPlants = [...(updatedData.productionPlants || []), assetData];
    } else if (assetData.type === 'storage') {
      updatedData.storageFacilities = [...(updatedData.storageFacilities || []), assetData];
    } else if (assetData.type === 'pipeline') {
      updatedData.pipelines = [...(updatedData.pipelines || []), assetData];
    }

    LocalStorageService.saveInfrastructureData(updatedData);
    setInfrastructureData(updatedData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading infrastructure mapping data...</p>
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
                Comprehensive mapping and optimization tool for hydrogen ecosystem planning
              </p>
            </div>
            <div className="flex space-x-3">
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
                {siteSelectionMode ? 'Exit Selection' : 'Site Selection'}
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
                      Infrastructure
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
                      Analytics
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
                      Environmental
                    </button>
                    <button
                      onClick={() => setActiveTab('risk')}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'risk' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Risk Assessment
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {activeTab === 'infrastructure' && (
                      <>
                        <div className="lg:col-span-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Production Plants:</span>
                              <span className="font-medium">{filteredPlants.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Storage Facilities:</span>
                              <span className="font-medium">{filteredStorage.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Pipeline Networks:</span>
                              <span className="font-medium">{filteredPipelines.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Renewable Sources:</span>
                              <span className="font-medium">{filteredRenewable.length}</span>
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-3">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Analysis Modes</h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setCostAnalysisMode(!costAnalysisMode)}
                              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                costAnalysisMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <CalculatorIcon className="h-4 w-4 mr-2" />
                              Cost Analysis Mode
                            </button>
                            <button
                              onClick={() => setEnvironmentalMode(!environmentalMode)}
                              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                environmentalMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <BeakerIcon className="h-4 w-4 mr-2" />
                              Environmental Mode
                            </button>
                            <button
                              onClick={() => setRiskAssessmentMode(!riskAssessmentMode)}
                              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                riskAssessmentMode ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <ShieldCheckIcon className="h-4 w-4 mr-2" />
                              Risk Assessment Mode
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {activeTab === 'projects' && (
                      <div className="lg:col-span-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Active Projects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {projects.map((project) => (
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
                              <div className="mt-3 flex justify-between items-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                                  project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.status}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{project.budget}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'analytics' && (
                      <div className="lg:col-span-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Predictive Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900">Demand Forecast</h4>
                            <p className="text-2xl font-bold text-blue-700 mt-2">
                              {predictiveAnalytics?.demandForecast?.nextYear?.value?.toLocaleString() || 'N/A'}
                            </p>
                            <p className="text-xs text-blue-600">
                              {predictiveAnalytics?.demandForecast?.nextYear?.unit || 'tonnes'} next year
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                              {predictiveAnalytics?.demandForecast?.nextYear?.confidence || 'N/A'} confidence
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-green-900">Efficiency Gains</h4>
                            <p className="text-2xl font-bold text-green-700 mt-2">
                              {predictiveAnalytics?.performanceOptimization?.efficiencyGains || 'N/A'}
                            </p>
                            <p className="text-xs text-green-600">projected improvement</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-purple-900">Cost Reduction</h4>
                            <p className="text-2xl font-bold text-purple-700 mt-2">
                              {predictiveAnalytics?.performanceOptimization?.costReduction || 'N/A'}
                            </p>
                            <p className="text-xs text-purple-600">operational savings</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'costs' && costAnalysis && (
                      <div className="lg:col-span-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-yellow-900">Total CAPEX</h4>
                            <p className="text-xl font-bold text-yellow-700 mt-2">
                              ${((costAnalysis.capitalExpenditure.plants + 
                                  costAnalysis.capitalExpenditure.storage + 
                                  costAnalysis.capitalExpenditure.pipelines) || 0).toFixed(1)}M
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-red-900">Payback Period</h4>
                            <p className="text-xl font-bold text-red-700 mt-2">
                              {costAnalysis.paybackPeriod || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-green-900">NPV</h4>
                            <p className="text-xl font-bold text-green-700 mt-2">
                              {costAnalysis.netPresentValue || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900">IRR</h4>
                            <p className="text-xl font-bold text-blue-700 mt-2">
                              {costAnalysis.internalRateOfReturn || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'environmental' && environmentalImpact && (
                      <div className="lg:col-span-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Environmental Impact Assessment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-green-900">Carbon Impact</h4>
                            <p className="text-xl font-bold text-green-700 mt-2">
                              {environmentalImpact.carbonFootprint?.netAnnual?.value?.toLocaleString() || 'N/A'}
                            </p>
                            <p className="text-xs text-green-600">
                              {environmentalImpact.carbonFootprint?.netAnnual?.unit || 'tonnes CO2/year'}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900">Water Usage</h4>
                            <p className="text-xl font-bold text-blue-700 mt-2">
                              {environmentalImpact.waterUsage?.total?.value || 'N/A'}
                            </p>
                            <p className="text-xs text-blue-600">
                              {environmentalImpact.waterUsage?.total?.unit || 'L/kg H2'}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-purple-900">Land Use</h4>
                            <p className="text-xl font-bold text-purple-700 mt-2">
                              {environmentalImpact.landUse?.total?.value || 'N/A'}
                            </p>
                            <p className="text-xs text-purple-600">
                              {environmentalImpact.landUse?.total?.unit || 'hectares'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'risk' && (
                      <div className="lg:col-span-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Risk Assessment Matrix</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {riskAssessment.map((risk) => (
                            <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{risk.risk}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  risk.riskScore >= 6 ? 'bg-red-100 text-red-800' :
                                  risk.riskScore >= 4 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  Score: {risk.riskScore}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{risk.category}</p>
                              <p className="text-xs text-gray-500">{risk.mitigation}</p>
                              <div className="mt-3 flex justify-between">
                                <span className="text-xs text-gray-500">
                                  Probability: {risk.probability}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Impact: {risk.impact}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Site Selection Mode Alert */}
        {siteSelectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <LightBulbIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">
                <strong>Site Selection Mode:</strong> Click anywhere on the map to get location-based recommendations for new infrastructure.
              </p>
            </div>
          </motion.div>
        )}

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
                  Advanced Filters
                </h3>
                
                <div className="space-y-6">
                  {/* Asset Types */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Infrastructure Assets
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showPlants}
                            onChange={(e) => setFilters({...filters, showPlants: e.target.checked})}
                            className="rounded border-gray-300 text-green-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Production Plants</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {filteredPlants.length}
                        </span>
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showStorage}
                            onChange={(e) => setFilters({...filters, showStorage: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Storage Facilities</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {filteredStorage.length}
                        </span>
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showPipelines}
                            onChange={(e) => setFilters({...filters, showPipelines: e.target.checked})}
                            className="rounded border-gray-300 text-gray-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Pipeline Networks</span>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {filteredPipelines.length}
                        </span>
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showRenewable}
                            onChange={(e) => setFilters({...filters, showRenewable: e.target.checked})}
                            className="rounded border-gray-300 text-yellow-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Renewable Sources</span>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {filteredRenewable.length}
                        </span>
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showDemand}
                            onChange={(e) => setFilters({...filters, showDemand: e.target.checked})}
                            className="rounded border-gray-300 text-red-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Demand Centers</span>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {filteredDemand.length}
                        </span>
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showZones}
                            onChange={(e) => setFilters({...filters, showZones: e.target.checked})}
                            className="rounded border-gray-300 text-purple-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Regulatory Zones</span>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {filteredZones.length}
                        </span>
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.showEvaluations}
                            onChange={(e) => setFilters({...filters, showEvaluations: e.target.checked})}
                            className="rounded border-gray-300 text-indigo-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Site Evaluations</span>
                        </div>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {filteredEvaluations.length}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <CogIcon className="h-4 w-4 mr-2" />
                      Status Filters
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Plant Status</label>
                        <select
                          value={filters.plantStatus}
                          onChange={(e) => setFilters({...filters, plantStatus: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Storage Utilization</label>
                        <select
                          value={filters.storageUtilization}
                          onChange={(e) => setFilters({...filters, storageUtilization: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="all">All Levels</option>
                          <option value="high">High (&gt;80%)</option>
                          <option value="medium">Medium (50-80%)</option>
                          <option value="low">Low (&lt;50%)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Renewable Type</label>
                        <select
                          value={filters.renewableType}
                          onChange={(e) => setFilters({...filters, renewableType: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="all">All Types</option>
                          <option value="wind">Wind</option>
                          <option value="solar">Solar</option>
                          <option value="hydro">Hydroelectric</option>
                          <option value="offshore_wind">Offshore Wind</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Demand Type</label>
                        <select
                          value={filters.demandType}
                          onChange={(e) => setFilters({...filters, demandType: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="all">All Industries</option>
                          <option value="industrial">Industrial</option>
                          <option value="transportation">Transportation</option>
                          <option value="chemical">Chemical</option>
                          <option value="energy">Energy</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Zone Type</label>
                        <select
                          value={filters.zoneType}
                          onChange={(e) => setFilters({...filters, zoneType: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="all">All Zones</option>
                          <option value="federal">Federal</option>
                          <option value="state">State</option>
                          <option value="environmental">Environmental</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <LightBulbIcon className="h-4 w-4 mr-2" />
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setFilters({
                          showPlants: true,
                          showStorage: true,
                          showPipelines: true,
                          showRenewable: true,
                          showDemand: true,
                          showZones: true,
                          showEvaluations: true,
                          showProjects: false,
                          plantStatus: 'all',
                          storageUtilization: 'all',
                          renewableType: 'all',
                          demandType: 'all',
                          zoneType: 'all'
                        })}
                        className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Show All Assets
                      </button>
                      
                      <button
                        onClick={() => setFilters({
                          showPlants: false,
                          showStorage: false,
                          showPipelines: false,
                          showRenewable: false,
                          showDemand: false,
                          showZones: false,
                          showEvaluations: false,
                          showProjects: false,
                          plantStatus: 'all',
                          storageUtilization: 'all',
                          renewableType: 'all',
                          demandType: 'all',
                          zoneType: 'all'
                        })}
                        className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Clear All Filters
                      </button>

                      <button
                        onClick={() => setFilters({
                          ...filters,
                          plantStatus: 'active',
                          storageUtilization: 'high',
                          showPlants: true,
                          showStorage: true
                        })}
                        className="w-full px-3 py-2 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                      >
                        Show High Performance
                      </button>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Summary</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Visible:</span>
                        <span className="font-medium">
                          {(filters.showPlants ? filteredPlants.length : 0) +
                           (filters.showStorage ? filteredStorage.length : 0) +
                           (filters.showPipelines ? filteredPipelines.length : 0) +
                           (filters.showRenewable ? filteredRenewable.length : 0) +
                           (filters.showDemand ? filteredDemand.length : 0) +
                           (filters.showZones ? filteredZones.length : 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Layers:</span>
                        <span className="font-medium">
                          {[filters.showPlants, filters.showStorage, filters.showPipelines, 
                            filters.showRenewable, filters.showDemand, filters.showZones, 
                            filters.showEvaluations].filter(Boolean).length}/7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>

                  {/* Storage Utilization Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Storage Utilization</h4>
                    <select
                      value={filters.storageUtilization}
                      onChange={(e) => setFilters({...filters, storageUtilization: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="high">High (&gt;80%)</option>
                      <option value="low">Low (&lt;50%)</option>
                    </select>
                  </div>

                  {/* Renewable Type Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Renewable Type</h4>
                    <select
                      value={filters.renewableType}
                      onChange={(e) => setFilters({...filters, renewableType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="solar">Solar</option>
                      <option value="wind">Wind</option>
                      <option value="offshore wind">Offshore Wind</option>
                      <option value="hydroelectric">Hydroelectric</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setFilters({
                        showPlants: true,
                        showStorage: true,
                        showPipelines: true,
                        showRenewable: true,
                        showDemand: true,
                        showZones: true,
                        plantStatus: 'all',
                        storageUtilization: 'all',
                        renewableType: 'all',
                      });
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Reset Filters
                  </button>
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
                            <Popup>
                              <div className="p-2">
                                <h4 className="font-semibold text-green-800">{plant.name}</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {plant.type}<br/>
                                  <strong>Capacity:</strong> {plant.capacity}<br/>
                                  <strong>Production:</strong> {plant.productionRate}<br/>
                                  <strong>Status:</strong> {plant.status}<br/>
                                  <strong>Efficiency:</strong> {plant.efficiency}
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
                                  <strong>Priority:</strong> {center.priority}<br/>
                                  <strong>Industry:</strong> {center.industry}
                                </p>
                              </div>
                            </Popup>
                            <Tooltip permanent direction="top" offset={[0, -20]} className="text-xs">
                              {center.name}
                            </Tooltip>
                          </Marker>
                        ))}
                      </LayerGroup>
                    </LayersControl.Overlay>

                    {/* Regulatory Zones Layer */}
                    <LayersControl.Overlay checked name="Regulatory Zones">
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
                                  <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500">
                                      Analyzed: {new Date(evaluation.timestamp).toLocaleDateString()}
                                    </p>
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
                      <LayersControl.Overlay checked name="Selected Location">
                        <Marker
                          position={selectedLocation}
                          icon={createCustomIcon("#FF0000", "🎯")}
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

          {/* Recommendations Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-1"
          >
            <div className="space-y-6">
              {/* Site Analysis Results */}
              {recommendations.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Site Analysis Results
                  </h3>
                  
                  {recommendations[0] && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Overall Score</span>
                          <span className="text-lg font-bold text-blue-600">
                            {recommendations[0].overallScore.toFixed(1)}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${recommendations[0].overallScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Recommendations:</h4>
                        {recommendations[0].recommendations.map((rec, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{rec.type}</span>
                              <span className="text-sm font-bold text-green-600">
                                {rec.score.toFixed(1)}/100
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{rec.description}</p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {rec.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Asset Statistics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <BuildingOffice2Icon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Production Plants</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{filteredPlants.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <CubeIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Storage Facilities</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{filteredStorage.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <RectangleGroupIcon className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Pipelines</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">{pipelines.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Renewable Sources</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">{filteredRenewable.length}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span>Production Plants (P)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span>Storage Facilities (S)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-1 bg-gray-500 mr-2"></div>
                    <span>Pipelines</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Renewable Sources (R)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <span>Demand Centers (D)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-300 rounded-full mr-2 opacity-50"></div>
                    <span>Regulatory Zones</span>
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

export default InfrastructureMapping;
