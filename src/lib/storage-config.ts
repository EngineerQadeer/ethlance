// Storage configuration for different environments
export const STORAGE_CONFIG = {
  // Use localStorage in development, Firebase in production
  useLocalStorage: typeof window !== 'undefined' && 
    (window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     process.env.NODE_ENV === 'development'),
  
  // Firebase configuration
  firebase: {
    enabled: process.env.NODE_ENV === 'production',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    emulatorPort: 8080,
  },
  
  // localStorage configuration
  localStorage: {
    key: 'ethlance_jobs',
    version: '1.0.0',
  }
};

// Helper function to check if Firebase should be used
export const shouldUseFirebase = (): boolean => {
  return !STORAGE_CONFIG.useLocalStorage && STORAGE_CONFIG.firebase.enabled;
};

// Helper function to get storage method
export const getStorageMethod = (): 'firebase' | 'localStorage' => {
  return STORAGE_CONFIG.useLocalStorage ? 'localStorage' : 'firebase';
};
