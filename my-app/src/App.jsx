import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CryptoWebSocketSimulator } from './features/crypto/cryptoApi';
import { BinanceWebSocket } from './features/crypto/binanceWebSocket';
import CryptoTable from './components/CryptoTable';
import { store } from './app/store';
import { selectAllAssets } from './features/crypto/cryptoSlice';
import './App.css';

function App() {
  const [useRealData, setUseRealData] = useState(false); // State to toggle between real and simulated data
  const [websocket, setWebsocket] = useState(null); // State to manage the WebSocket connection
  const assets = useSelector(selectAllAssets); // Access assets from Redux store
  const dispatch = useDispatch(); // Dispatch function to manage state updates

  // Handle toggling between real and simulated data
  useEffect(() => {
    // Disconnect existing websocket if any
    if (websocket) {
      websocket.disconnect();
    }
    
    // Initialize the appropriate WebSocket connection (real or simulated)
    let newWebsocket;
    if (useRealData) {
      // Connect to Binance WebSocket for real data
      newWebsocket = new BinanceWebSocket(store).connect();
    } else {
      // Use simulated crypto data
      newWebsocket = new CryptoWebSocketSimulator(store).connect();
    }
    
    // Set the new WebSocket connection in state
    setWebsocket(newWebsocket);
    
    // Cleanup function to disconnect WebSocket when the component unmounts or toggles
    return () => {
      if (newWebsocket) {
        newWebsocket.disconnect();
      }
    };
  }, [useRealData]); // Re-run effect when `useRealData` changes

  // Handle data source toggle (real vs simulated data)
  const handleToggleDataSource = () => {
    setUseRealData(prev => !prev); // Toggle the state
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Tracker</h1>
        <div className="data-source-toggle">
          <label>
            <input
              type="checkbox"
              checked={useRealData} // Checkbox is checked if using real data
              onChange={handleToggleDataSource} // Toggle data source on change
            />
            Use real Binance data
          </label>
        </div>
      </header>
      <main>
        <CryptoTable /> {/* Render CryptoTable component to display asset data */}
      </main>
      <footer>
        {/* Display footer with the data source and number of assets */}
        <p>Data updates in {useRealData ? 'real-time from Binance' : 'real-time (simulated)'}. All prices in USD.</p>
        <p>Current assets in store: {assets?.length || 0}</p>
      </footer>
    </div>
  );
}

export default App;


