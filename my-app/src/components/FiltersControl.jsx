import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setSearchFilter, 
  setPriceFilter, 
  setPriceChangeFilter, 
  resetFilters,
  selectFilters
} from '../features/crypto/cryptoSlice';

const FilterControls = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  // Local state for managing the price range filter (min and max)
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  // Handle changes in the search input field
  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value));
  };

  // Handle changes in the price range inputs (min and max prices)
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  // Apply the selected price range filter
  const applyPriceFilter = () => {
    dispatch(setPriceFilter({
      min: priceRange.min === '' ? null : priceRange.min,
      max: priceRange.max === '' ? null : priceRange.max
    }));
  };

  // Handle selecting the price change filter (top gainers or losers)
  const handlePriceChangeFilter = (type) => {
    dispatch(setPriceChangeFilter(type === filters.priceChangeType ? null : type));
  };

  // Reset all filters to their default state
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="filter-container">
      {/* Search input for filtering assets by name or symbol */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {/* Price range filter input fields */}
      <div className="price-filter">
        <input
          type="number"
          name="min"
          placeholder="Min Price"
          value={priceRange.min}
          onChange={handlePriceChange}
          className="price-input"
        />
        <span>to</span>
        <input
          type="number"
          name="max"
          placeholder="Max Price"
          value={priceRange.max}
          onChange={handlePriceChange}
          className="price-input"
        />
        <button onClick={applyPriceFilter} className="apply-btn">Apply</button>
      </div>
      
      {/* Price change filter buttons (Top Gainers and Top Losers) */}
      <div className="change-filter">
        <button 
          className={`filter-btn ${filters.priceChangeType === 'gainers' ? 'active' : ''}`}
          onClick={() => handlePriceChangeFilter('gainers')}
        >
          Top Gainers
        </button>
        <button 
          className={`filter-btn ${filters.priceChangeType === 'losers' ? 'active' : ''}`}
          onClick={() => handlePriceChangeFilter('losers')}
        >
          Top Losers
        </button>
      </div>
      
      {/* Reset button to clear all applied filters */}
      <button onClick={handleResetFilters} className="reset-btn">
        Reset Filters
      </button>
    </div>
  );
};

export default FilterControls;
