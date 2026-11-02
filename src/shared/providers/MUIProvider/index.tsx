import {AppRouterCacheProvider} from '@mui/material-nextjs/v16-appRouter';

import {NodeChildrenProps} from '@/shared/interfaces/common';
import ThemeProvider from '@/shared/providers/ThemeProvider';

const MUIProvider = ({children}: NodeChildrenProps) => {
  return (
    <AppRouterCacheProvider options={{enableCssLayer: true}}>
      <ThemeProvider>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MUIProvider;
