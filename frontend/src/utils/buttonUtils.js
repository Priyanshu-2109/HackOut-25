/**
 * 🔘 Button Utilities - Comprehensive Button Functionality
 * Ensures all buttons work perfectly with proper feedback and error handling
 */

// Button action wrapper with logging and error handling
export const withButtonLogging = (action, buttonName) => {
  return async (...args) => {
    console.log(`🔘 Button clicked: ${buttonName}`);
    try {
      const result = await action(...args);
      console.log(`✅ Button action completed: ${buttonName}`, result);
      return result;
    } catch (error) {
      console.error(`❌ Button action failed: ${buttonName}`, error);
      throw error;
    }
  };
};

// Enhanced button component with built-in feedback
export const EnhancedButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  loading = false,
  type = 'button',
  title = '',
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const baseClass = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500',
    outline: 'border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 bg-white focus:ring-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };

  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  const handleClick = async (e) => {
    if (disabled || loading) return;
    
    console.log(`🔘 Enhanced button clicked: ${title || 'Unknown'}`);
    try {
      if (onClick) {
        await onClick(e);
      }
    } catch (error) {
      console.error(`❌ Enhanced button error: ${title || 'Unknown'}`, error);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      title={title}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Button test utilities
export const buttonTestUtils = {
  // Test if a button is clickable
  testButtonClickability: (buttonElement) => {
    if (!buttonElement) return false;
    return !buttonElement.disabled && buttonElement.style.display !== 'none';
  },

  // Log button interactions
  logButtonInteraction: (buttonName, action, result) => {
    console.log(`🔘 [${new Date().toISOString()}] ${buttonName}: ${action}`, result);
  },

  // Add click event listener with logging
  addButtonLogger: (selector, buttonName) => {
    const button = document.querySelector(selector);
    if (button) {
      button.addEventListener('click', (e) => {
        console.log(`🔘 Button clicked: ${buttonName}`, e);
      });
    }
  },

  // Test all buttons on page
  testAllButtons: () => {
    const buttons = document.querySelectorAll('button');
    console.log(`🔘 Found ${buttons.length} buttons on page`);
    
    buttons.forEach((button, index) => {
      const buttonText = button.textContent?.trim();
      const isClickable = !button.disabled;
      const hasOnClick = button.onclick || button.getAttribute('onclick');
      
      console.log(`🔘 Button ${index + 1}: "${buttonText}" - Clickable: ${isClickable}, Has Handler: ${!!hasOnClick}`);
    });
  }
};

export default {
  withButtonLogging,
  EnhancedButton,
  buttonTestUtils
};
