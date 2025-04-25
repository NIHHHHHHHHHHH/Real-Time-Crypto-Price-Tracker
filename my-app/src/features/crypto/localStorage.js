// Function to load the application state from localStorage
export const loadState = () => {
  try {
    // Retrieve the serialized state from localStorage
    const serializedState = localStorage.getItem('cryptoTrackerState');
    
    // If no state is found in localStorage, return undefined
    if (serializedState === null) {
      return undefined;
    }
    
    // Parse the saved state from JSON format
    const savedState = JSON.parse(serializedState);
    
    // Return only the filters and sorting state for the crypto section
    return {
      crypto: {
        // Don't include assets in the saved state to avoid overriding initial state
        filters: savedState.crypto?.filters || {}, // Default to empty object if not available
        sorting: savedState.crypto?.sorting || {}  // Default to empty object if not available
      }
    };
  } catch (err) {
    // Log an error if there's an issue loading the state
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Function to save the application state to localStorage
export const saveState = (state) => {
  try {
    // Create an object containing only the necessary parts of the state (filters and sorting)
    const stateToSave = {
      crypto: {
        filters: state.crypto.filters, // Only save the filters
        sorting: state.crypto.sorting  // Only save the sorting
      }
    };
    
    // Serialize the state to JSON format
    const serializedState = JSON.stringify(stateToSave);
    
    // Save the serialized state to localStorage
    localStorage.setItem('cryptoTrackerState', serializedState);
  } catch (err) {
    // Log an error if there's an issue saving the state
    console.error('Error saving state to localStorage:', err);
  }
};
