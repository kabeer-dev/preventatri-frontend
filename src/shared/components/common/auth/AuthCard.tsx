import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import {NodeChildrenProps} from '@/shared/interfaces/common';

export default function AuthCard({children}: NodeChildrenProps) {
  return (
    <Card className='relative w-full max-w-130 overflow-visible'>
      <CardContent className='p-5 lg:p-8'>{children}</CardContent>
    </Card>
  );
}
