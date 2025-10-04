import React, { createContext, useContext, useState } from 'react';

// Create Dashboard Context
const DashboardContext = createContext();

// Custom hook to use dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Dashboard Provider Component
export const DashboardProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger dashboard refresh
  const triggerDashboardRefresh = (reason = 'unknown') => {
    console.log('🔔 Dashboard refresh triggered:', reason);
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    refreshTrigger,
    triggerDashboardRefresh
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;