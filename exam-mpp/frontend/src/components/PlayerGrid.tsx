import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import './styles/PlayerGrid.css';

interface Player {
  id: number;
  name: string;
  shirt_no: number;
  photo?: string;
  position: string;
  istitular: boolean;
  description: string;
}

const PlayerGrid: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/players')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched players:', data);
        setPlayers(data);
      })
      .catch(error => console.error('Error fetching players:', error));
  }, []);


  return (
    <div className="grid-container">
      {players.map(player => (
        <PlayerCard
          key={player.id}
          name={player.name}
          shirtNo={player.shirt_no}
          istitular={player.istitular}
        />
      ))}
    </div>
  );
};

export default PlayerGrid;
