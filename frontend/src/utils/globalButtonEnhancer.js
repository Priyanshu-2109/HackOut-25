/**
 * 🎯 Global Button Enhancer
 * Automatically enhances all buttons with click tracking and error handling
 */

// Add global button click tracking
export const initializeGlobalButtonTracking = () => {
  console.log('🎯 Initializing global button tracking...');
  
  // Track all button clicks
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
      const buttonText = button.textContent?.trim() || 'Unknown Button';
      const buttonId = button.id || 'No ID';
      const buttonClass = button.className || 'No Class';
      
      console.log('🔘 Button Clicked:', {
        text: buttonText,
        id: buttonId,
        classes: buttonClass,
        disabled: button.disabled,
        timestamp: new Date().toISOString()
      });
      
      // Visual feedback for all button clicks
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 100);
    }
  });

  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const formId = form.id || 'Unknown Form';
    console.log('📝 Form Submitted:', {
      id: formId,
      action: form.action,
      method: form.method,
      timestamp: new Date().toISOString()
    });
  });

  // Track navigation clicks
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
      const href = link.href;
      const text = link.textContent?.trim();
      
      console.log('🔗 Link Clicked:', {
        href,
        text,
        timestamp: new Date().toISOString()
      });
    }
  });

  console.log('✅ Global button tracking initialized');
};

// Button performance monitor
export const buttonPerformanceMonitor = {
  timings: new Map(),
  
  startTiming: (buttonName) => {
    buttonPerformanceMonitor.timings.set(buttonName, performance.now());
  },
  
  endTiming: (buttonName) => {
    const startTime = buttonPerformanceMonitor.timings.get(buttonName);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ Button "${buttonName}" action took ${duration.toFixed(2)}ms`);
      buttonPerformanceMonitor.timings.delete(buttonName);
      return duration;
    }
    return null;
  }
};
