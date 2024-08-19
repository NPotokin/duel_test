import React from 'react';
import Game from './Components/Game/Game';
import PlayerMenu from './Components/Menu/Menu';
import Settings from './Components/Settings/Settings';
import Score from './Components/Score/Score';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="app__score">
        <Score />
      </div>
      <div className="app__menu">
        <div className='player__menu'>  
          <PlayerMenu player={1} />
          <Settings player={'ball1'} />
        </div>
        <Game />
        <div className='player__menu'>  
          <PlayerMenu player={2} />
          <Settings player={'ball2'} />
        </div>
      </div>
    </div>
  );
};

export default App;
