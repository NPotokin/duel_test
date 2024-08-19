import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSpeed, setFireSpeed } from '../../store/playerSlice';
import { RootState } from '../../store/store';
import './settings.css';

interface SettingsProps {
  player: 'ball1' | 'ball2';
}

const Settings: React.FC<SettingsProps> = ({ player }) => {
  const dispatch = useDispatch();
  const playerSettings = useSelector((state: RootState) => state.player[player]);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSpeed({ player, speed: Number(event.target.value) }));
  };

  const handleFireSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFireSpeed({ player, fireSpeed: Number(event.target.value) }));
  };

  return (
    <div className={`settings settings--player-${player}`}>
      <h2>Player {player === 'ball1' ? '1' : '2'} Settings</h2>
      <div className="settings__control">
        <label htmlFor="speed">Speed:</label>
        <input
          type="range"
          id="speed"
          min="10"
          max="200"
          step="10"
          value={playerSettings.speed}
          onChange={handleSpeedChange}
        />
        <span>{playerSettings.speed}</span>
      </div>
      <div className="settings__control">
        <label htmlFor="fireSpeed">Fire Speed:</label>
        <input
          type="range"
          id="fireSpeed"
          min="0.1"
          max="5"
          step="0.1"
          value={playerSettings.fireSpeed}
          onChange={handleFireSpeedChange}
        />
        <span>{playerSettings.fireSpeed}</span>
      </div>
    </div>
  );
};

export default Settings;
