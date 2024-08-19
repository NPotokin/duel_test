import React from 'react';
import './score.css';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ScoreComponent: React.FC = () => {
  const scoreBall1 = useSelector((state: RootState) => state.player.ball1.score);
  const scoreBall2 = useSelector((state: RootState) => state.player.ball2.score);

  return (
    <div>
      <p>Ball 1 Score: {scoreBall1}</p>
      <p>Ball 2 Score: {scoreBall2}</p>
    </div>
  );
};

export default ScoreComponent;
