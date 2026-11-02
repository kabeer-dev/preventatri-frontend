import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {HhaSyncState} from '@/shared/interfaces/hhaSync';

const defaultState: HhaSyncState = {
  isRunning: false,
  runId: null,
};

/**
 * Tracks whether an HHAeXchange run is in flight.
 *
 * In the store because the Sync control is mounted on five tables and a run
 * outlives the page it was started from. Not persisted: the server is the
 * authority, and a stale `true` would show a permanently spinning button.
 */
const slice = createSlice({
  name: 'hhaSync',
  initialState: defaultState,
  reducers: {
    resetHhaSyncState: () => defaultState,

    syncStarted(state, action: PayloadAction<{runId: string | null}>) {
      state.isRunning = true;
      state.runId = action.payload.runId;
    },

    syncFinished: () => defaultState,

    // Seeded from the server on mount so a reload mid-run restores the state.
    syncRunningResolved(state, action: PayloadAction<{isRunning: boolean}>) {
      state.isRunning = action.payload.isRunning;
    },
  },
});

export default slice.reducer;

const actions = slice.actions;

export {actions as hhaSyncActions};

export const getIsHhaSyncRunning = (state: {hhaSync: HhaSyncState}) =>
  state.hhaSync.isRunning;
