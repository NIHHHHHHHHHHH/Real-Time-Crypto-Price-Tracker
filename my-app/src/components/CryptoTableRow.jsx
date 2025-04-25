import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectAssetById } from '../features/crypto/cryptoSlice';
import PriceChange from './PriceChange';
import MiniChart from './MiniChart';
// Import crypto icons
import {
   SiBitcoin,
   SiEthereum,
   SiTether,
   SiBinance
} from 'react-icons/si';
// Import other necessary icons
import {
   RiCoinLine,
   RiExchangeDollarLine,
   RiSunLine
} from 'react-icons/ri';

// Mapping crypto symbols to appropriate icons based on the symbol
const getCryptoIcon = (symbol) => {
  switch(symbol) {
    case 'BTC':
      return <SiBitcoin />;
    case 'ETH':
      return <SiEthereum />;
    case 'USDT':
      return <SiTether />;
    case 'XRP':
      return <RiExchangeDollarLine />;
    case 'BNB':
      return <SiBinance />;
    case 'SOL':
      return <RiSunLine />;
    default:
      return <RiCoinLine />;
  }
};

const CryptoTableRow = ({ id, index }) => {
    // Retrieve the asset details from the Redux store using the asset ID
    const asset = useSelector(state => selectAssetById(state, id));
    
    // Return null if the asset does not exist
    if (!asset) return null;
  
    // Format numbers using compact notation (e.g., 1,000 becomes 1K)
    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2
      }).format(num);
    };
  
    // Format numbers as USD currency (e.g., 1000 becomes $1,000.00)
    const formatCurrency = (num) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(num);
    };

    // Prepare the data for the mini chart based on price history
    const chartData = asset.priceHistory 
      ? asset.priceHistory.map(price => ({ value: price })) 
      : null;

    return (
      <tr>
        <td>{index}</td>
        <td>
          <div className="crypto-logo-name">
            {/* Display the crypto logo and name based on the symbol */}
            <span className="crypto-logo">{getCryptoIcon(asset.symbol)}</span>
            <span className="crypto-name">{asset.name}</span>
            <span className="crypto-symbol">{asset.symbol}</span>
          </div>
        </td>
        <td className="price-cell">{formatCurrency(asset.price)}</td>
        <td><PriceChange value={asset.priceChange1h} /></td>
        <td><PriceChange value={asset.priceChange24h} /></td>
        <td><PriceChange value={asset.priceChange7d} /></td>
        <td>{formatNumber(asset.marketCap)}</td>
        <td>{formatNumber(asset.volume24h)}</td>
        <td>{asset.circulatingSupply.toFixed(2)} {asset.symbol}</td>
        <td>
          {/* Display mini chart with positive or negative price change indicator */}
          <MiniChart data={chartData} positive={asset.priceChange7d > 0} />
        </td>
      </tr>
    );
};

export default memo(CryptoTableRow);
