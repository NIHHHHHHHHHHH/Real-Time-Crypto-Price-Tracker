import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../features/crypto/cryptoSlice';
import { loadState, saveState } from '../features/crypto/localStorage';
import throttle from 'lodash/throttle';
import { cryptoData } from '../features/crypto/cryptoApi';

// Load the saved state (only contains filters and sorting)
const savedState = loadState();

// Create the Redux store with combined preloaded state
export const store = configureStore({
  reducer: {
    crypto: cryptoReducer, // Crypto reducer to manage the state related to crypto
  },
  preloadedState: savedState ? {
    crypto: {
      ...savedState.crypto,
      // IMPORTANT: Ensure assets are not overridden by localStorage data
      assets: cryptoData || [] // Use fallback cryptoData if available
    }
  } : undefined // If no saved state exists, initialize with default state
});

// Save state changes to localStorage (with throttling to limit frequency of saving)
store.subscribe(throttle(() => {
  saveState(store.getState()); // Save the current state to localStorage
}, 1000)); // Throttle save to prevent excessive writes to localStorage (every 1 second)
