import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setFireColor } from '../../store/playerSlice';
import './menu.css';

interface PlayerMenuProps {
  player: number;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ player }) => {
  const dispatch = useDispatch();

  const playerKey = player === 1 ? 'ball1' : 'ball2';

  const bulletColor = useSelector((state: RootState) => state.player[playerKey].fireColor);
  const menuVisible = useSelector((state: RootState) => state.player[playerKey].menuVisible);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    dispatch(setFireColor({ player: playerKey, fireColor: color }));
  };

  if (!menuVisible) {
    return null; 
  }

  return (
    <div className="player-menu">
      <h2>Player {player} Menu</h2>
      <div>
        <label>Select Bullet Color:</label>
        <input
          type="color"
          value={bulletColor}
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
};

export default PlayerMenu;
