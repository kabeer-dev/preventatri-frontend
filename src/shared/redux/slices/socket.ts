import {createSlice, PayloadAction, ThunkAction} from '@reduxjs/toolkit';
import socketIOClient, {Socket} from 'socket.io-client';

import {RootState} from '@/shared/redux/store';
import {SocketState} from '@/shared/types/redux';

const ENDPOINT = process.env.NEXT_PUBLIC_SERVER_URL;

const defaultState: SocketState = {
  value: null,
};

const slice = createSlice({
  name: 'socket',
  initialState: defaultState,
  reducers: {
    resetSocketState: () => defaultState,
    setSocket(state, action: PayloadAction<{value: Socket | null}>) {
      // Socket is a non-serializable class with readonly fields that Immer's
      // WritableDraft cannot wrap — assign via the original state type.
      (state as SocketState).value = action.payload.value;
    },
  },
});

export default slice.reducer;

const actions = slice.actions;

export {actions as socketActions};

export const setSocket =
  (): ThunkAction<
    void,
    RootState,
    unknown,
    PayloadAction<{value: Socket | null}>
  > =>
  (dispatch, getState) => {
    if (!ENDPOINT) {
      throw new Error(
        'NEXT_PUBLIC_SERVER_URL is not defined in environment variables'
      );
    }

    const state = getState();
    const oldSocket = state.socket.value;

    if (oldSocket?.disconnect) {
      oldSocket.disconnect();
    }

    const socket = socketIOClient(ENDPOINT, {
      withCredentials: true,

      // Next rewrites proxy long-polling but not websocket upgrades.
      transports: ['polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect_error', (error) => {
      console.error('[socket] Connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[socket] Disconnected:', reason);
    });

    dispatch(actions.setSocket({value: socket}));
  };

export const getSocket = (state: {socket: SocketState}) => state.socket.value;
