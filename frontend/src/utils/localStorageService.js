// LocalStorage service for managing infrastructure data

// Helper function to generate realistic infrastructure data based on optimization results
export const generateInfrastructureData = (optimizationResults) => {
  const regions = {
    'north-america': {
      locations: ['California, USA', 'Texas, USA', 'Alberta, Canada', 'New York, USA'],
      coordinates: [[37.7749, -122.4194], [31.9686, -99.9018], [53.9333, -116.5765], [40.7128, -74.0060]]
    },
    'europe': {
      locations: ['Germany', 'Netherlands', 'Norway', 'France'],
      coordinates: [[51.1657, 10.4515], [52.1326, 5.2913], [60.472, 8.4689], [46.2276, 2.2137]]
    },
    'asia-pacific': {
      locations: ['Japan', 'Australia', 'South Korea', 'New Zealand'],
      coordinates: [[36.2048, 138.2529], [-25.2744, 133.7751], [35.9078, 127.7669], [-40.9006, 174.8860]]
    },
    'global': {
      locations: ['California, USA', 'Germany', 'Japan', 'Australia'],
      coordinates: [[37.7749, -122.4194], [51.1657, 10.4515], [36.2048, 138.2529], [-25.2744, 133.7751]]
    }
  };

  const plantTypes = ['Solar Electrolysis', 'Wind Electrolysis', 'Offshore Wind', 'Hydroelectric'];
  const storageTypes = ['Compressed Gas', 'Liquid Hydrogen', 'Underground Storage', 'Metal Hydride'];

  if (!optimizationResults) {
    return {
      productionPlants: [],
      pipelines: [],
      storageFacilities: [],
      demandForecast: generateDemandForecast(),
      analyticsData: generateAnalyticsData()
    };
  }

  const regionData = regions[optimizationResults.parameters?.region] || regions['global'];
  
  // Generate production plants
  const productionPlants = [];
  for (let i = 0; i < optimizationResults.newPlants; i++) {
    const location = regionData.locations[i % regionData.locations.length];
    const coords = regionData.coordinates[i % regionData.coordinates.length];
    productionPlants.push({
      id: Date.now() + i,
      name: `${plantTypes[i % plantTypes.length]} Plant ${i + 1}`,
      location: location,
      coordinates: coords,
      productionRate: `${Math.floor(Math.random() * 300 + 100)} kg/day`,
      status: Math.random() > 0.2 ? 'Active' : 'Maintenance',
      capacity: `${(Math.random() * 8 + 2).toFixed(1)} MW`,
      efficiency: `${Math.floor(Math.random() * 10 + 85)}%`,
      type: plantTypes[i % plantTypes.length],
      operationalSince: new Date().getFullYear().toString(),
      cost: `$${(Math.random() * 10 + 2).toFixed(1)}M`,
      budget: optimizationResults.parameters.budget
    });
  }

  // Generate storage facilities
  const storageFacilities = [];
  for (let i = 0; i < optimizationResults.newStorage; i++) {
    const location = regionData.locations[i % regionData.locations.length];
    const coords = regionData.coordinates[i % regionData.coordinates.length];
    const capacity = Math.floor(Math.random() * 50000 + 10000);
    const currentLevel = Math.floor(Math.random() * capacity * 0.8);
    
    storageFacilities.push({
      id: Date.now() + i + 100,
      name: `Storage Facility ${i + 1}`,
      location: location,
      coordinates: coords,
      capacity: `${capacity.toLocaleString()} kg`,
      currentLevel: `${currentLevel.toLocaleString()} kg`,
      utilization: `${Math.floor((currentLevel / capacity) * 100)}%`,
      type: storageTypes[i % storageTypes.length],
      status: Math.random() > 0.1 ? 'Operational' : 'Maintenance',
      safety: `Level ${Math.floor(Math.random() * 3 + 1)}`,
      cost: `$${(Math.random() * 20 + 5).toFixed(1)}M`,
      temperature: `${Math.floor(Math.random() * 10 - 20)}°C`
    });
  }

  // Generate pipelines
  const pipelines = [];
  for (let i = 0; i < optimizationResults.newPipelines; i++) {
    const startLocation = regionData.locations[i % regionData.locations.length];
    const endLocation = regionData.locations[(i + 1) % regionData.locations.length];
    const startCoords = regionData.coordinates[i % regionData.coordinates.length];
    const endCoords = regionData.coordinates[(i + 1) % regionData.coordinates.length];
    
    pipelines.push({
      id: Date.now() + i + 200,
      route: `${startLocation} to ${endLocation}`,
      length: `${Math.floor(Math.random() * 200 + 100)} km`,
      diameter: `${Math.floor(Math.random() * 20 + 30)} inches`,
      status: Math.random() > 0.15 ? 'Operational' : 'Under Construction',
      capacity: `${Math.floor(Math.random() * 500 + 200)} kg/hour`,
      pressure: `${Math.floor(Math.random() * 20 + 60)} bar`,
      coordinates: [startCoords, endCoords],
      cost: `$${(Math.random() * 40 + 20).toFixed(1)}M`,
      completionYear: new Date().getFullYear().toString()
    });
  }

  return {
    productionPlants,
    pipelines,
    storageFacilities,
    demandForecast: generateDemandForecast(optimizationResults.parameters),
    analyticsData: generateAnalyticsData(productionPlants, storageFacilities)
  };
};

