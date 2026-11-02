'use client';

import {useMemo} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {alpha, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {formatDate, getCurrentDateTime} from '@/shared/utils/dateUtils';

interface ChecklistSuccessHeaderProps {
  answeredCount: number;
  totalQuestions: number;
}

const ChecklistSuccessHeader = ({
  answeredCount,
  totalQuestions,
}: ChecklistSuccessHeaderProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const submittedDate = useMemo(
    () =>
      formatDate({
        date: getCurrentDateTime(),
        format: 'MMM d, yyyy h:mm a',
      }),
    []
  );

  return (
    <Card elevation={6} sx={{overflow: 'hidden'}}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
        }}
      >
        <CardContent
          className='flex flex-col sm:flex-row items-center'
          sx={{py: 6, px: 5, gap: {xs: 3, sm: 4}}}
        >
          <Box
            className='flex items-center justify-center'
            sx={{
              width: 72,
              height: 72,
              minWidth: 72,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.success.main, 0.12),
            }}
          >
            <Icon
              icon='mdi:check-bold'
              fontSize='2rem'
              color={theme.palette.success.main}
            />
          </Box>

          <Box className='text-center sm:text-left flex-1'>
            <Typography variant='h5' sx={{fontWeight: 700, mb: 0.5}}>
              {t('checklist.submittedTitle')}
            </Typography>
            <Typography variant='body2' sx={{color: 'text.secondary', mb: 2.5}}>
              {t('checklist.submittedMessage')}
            </Typography>

            <Box
              className='flex flex-wrap justify-center sm:justify-start'
              sx={{gap: 2}}
            >
              <Box
                className='flex items-center rounded'
                sx={{gap: 1, py: 0.75, px: 2, bgcolor: 'background.paper'}}
              >
                <Icon
                  icon='mdi:clipboard-check-outline'
                  fontSize='1rem'
                  color={theme.palette.primary.main}
                />
                <Typography
                  variant='body2'
                  sx={{fontWeight: 600, color: 'primary.main'}}
                >
                  {t('checklist.answeredCount', {
                    answered: answeredCount,
                    total: totalQuestions,
                  })}
                </Typography>
              </Box>
              <Box
                className='flex items-center rounded'
                sx={{gap: 1, py: 0.75, px: 2, bgcolor: 'background.paper'}}
              >
                <Icon
                  icon='mdi:clock-outline'
                  fontSize='1rem'
                  color={theme.palette.text.secondary}
                />
                <Typography
                  variant='body2'
                  sx={{fontWeight: 500, color: 'text.secondary'}}
                >
                  {submittedDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ChecklistSuccessHeader;
