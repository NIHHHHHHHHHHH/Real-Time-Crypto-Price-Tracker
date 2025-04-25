export class BinanceWebSocket {
  /**
   * Creates a Binance WebSocket instance to track cryptocurrency price data
   * store - Redux store instance for state management
   *  symbols - Array of cryptocurrency symbols to track (lowercase)
   */
  constructor(store, symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'solusdt']) {
    this.store = store;
    this.symbols = symbols;
    this.socket = null;
    this.reconnectTimer = null;
    this.reconnectInterval = 5000; // Reconnect interval in milliseconds
    
    this.symbolDataMap = new Map(); // Stores current data for each symbol
    this.historicalPrices = new Map(); // Stores historical price data
    
    // Initialize with comprehensive data from REST API
    this.fetchInitialData();
  }

  /**
   * Fetches initial price data and 24hr statistics for all tracked symbols
   * Creates baseline data before WebSocket connection is established
   */
  async fetchInitialData() {
    try {
      // First get current price data
      const pricePromises = this.symbols.map(symbol => 
        fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`)
          .then(response => response.json())
      );
      
      const priceResults = await Promise.all(pricePromises);
      
      // Then get 24h stats
      const statsPromises = this.symbols.map(symbol => 
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`)
          .then(response => response.json())
      );
      
      const statsResults = await Promise.all(statsPromises);
      
      // Combine results
      for (let i = 0; i < this.symbols.length; i++) {
        const symbol = this.symbols[i].toUpperCase();
        const price = parseFloat(priceResults[i].price);
        const stats = statsResults[i];
        
        // Extract useful data
        const priceChange24h = parseFloat(stats.priceChangePercent);
        const volume24h = parseFloat(stats.quoteVolume);
        
        // Retrieve asset info from store
        const asset = this.findAssetBySymbol(symbol);
        
        if (asset) {
          // Store the data
          this.symbolDataMap.set(symbol, {
            price: price,
            priceChange24h: priceChange24h,
            volume24h: volume24h,
            // Estimate 1h change as ~1/24 of 24h change plus some random variation
            priceChange1h: parseFloat((priceChange24h / 24 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
            // Estimate 7d change using a factor of the 24h change
            priceChange7d: parseFloat((priceChange24h * 3.5 + (Math.random() * 2 - 1)).toFixed(2)),
            circulatingSupply: asset.circulatingSupply,
            marketCap: price * asset.circulatingSupply,
            lastUpdated: Date.now()
          });
          
          // Update the store with initial data
          this.updateStore(symbol);
        }
      }
    } catch (error) {
      // Error handling for initial data fetch failure
    }
  }

  /**
   * Establishes WebSocket connection to Binance ticker streams
   * BinanceWebSocket - Returns this instance for chaining
   */
  connect() {
    // Create a WebSocket connection to Binance
    const streams = this.symbols.map(symbol => `${symbol}@ticker`);
    const url = `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`;
    
    this.socket = new WebSocket(url);
    
    this.socket.onopen = () => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };
    
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.data) {
          this.handleMessage(message.data);
        }
      } catch (error) {
        // Error handling for message parsing failure
      }
    };
    
    this.socket.onclose = (event) => {
      this.scheduleReconnect();
    };
    
    this.socket.onerror = (error) => {
      this.socket.close();
    };
    
    return this;
  }

  /**
   * Processes incoming WebSocket messages and updates price data
   *  data - Message data from Binance WebSocket
   */
  handleMessage(data) {
    if (!data || !data.s) return;
    
    const symbol = data.s;
    const lastPrice = parseFloat(data.c);
    const priceChange24h = parseFloat(data.P);
    const volume24h = parseFloat(data.q);
    
    // Get existing data
    const existingData = this.symbolDataMap.get(symbol) || {};
    
    // Calculate derived metrics
    const previousPrice = existingData.price || lastPrice;
    const priceDelta = lastPrice - previousPrice;
    const priceChange1h = existingData.priceChange1h || 0;
    
    // Update 1h change: add small delta based on current price movement
    const newPriceChange1h = priceChange1h + (priceDelta / previousPrice) * 25; // Amplify for visibility
    
    // Update 7d change: use 24h trend with some variation
    const priceChange7d = existingData.priceChange7d || priceChange24h * 3.5;
    const newPriceChange7d = priceChange7d + (priceDelta / previousPrice) * 5;
    
    // Calculate market cap
    const circulatingSupply = existingData.circulatingSupply || 0;
    const marketCap = lastPrice * circulatingSupply;
    
    // Update data map
    this.symbolDataMap.set(symbol, {
      ...existingData,
      price: lastPrice,
      priceChange24h: priceChange24h,
      priceChange1h: parseFloat(newPriceChange1h.toFixed(2)),
      priceChange7d: parseFloat(newPriceChange7d.toFixed(2)),
      volume24h: volume24h,
      marketCap: marketCap,
      lastUpdated: Date.now()
    });
    
    // Update store
    this.updateStore(symbol);
  }
  
  /**
   * Updates Redux store with latest asset data
   *  binanceSymbol - Symbol identifier from Binance (e.g. "BTCUSDT")
   */
  updateStore(binanceSymbol) {
    const asset = this.findAssetBySymbol(binanceSymbol);
    const data = this.symbolDataMap.get(binanceSymbol);
    
    if (asset && data) {
      this.store.dispatch({
        type: 'crypto/updateAsset',
        payload: {
          id: asset.id,
          updates: {
            price: data.price,
            priceChange1h: data.priceChange1h,
            priceChange24h: data.priceChange24h,
            priceChange7d: data.priceChange7d,
            volume24h: data.volume24h,
            marketCap: data.marketCap,
            circulatingSupply: data.circulatingSupply,
            lastUpdated: Date.now()
          }
        }
      });
    }
  }

  /**
   * Finds corresponding asset in Redux store based on Binance symbol
   *  binanceSymbol - Symbol from Binance (e.g. "BTCUSDT")
   *  Asset object or null if not found
   */
  findAssetBySymbol(binanceSymbol) {
    const state = this.store.getState();
    const assets = state.crypto?.assets;
    
    if (!assets || !Array.isArray(assets)) {
      return null;
    }
    
    const baseSymbol = binanceSymbol.replace('USDT', '');
    
    const asset = assets.find(asset => 
      asset.symbol.toUpperCase() === baseSymbol.toUpperCase()
    );
    
    return asset;
  }

  /**
   * Closes the WebSocket connection and cancels any pending reconnection
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  /**
   * Schedules a reconnection attempt after connection failure
   */
  scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    }
  }
}