// Generate demand forecast data
const generateDemandForecast = (params) => {
  const currentYear = new Date().getFullYear();
  const forecast = [];
  
  let baseDemand = 1000;
  const growthRates = {
    conservative: 0.15,
    moderate: 0.25,
    aggressive: 0.40
  };
  
  const growthRate = growthRates[params?.demandGrowth] || 0.25;
  
  for (let i = 0; i < 10; i++) {
    forecast.push({
      year: (currentYear + i).toString(),
      demand: Math.floor(baseDemand * Math.pow(1 + growthRate, i)),
      region: params?.region || 'global'
    });
  }
  
  return forecast;
};

// Generate analytics data
const generateAnalyticsData = (plants = [], storage = []) => {
  return {
    totalCapacity: plants.reduce((sum, plant) => sum + parseFloat(plant.capacity || 0), 0),
    totalProduction: plants.reduce((sum, plant) => {
      const production = parseInt(plant.productionRate?.replace(/[^\d]/g, '') || 0);
      return sum + production;
    }, 0),
    storageUtilization: storage.map(facility => ({
      name: facility.name,
      utilization: parseInt(facility.utilization?.replace('%', '') || 0)
    })),
    efficiency: plants.reduce((sum, plant) => sum + parseInt(plant.efficiency?.replace('%', '') || 0), 0) / Math.max(plants.length, 1),
    costSavings: Math.floor(Math.random() * 30 + 10)
  };
};

// LocalStorage service class
export class LocalStorageService {
  
  // Keys for localStorage
  static KEYS = {
    OPTIMIZATION_RESULTS: 'optimizationResults',
    SAVED_CONFIGURATIONS: 'savedConfigurations',
    INFRASTRUCTURE_DATA: 'infrastructureData',
    ANALYTICS_DATA: 'analyticsData'
  };

  // Get optimization results from localStorage
  static getOptimizationResults() {
    const data = localStorage.getItem(this.KEYS.OPTIMIZATION_RESULTS);
    return data ? JSON.parse(data) : null;
  }

  // Get all saved configurations
  static getSavedConfigurations() {
    const data = localStorage.getItem(this.KEYS.SAVED_CONFIGURATIONS);
    return data ? JSON.parse(data) : [];
  }

  // Get infrastructure data
  static getInfrastructureData() {
    const data = localStorage.getItem(this.KEYS.INFRASTRUCTURE_DATA);
    if (data) {
      return JSON.parse(data);
    }
    
    // If no data exists, generate from optimization results
    const optimizationResults = this.getOptimizationResults();
    const infrastructureData = generateInfrastructureData(optimizationResults);
    this.saveInfrastructureData(infrastructureData);
    return infrastructureData;
  }

  // Save infrastructure data
  static saveInfrastructureData(data) {
    localStorage.setItem(this.KEYS.INFRASTRUCTURE_DATA, JSON.stringify(data));
  }

  // Get analytics data
  static getAnalyticsData() {
    const infrastructureData = this.getInfrastructureData();
    return infrastructureData.analyticsData || generateAnalyticsData();
  }

  // Update infrastructure data when optimization results change
  static updateInfrastructureFromOptimization() {
    const optimizationResults = this.getOptimizationResults();
    const infrastructureData = generateInfrastructureData(optimizationResults);
    this.saveInfrastructureData(infrastructureData);
    return infrastructureData;
  }

  // Clear all data
  static clearAllData() {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Clear specific data type
  static clearData(key) {
    localStorage.removeItem(key);
  }

  // Check if infrastructure data exists
  static hasInfrastructureData() {
    return localStorage.getItem(this.KEYS.INFRASTRUCTURE_DATA) !== null;
  }

  // Generate sample data for demonstration
  static generateSampleData() {
    const sampleOptimization = {
      newPlants: 4,
      newPipelines: 3,
      newStorage: 2,
      parameters: {
        budget: 500,
        region: 'north-america',
        priority: 'cost',
        demandGrowth: 'moderate'
      },
      timestamp: new Date().toISOString(),
      costSavings: '18%',
      efficiencyGain: '25%'
    };

    localStorage.setItem(this.KEYS.OPTIMIZATION_RESULTS, JSON.stringify(sampleOptimization));
    return this.updateInfrastructureFromOptimization();
  }
}
