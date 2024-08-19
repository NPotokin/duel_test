import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  score: number;
  speed: number;
  fireSpeed: number;
  fireColor: string;
  menuVisible: boolean;
}

interface PlayersState {
  ball1: PlayerState;
  ball2: PlayerState;
}

const initialPlayerState: PlayerState = {
  score: 0,
  speed: 100,
  fireSpeed: 2,
  fireColor: 'red',
  menuVisible: false,
};

const initialState: PlayersState = {
  ball1: initialPlayerState,
  ball2: initialPlayerState,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setScore(state, action: PayloadAction<{ player: 'ball1' | 'ball2'; score: number }>) {
      const { player, score } = action.payload;
      state[player].score = score;
    },
    setSpeed(state, action: PayloadAction<{ player: 'ball1' | 'ball2'; speed: number }>) {
      const { player, speed } = action.payload;
      state[player].speed = speed;
    },
    setFireSpeed(state, action: PayloadAction<{ player: 'ball1' | 'ball2'; fireSpeed: number }>) {
      const { player, fireSpeed } = action.payload;
      state[player].fireSpeed = fireSpeed;
    },
    setFireColor(state, action: PayloadAction<{ player: 'ball1' | 'ball2'; fireColor: string }>) {
      const { player, fireColor } = action.payload;
      state[player].fireColor = fireColor;
    },
    setMenuVisible(state, action: PayloadAction<{ player: 'ball1' | 'ball2'; menuVisible: boolean }>) {
      const { player, menuVisible } = action.payload;
      state[player].menuVisible = menuVisible;
    },
  },
});

export const { setScore, setSpeed, setFireSpeed, setFireColor, setMenuVisible } = playerSlice.actions;

export default playerSlice.reducer;
