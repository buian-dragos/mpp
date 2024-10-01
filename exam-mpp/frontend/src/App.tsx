import React from 'react';
import PlayerGrid from './components/PlayerGrid';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>National Team Players</h1>
      <PlayerGrid />
    </div>
  );
};

export default App;
