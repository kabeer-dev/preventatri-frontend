import './globals.css';

import {fontVariables} from '@/@core/theme/fonts';
import TopLoader from '@/shared/components/common/topLoader';
import {NodeChildrenProps} from '@/shared/interfaces/common';

export default async function RootLayout({children}: NodeChildrenProps) {
  return (
    <html lang='en' className={fontVariables}>
      <body>
        <TopLoader />
        {children}
      </body>
    </html>
  );
}
