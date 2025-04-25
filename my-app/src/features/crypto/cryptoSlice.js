import { createSlice } from '@reduxjs/toolkit';
import { cryptoData } from './cryptoApi';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
  assets: cryptoData || [],
  status: 'idle',
  error: null,
  filters: {
    searchTerm: '',
    minPrice: null,
    maxPrice: null,
    priceChangeType: null,
  },
  sorting: {
    column: 'marketCap',
    direction: 'desc'
  }
};

/**
 * Redux slice for cryptocurrency data management
 * Handles asset updates, filtering, and sorting operations
 */
export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    /**
     * Updates a single cryptocurrency asset's properties
     *  state - Current Redux state
     *  action - Action with payload containing id and updates
     */
    updateAsset: (state, action) => {
      const { id, updates } = action.payload;
      const assetIndex = state.assets.findIndex(asset => asset.id === id);
      if (assetIndex !== -1) {
        state.assets[assetIndex] = { 
          ...state.assets[assetIndex],
          ...updates,
          lastUpdated: Date.now(),
        };
      }
    },
    
    /**
     * Updates multiple cryptocurrency assets simultaneously
     */
    updateMultipleAssets: (state, action) => {
      const { updates } = action.payload;
      if (!Array.isArray(state.assets)) {
        state.assets = []; // Initialize assets as an empty array if it's undefined
      }
      
      if (Array.isArray(updates)) {
        updates.forEach(update => {
          const assetIndex = state.assets.findIndex(asset => asset.id === update.id);
          if (assetIndex !== -1) {
            state.assets[assetIndex] = {
              ...state.assets[assetIndex],
              ...update.data,
              lastUpdated: Date.now(),
            };
          }
        });
      }
    },
    
    /**
     * Sets the search filter term
     */
    setSearchFilter: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    
    /**
     * Sets the price range filter
     */
    setPriceFilter: (state, action) => {
      const { min, max } = action.payload;
      state.filters.minPrice = min;
      state.filters.maxPrice = max;
    },
    
    /**
     * Sets the price change filter (gainers/losers)
     */
    setPriceChangeFilter: (state, action) => {
      state.filters.priceChangeType = action.payload;
    },
    
    /**
     * Sets the sorting column and direction
     */
    setSorting: (state, action) => {
      const { column, direction } = action.payload;
      state.sorting = { column, direction };
    },
    
    /**
     * Resets all filters to their initial state
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
});

// Action creators exported from the slice
export const { 
  updateAsset, 
  updateMultipleAssets,
  setSearchFilter,
  setPriceFilter,
  setPriceChangeFilter,
  setSorting,
  resetFilters
} = cryptoSlice.actions;

/**
 * Selects all cryptocurrency assets from state

 */
export const selectAllAssets = (state) => {
  return state?.crypto?.assets || [];
};

/**
 * Selects filter settings from state
 */
export const selectFilters = (state) => state.crypto.filters;

/**
 * Selects sorting settings from state
 */
export const selectSorting = (state) => state.crypto.sorting;

/**
 * Selects a specific asset by ID
 */
export const selectAssetById = (state, assetId) =>
  state.crypto.assets.find(asset => asset.id === assetId);

/**
 * Memoized selector that applies filters and sorting to assets
 * Improves performance by only recalculating when inputs change
 */
export const selectFilteredSortedAssets = createSelector(
  [selectAllAssets, selectFilters, selectSorting],
  (assets, filters, sorting) => {
    // Ensure assets is an array
    if (!assets || !Array.isArray(assets)) {
      return [];
    }
    
    // Apply filters
    let filteredAssets = [...assets];
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) || 
        asset.symbol.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.minPrice !== null) {
      filteredAssets = filteredAssets.filter(asset => asset.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== null) {
      filteredAssets = filteredAssets.filter(asset => asset.price <= filters.maxPrice);
    }
    
    if (filters.priceChangeType === 'gainers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h > 0);
    } else if (filters.priceChangeType === 'losers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h < 0);
    }
    
    // Apply sorting
    filteredAssets.sort((a, b) => {
      const aValue = a[sorting.column];
      const bValue = b[sorting.column];
      
      if (aValue === bValue) return 0;
      
      const compareResult = aValue > bValue ? 1 : -1;
      return sorting.direction === 'asc' ? compareResult : -compareResult;
    });
    
    return filteredAssets;
  }
);

export default cryptoSlice.reducer;