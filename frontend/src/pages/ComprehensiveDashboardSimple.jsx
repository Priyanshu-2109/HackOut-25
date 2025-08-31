import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CogIcon, 
  ChartBarIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { comprehensiveLocalStorageService } from '../utils/comprehensiveLocalStorageService';

const ComprehensiveDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🌱 Loading Comprehensive MVP Dashboard...');
        
        // Get comprehensive data from local storage service
        const comprehensiveData = comprehensiveLocalStorageService.getComprehensiveDashboardData();
        setDashboardData(comprehensiveData);
        
        console.log('✅ Comprehensive MVP data loaded successfully:', comprehensiveData);
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        setLoading(false);
      }
    };

    loadData();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      const updatedData = comprehensiveLocalStorageService.getComprehensiveDashboardData();
      setDashboardData(updatedData);
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleQuickAction = (actionType) => {
    console.log(`🎯 Quick action: ${actionType}`);
    
    switch (actionType) {
      case 'export':
        try {
          comprehensiveLocalStorageService.exportAllData();
          alert('Data exported successfully!');
        } catch (error) {
          console.error('Export failed:', error);
          alert('Export failed. Check console for details.');
        }
        break;
      case 'map':
        navigate('/map');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'optimization':
        navigate('/optimization');
        break;
      default:
        alert(`${actionType} functionality coming soon!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xl text-gray-600 mb-2">Loading Comprehensive MVP</p>
          <p className="text-sm text-gray-500">Initializing all modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🌱 HydroGrid MVP Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive Green Hydrogen Infrastructure Management Platform
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>Welcome back, {user?.name || 'User'}</span>
                <span>•</span>
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* View Selector */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg">
            {[
              { id: 'overview', name: 'Overview', emoji: '📊' },
              { id: 'infrastructure', name: 'Infrastructure', emoji: '🏭' },
              { id: 'analytics', name: 'Analytics', emoji: '📈' },
              { id: 'optimization', name: 'AI Optimization', emoji: '🤖' },
              { id: 'projects', name: 'Projects', emoji: '📋' }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                  selectedView === view.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{view.emoji}</span>
                <span>{view.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CogIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assets</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.infrastructure?.totalAssets || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.projects?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.realtime?.totalCapacity || 0} MW
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current View Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View
              </h3>
              
              {selectedView === 'overview' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Welcome to the HydroGrid comprehensive MVP dashboard. This platform provides 
                    complete management of green hydrogen infrastructure.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Infrastructure Health</h4>
                      <p className="text-sm text-blue-700">All systems operational</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">System Efficiency</h4>
                      <p className="text-sm text-green-700">
                        {dashboardData?.realtime?.efficiency || 95}% efficiency
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedView === 'infrastructure' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Infrastructure Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium">Production Plants</h5>
                      <p className="text-2xl font-bold text-blue-600">
                        {dashboardData?.infrastructure?.productionPlants?.length || 3}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium">Storage Facilities</h5>
                      <p className="text-2xl font-bold text-green-600">
                        {dashboardData?.infrastructure?.storageFacilities?.length || 2}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedView === 'analytics' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Analytics & Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium">Energy Production</h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {dashboardData?.analytics?.energyProduction || '1,250 MWh'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium">Carbon Reduction</h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {dashboardData?.environmental?.co2Reduction || '850 tons'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedView === 'optimization' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">AI-Powered Optimization</h4>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-900">Latest Recommendations</h5>
                    <p className="text-sm text-purple-700">
                      System analysis suggests optimizing hydrogen production schedules 
                      during peak renewable energy hours for 15% efficiency gain.
                    </p>
                    <button 
                      onClick={() => handleQuickAction('optimization')}
                      className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Run New Analysis
                    </button>
                  </div>
                </div>
              )}

              {selectedView === 'projects' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Project Management</h4>
                  <div className="space-y-3">
                    {dashboardData?.projects?.slice(0, 3).map((project, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{project.name}</h5>
                            <p className="text-sm text-gray-600">{project.status}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'Active' ? 'bg-green-100 text-green-800' :
                            project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500">No projects available. Create your first project!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Real-time Data */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Export Data', icon: DocumentTextIcon, action: 'export' },
                  { name: 'View Map', icon: MapPinIcon, action: 'map' },
                  { name: 'Analytics', icon: ChartBarIcon, action: 'analytics' },
                  { name: 'Optimize', icon: CogIcon, action: 'optimization' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors hover:shadow-md"
                    title={`Click to ${action.name.toLowerCase()}`}
                  >
                    <action.icon className="h-6 w-6 text-gray-600 mb-2" />
                    <span className="text-sm text-gray-900 font-medium">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Health</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Efficiency</span>
                  <span className="text-sm font-medium text-gray-900">
                    {dashboardData?.realtime?.efficiency || 95}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Alerts</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Maintenance</span>
                  <span className="text-sm font-medium text-gray-900">7 days</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ComprehensiveDashboard;
