import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredSortedAssets } from '../features/crypto/cryptoSlice';
import CryptoTableRow from './CryptoTableRow';
import SortableTableHeader from './SortableTableHeader';
import FilterControls from './FiltersControl';

const CryptoTable = () => {
  // Retrieve filtered and sorted crypto assets from the Redux store
  const assets = useSelector(selectFilteredSortedAssets);

  return (
    <div className="crypto-table-wrapper">
      {/* Render filter controls for cryptocurrency filtering */}
      <FilterControls />
      
      <div className="crypto-table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th>#</th>
              {/* Sortable headers for various asset attributes */}
              <SortableTableHeader column="name">Name</SortableTableHeader>
              <SortableTableHeader column="price">Price</SortableTableHeader>
              <SortableTableHeader column="priceChange1h">1h %</SortableTableHeader>
              <SortableTableHeader column="priceChange24h">24h %</SortableTableHeader>
              <SortableTableHeader column="priceChange7d">7d %</SortableTableHeader>
              <SortableTableHeader column="marketCap">Market Cap</SortableTableHeader>
              <SortableTableHeader column="volume24h">Volume (24h)</SortableTableHeader>
              <SortableTableHeader column="circulatingSupply">Circulating Supply</SortableTableHeader>
              <th>Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              // Render table rows for each filtered crypto asset
              assets.map((asset, index) => (
                <CryptoTableRow 
                  key={asset.id} 
                  id={asset.id} 
                  index={index + 1} 
                />
              ))
            ) : (
              // Fallback UI when no assets match the filters
              <tr>
                <td colSpan="11" className="no-results">
                  No cryptocurrencies match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;
