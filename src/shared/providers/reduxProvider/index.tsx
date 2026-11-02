'use client';

import {Provider} from 'react-redux';

import {NodeChildrenProps} from '@/shared/interfaces/common';
import {store} from '@/shared/redux/store';

const ReduxProvider = ({children}: NodeChildrenProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
