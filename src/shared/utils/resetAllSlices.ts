import {hhaSyncActions} from '@/shared/redux/slices/hhaSync';
import {getSocket, socketActions} from '@/shared/redux/slices/socket';
import {AppDispatch, store} from '@/shared/redux/store';

export const resetAllSlices = () => (dispatch: AppDispatch) => {
  const socket = getSocket(store.getState());
  if (socket?.disconnect) {
    socket.disconnect();
  }

  dispatch(socketActions.resetSocketState());
  dispatch(hhaSyncActions.resetHhaSyncState());

  // Other slices
};
