'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncConfirmItem,
  HhaSyncConfirmSectionCardProps,
} from '@/shared/interfaces/hhaSync';

/**
 * One grouped block of the Sync confirmation copy. The tinted icon and the
 * bullet dots share the section's palette colour so the three blocks read as
 * distinct at a glance rather than as one wall of text.
 */
const HhaSyncConfirmSectionCard = ({
  section,
}: HhaSyncConfirmSectionCardProps) => {
  const {t} = useTranslation();

  return (
    <Box
      className='rounded border p-4'
      sx={{borderColor: 'divider', bgcolor: 'action.hover'}}
    >
      <Box className='flex items-center gap-3 mb-3'>
        <Box
          className='flex items-center justify-center shrink-0 rounded w-8 h-8'
          sx={{
            color: `${section.color}.main`,
            bgcolor: `rgba(var(--mui-palette-${section.color}-mainChannel) / 0.14)`,
          }}
        >
          <Icon icon={section.icon} fontSize={20} />
        </Box>
        <Typography variant='subtitle1' className='font-semibold'>
          {t(section.titleKey)}
        </Typography>
      </Box>

      <Stack component='ul' spacing={2} className='list-none m-0 p-0'>
        {section.items.map((item: HhaSyncConfirmItem) => (
          <Box
            component='li'
            key={item.labelKey}
            className='flex items-start gap-3'
          >
            <Box
              className='shrink-0 rounded-full w-1.5 h-1.5 mt-2'
              sx={{bgcolor: `${section.color}.main`}}
            />
            <Typography variant='body2' color='text.secondary'>
              <Box
                component='span'
                className='font-semibold'
                sx={{color: 'text.primary'}}
              >
                {t(item.labelKey)}
              </Box>{' '}
              {t(item.textKey)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default HhaSyncConfirmSectionCard;
