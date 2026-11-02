import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {AuthCardHeaderProps} from '@/shared/interfaces/auth';

import AuthIconBadge from './AuthIconBadge';

export default function AuthCardHeader({
  title,
  subtitle,
  eyebrow,
  icon,
  tone,
  titleId,
  titleComponent = 'h1',
}: AuthCardHeaderProps) {
  const heading = (
    <Box className='flex flex-col'>
      {eyebrow && (
        <Typography
          variant='eyebrow'
          sx={{fontSize: {xs: 10, lg: 11}}}
          className='text-ink-muted mb-0.5 font-mono tracking-widest'
        >
          {eyebrow}
        </Typography>
      )}

      <Typography
        variant='h1'
        component={titleComponent}
        id={titleId}
        sx={{fontSize: {xs: 18, lg: 25}}}
      >
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box className='mb-5.5'>
      {icon ? (
        <Box className='flex items-center gap-3'>
          <AuthIconBadge icon={icon} tone={tone} />
          {heading}
        </Box>
      ) : (
        heading
      )}

      {subtitle && (
        <Typography
          variant='body'
          className={`text-ink-muted block ${icon ? 'mt-3' : 'mt-1.5'}`}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
