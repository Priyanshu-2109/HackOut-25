// This file will contain all the assets and dummy data for the project

// Dummy data for authentication
export const dummyUser = {
  username: "admin",
  password: "admin",
  email: "admin@hydrogrid.com",
};

// Infrastructure data with geospatial coordinates
export const productionPlants = [
  {
    id: 1,
    name: "Solar Hydrogen Plant Alpha",
    location: "California, USA",
    coordinates: [37.7749, -122.4194],
    productionRate: "150 kg/day",
    status: "Active",
    capacity: "2.5 MW",
    efficiency: "92%",
    type: "Solar Electrolysis",
    operationalSince: "2023",
    cost: "$2.1M",
  },
  {
    id: 2,
    name: "Wind Hydrogen Facility Beta",
    location: "Texas, USA",
    coordinates: [31.9686, -99.9018],
    productionRate: "280 kg/day",
    status: "Active",
    capacity: "4.2 MW",
    efficiency: "89%",
    type: "Wind Electrolysis",
    operationalSince: "2022",
    cost: "$3.8M",
  },
  {
    id: 3,
    name: "Offshore Wind H2 Plant",
    location: "North Sea, UK",
    coordinates: [54.5973, 1.6302],
    productionRate: "450 kg/day",
    status: "Maintenance",
    capacity: "7.1 MW",
    efficiency: "94%",
    type: "Offshore Wind",
    operationalSince: "2024",
    cost: "$12.5M",
  },
  {
    id: 4,
    name: "Hydro Green Facility",
    location: "Norway",
    coordinates: [60.472, 8.4689],
    productionRate: "320 kg/day",
    status: "Active",
    capacity: "5.8 MW",
    efficiency: "96%",
    type: "Hydroelectric",
    operationalSince: "2023",
    cost: "$8.2M",
  },
];

// Pipeline data with route coordinates
export const pipelines = [
  {
    id: 1,
    route: "California Hub to Nevada Storage",
    length: "245 km",
    diameter: "36 inches",
    status: "Operational",
    capacity: "500 kg/hour",
    pressure: "70 bar",
    coordinates: [
      [37.7749, -122.4194],
      [39.8283, -116.4197],
    ],
    cost: "$45M",
    completionYear: "2023",
  },
  {
    id: 2,
    route: "Texas Plant to Louisiana Port",
    length: "180 km",
    diameter: "42 inches",
    status: "Operational",
    capacity: "750 kg/hour",
    pressure: "65 bar",
    coordinates: [
      [31.9686, -99.9018],
      [29.9511, -90.0715],
    ],
    cost: "$62M",
    completionYear: "2022",
  },
  {
    id: 3,
    route: "North Sea to Amsterdam Terminal",
    length: "320 km",
    diameter: "48 inches",
    status: "Under Construction",
    capacity: "1200 kg/hour",
    pressure: "80 bar",
    coordinates: [
      [54.5973, 1.6302],
      [52.3676, 4.9041],
    ],
    cost: "$120M",
    completionYear: "2025",
  },
];

// Storage facilities with enhanced data
export const storageFacilities = [
  {
    id: 1,
    name: "Nevada Underground Storage",
    location: "Nevada, USA",
    coordinates: [39.8283, -116.4197],
    capacity: "50,000 kg",
    currentLevel: "35,000 kg",
    status: "Active",
    type: "Underground Cavern",
    pressure: "350 bar",
    cost: "$25M",
    safetyRating: "A+",
    operationalSince: "2023",
  },
  {
    id: 2,
    name: "Louisiana Coastal Terminal",
    location: "Louisiana, USA",
    coordinates: [29.9511, -90.0715],
    capacity: "75,000 kg",
    currentLevel: "28,000 kg",
    status: "Active",
    type: "Above Ground Tank",
    pressure: "300 bar",
    cost: "$18M",
    safetyRating: "A",
    operationalSince: "2022",
  },
  {
    id: 3,
    name: "Amsterdam Distribution Hub",
    location: "Amsterdam, Netherlands",
    coordinates: [52.3676, 4.9041],
    capacity: "100,000 kg",
    currentLevel: "85,000 kg",
    status: "Maintenance",
    type: "Underground Cavern",
    pressure: "400 bar",
    cost: "$45M",
    safetyRating: "A+",
    operationalSince: "2024",
  },
];

// Optimization scenarios data
export const optimizationScenarios = [
  {
    id: 1,
    name: "Cost Optimization",
    description:
      "Minimize total infrastructure costs while maintaining efficiency",
    parameters: {
      budget: "$500M",
      priority: "cost",
      timeframe: "5 years",
    },
  },
  {
    id: 2,
    name: "Efficiency Maximization",
    description: "Optimize for maximum energy efficiency and production rates",
    parameters: {
      budget: "$750M",
      priority: "efficiency",
      timeframe: "3 years",
    },
  },
  {
    id: 3,
    name: "Environmental Impact",
    description:
      "Minimize environmental footprint while scaling infrastructure",
    parameters: {
      budget: "$600M",
      priority: "sustainability",
      timeframe: "7 years",
    },
  },
];

// Demand forecast data
export const demandForecast = [
  { year: 2024, demand: 1200, region: "North America" },
  { year: 2025, demand: 1800, region: "North America" },
  { year: 2026, demand: 2400, region: "North America" },
  { year: 2027, demand: 3200, region: "North America" },
  { year: 2028, demand: 4500, region: "North America" },
  { year: 2029, demand: 6200, region: "North America" },
  { year: 2030, demand: 8500, region: "North America" },
];

// Cost analysis data
export const costAnalysis = {
  production: { current: "$120M", optimized: "$95M", savings: "21%" },
  storage: { current: "$88M", optimized: "$72M", savings: "18%" },
  transportation: { current: "$227M", optimized: "$189M", savings: "17%" },
  total: { current: "$435M", optimized: "$356M", savings: "18%" },
};

// Features data for home page - updated for sustainable energy focus
export const features = [
  {
    id: 1,
    title: "Trusted Advisor",
    description:
      "Our independent expert advice and specialist knowledge help you make the best energy decisions for your business.",
    icon: "map",
    benefits: [
      "Expert consultation",
      "Independent advice",
      "Specialist knowledge",
    ],
  },
  {
    id: 2,
    title: "Client Focused",
    description:
      "We are committed to client helping you reduce energy costs and become more profitable with tailor-made energy solutions.",
    icon: "optimization",
    benefits: ["Cost reduction", "Profit maximization", "Custom solutions"],
  },
  {
    id: 3,
    title: "Innovative & Productive",
    description:
      "We help clients in new and innovative ways of improving energy efficiency and growth with sustainable solutions.",
    icon: "analytics",
    benefits: ["Innovation", "Efficiency improvement", "Sustainable growth"],
  },
  {
    id: 4,
    title: "Trusted Advisor",
    description:
      "Our Business & Network's specialized energy team focusing on strategic planning and profitable energy strategy.",
    icon: "sustainability",
    benefits: [
      "Strategic planning",
      "Network optimization",
      "Profitable strategies",
    ],
  },
];

// Navigation items
export const navigationItems = [
  { name: "Home", path: "/" },
  { name: "Infrastructure Map", path: "/map" },
  { name: "Optimization", path: "/optimization" },
  { name: "Analytics", path: "/analytics" },
  { name: "Dashboard", path: "/dashboard" },
];
