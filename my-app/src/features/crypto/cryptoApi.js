
import { updateMultipleAssets } from './cryptoSlice';

/**
 * Initial cryptocurrency dataset with market information
 * Used as baseline data for the simulation
 */
export const cryptoData = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 959.48,
      priceChange1h: 0.43,
      priceChange24h: 0.93,
      priceChange7d: 11.11,
      marketCap: 1861618902186,
      volume24h: 43874950947,
      circulatingSupply: 19.85,
      lastUpdated: Date.now(),
    },
    {
      id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      price: 182.46,
      priceChange1h: 0.60,
      priceChange24h: 3.21,
      priceChange7d: 13.68,
      marketCap: 217581279327,
      volume24h: 23547469307,
      circulatingSupply: 120.71,
      lastUpdated: Date.now(),
    },
    {
      id: 3,
      name: 'Tether',
      symbol: 'USDT',
      price: 1.00,
      priceChange1h: 0.00,
      priceChange24h: 0.00,
      priceChange7d: 0.04,
      marketCap: 145320022085,
      volume24h: 92288882007,
      circulatingSupply: 145.27,
      lastUpdated: Date.now(),
    },
    {
      id: 4,
      name: 'XRP',
      symbol: 'XRP',
      price: 2,
      priceChange1h: 0.46,
      priceChange24h: 0.54,
      priceChange7d: 6.18,
      marketCap: 130073814966,
      volume24h: 5131481491,
      circulatingSupply: 58.39,
      lastUpdated: Date.now(),
    },
    {
      id: 5,
      name: 'BNB',
      symbol: 'BNB',
      price: 6.65,
      priceChange1h: 0.09,
      priceChange24h: -1.20,
      priceChange7d: 3.73,
      marketCap: 85471956947,
      volume24h: 1874281784,
      circulatingSupply: 140.89,
      lastUpdated: Date.now(),
    },
    {
        id: 6,
        name: 'Solana',
        symbol: 'SOL',
        price: 15.50,
        priceChange1h: 0.21,
        priceChange24h: 1.32,
        priceChange7d: 5.67,
        marketCap: 64283719456,
        volume24h: 2148392714,
        circulatingSupply: 512.23,
        lastUpdated: Date.now(),
      },
  ];
  
/**
 * Simulates real-time cryptocurrency data updates
 * Used for development and testing environments
 */
export class CryptoWebSocketSimulator {
    /**
     * Creates a new simulator instance
     *  store - Redux store for state management
     */
    constructor(store) {
      this.store = store;
      this.interval = null;
    }
  
    /**
     * Starts the simulation by updating prices at regular intervals
     * CryptoWebSocketSimulator - Returns this instance for chaining
     */
    connect() {
      // Simulate WebSocket connection with setInterval
      this.interval = setInterval(() => {
        const updates = this.generateRandomUpdates();
        this.store.dispatch(updateMultipleAssets({ updates }));
      }, 1500);
      
      return this;
    }
  
    /**
     * Stops the simulation and cleans up resources
     */
    disconnect() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  
    /**
     * Generates randomized price updates for all assets
     *  Array of asset updates with new price data
     */
    generateRandomUpdates() {
      // Generate random updates for all assets
      return cryptoData.map(asset => {
        // Random price change between -1% and +1%
        const priceChange = (Math.random() * 2 - 1) * (asset.price * 0.01);
        const newPrice = Math.max(asset.price + priceChange, 0.01);
        
        // Random percentage changes for different timeframes
        const priceChange1h = asset.priceChange1h + (Math.random() * 0.2 - 0.1);
        const priceChange24h = asset.priceChange24h + (Math.random() * 0.3 - 0.15);
        const priceChange7d = asset.priceChange7d + (Math.random() * 0.4 - 0.2);
        
        // Random volume change (up to 2%)
        const volumeChange = (Math.random() * 0.04 - 0.02) * asset.volume24h;
        const newVolume = Math.max(asset.volume24h + volumeChange, 1000);
  
        return {
          id: asset.id,
          data: {
            price: parseFloat(newPrice.toFixed(2)),
            priceChange1h: parseFloat(priceChange1h.toFixed(2)),
            priceChange24h: parseFloat(priceChange24h.toFixed(2)),
            priceChange7d: parseFloat(priceChange7d.toFixed(2)),
            volume24h: Math.floor(newVolume),
          }
        };
      });
    }
  }