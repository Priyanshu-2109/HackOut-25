import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import comprehensiveLocalStorageService from '../utils/comprehensiveLocalStorageService';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const ButtonTester = () => {
  const { isAuthenticated, login, logout, signup } = useAuth();
  const { openLogin, openSignup, closeAll } = useModal();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const navigate = useNavigate();

  const testButtons = [
    {
      group: 'Authentication',
      buttons: [
        {
          label: 'Test Login',
          action: () => {
            console.log('🔐 Testing login...');
            login({ identifier: 'test@demo.com', password: 'demo123' });
          },
          type: 'primary'
        },
        {
          label: 'Test Logout',
          action: () => {
            console.log('🚪 Testing logout...');
            logout();
          },
          type: 'secondary'
        },
        {
          label: 'Open Login Modal',
          action: () => {
            console.log('📱 Opening login modal...');
            openLogin();
          },
          type: 'outline'
        },
        {
          label: 'Open Signup Modal',
          action: () => {
            console.log('📝 Opening signup modal...');
            openSignup();
          },
          type: 'outline'
        }
      ]
    },
    {
      group: 'Navigation',
      buttons: [
        {
          label: 'Go to Dashboard',
          action: () => {
            console.log('🏠 Navigating to dashboard...');
            navigate('/dashboard');
          },
          type: 'primary'
        },
        {
          label: 'Go to Analytics',
          action: () => {
            console.log('📊 Navigating to analytics...');
            navigate('/analytics');
          },
          type: 'primary'
        },
        {
          label: 'Go to Optimization',
          action: () => {
            console.log('🔍 Navigating to optimization...');
            navigate('/optimization');
          },
          type: 'primary'
        },
        {
          label: 'Go to Infrastructure',
          action: () => {
            console.log('🗺️ Navigating to infrastructure map...');
            navigate('/infrastructure');
          },
          type: 'primary'
        }
      ]
    },
    {
      group: 'Notifications',
      buttons: [
        {
          label: 'Show Success',
          action: () => {
            console.log('✅ Testing success notification...');
            showSuccess('This is a success message!');
          },
          type: 'success'
        },
        {
          label: 'Show Error',
          action: () => {
            console.log('❌ Testing error notification...');
            showError('This is an error message!');
          },
          type: 'danger'
        },
        {
          label: 'Show Warning',
          action: () => {
            console.log('⚠️ Testing warning notification...');
            showWarning('This is a warning message!');
          },
          type: 'warning'
        },
        {
          label: 'Show Info',
          action: () => {
            console.log('ℹ️ Testing info notification...');
            showInfo('This is an info message!');
          },
          type: 'info'
        }
      ]
    },
    {
      group: 'Data Management',
      buttons: [
        {
          label: 'Initialize All Data',
          action: () => {
            console.log('🌱 Testing data initialization...');
            comprehensiveLocalStorageService.initializeAllData();
            showSuccess('All data initialized successfully!');
          },
          type: 'primary'
        },
        {
          label: 'Get Dashboard Stats',
          action: () => {
            console.log('📈 Testing dashboard stats...');
            const stats = comprehensiveLocalStorageService.getComprehensiveDashboardData();
            console.log('Dashboard stats:', stats);
            showInfo('Dashboard stats retrieved! Check console.');
          },
          type: 'info'
        },
        {
          label: 'Clear All Data',
          action: () => {
            console.log('🗑️ Testing data clearing...');
            comprehensiveLocalStorageService.clearAllData();
            showWarning('All data cleared successfully!');
          },
          type: 'danger'
        },
        {
          label: 'Export Data',
          action: () => {
            console.log('💾 Testing data export...');
            comprehensiveLocalStorageService.exportAllData();
            showSuccess('Data exported successfully!');
          },
          type: 'secondary'
        }
      ]
    }
  ];

  const getButtonClass = (type) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 ";
    switch (type) {
      case 'primary':
        return baseClass + "bg-blue-600 hover:bg-blue-700 text-white";
      case 'secondary':
        return baseClass + "bg-gray-600 hover:bg-gray-700 text-white";
      case 'success':
        return baseClass + "bg-green-600 hover:bg-green-700 text-white";
      case 'danger':
        return baseClass + "bg-red-600 hover:bg-red-700 text-white";
      case 'warning':
        return baseClass + "bg-yellow-600 hover:bg-yellow-700 text-white";
      case 'info':
        return baseClass + "bg-cyan-600 hover:bg-cyan-700 text-white";
      case 'outline':
        return baseClass + "border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600";
      default:
        return baseClass + "bg-gray-200 hover:bg-gray-300 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Button Functionality Tester
          </h1>
          <p className="text-lg text-gray-600">
            Test all button functionalities to ensure everything works perfectly
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <InformationCircleIcon className="h-4 w-4 inline mr-1" />
              Open browser console to see detailed logs for each button test
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {testButtons.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
                {group.group}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.buttons.map((button, buttonIndex) => (
                  <button
                    key={buttonIndex}
                    onClick={button.action}
                    className={getButtonClass(button.type)}
                    title={`Click to test: ${button.label}`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Current Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Authentication
              </h3>
              <p className="text-sm text-green-600 mt-1">
                Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                Local Storage
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                Data Available: {localStorage.getItem('hydrogrid_comprehensive_data') ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Console
              </h3>
              <p className="text-sm text-purple-600 mt-1">
                Check browser console for detailed test results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonTester;
