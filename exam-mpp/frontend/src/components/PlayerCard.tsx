import React from 'react';
import './styles/PlayerCard.css';

interface PlayerCardProps {
  name: string;
  shirtNo: number;
  istitular: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, shirtNo, istitular }) => {
  return (
    <div className={`card`} style={{ backgroundColor: istitular ? '#dbc824' : '#5d5555' }}>
      <div className="placeholder">
        <p>{name}</p>
        <p>{shirtNo}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
